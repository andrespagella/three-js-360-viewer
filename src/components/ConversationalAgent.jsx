import React, { useState, useEffect, useRef } from "react";
import config from "../utils/config";

const ConversationalAgent = ({ language, isActive, onToggle }) => {
  const [status, setStatus] = useState("inactive");
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const audioElementRef = useRef(null);
  const microphoneStreamRef = useRef(null);
  const connectionAttempts = useRef(0);

  // Helper function for cross-browser getUserMedia
  const getMediaStream = async () => {
    try {
      // Modern browsers
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('Using modern getUserMedia');
        return await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      }
      
      // Legacy browsers
      const getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
      );

      if (!getUserMedia) {
        throw new Error('getUserMedia no está soportado en este navegador');
      }

      return new Promise((resolve, reject) => {
        getUserMedia.call(navigator, 
          { audio: true },
          resolve,
          reject
        );
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  };

  // Start the conversation session
  const startSession = async () => {
    try {
      if (peerConnectionRef.current) {
        stopSession();
      }

      connectionAttempts.current += 1;
      setStatus("connecting");
      setErrorMessage("");
      
      console.log('Solicitando token para idioma:', language);
      try {
        const tokenResponse = await fetch(`${config.tokenServerUrl}?lang=${language}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          // Importante para conexiones HTTPS con certificados autofirmados
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          throw new Error(`Error obteniendo token: ${errorText}`);
        }
        
        const data = await tokenResponse.json();
        console.log('Token recibido:', data);

        if (!data || !data.client_secret || !data.client_secret.value) {
          throw new Error('Formato de token inválido');
        }

        const EPHEMERAL_KEY = data.client_secret.value;

        const configuration = {
          iceServers: config.iceServers
        };
        
        peerConnectionRef.current = new RTCPeerConnection(configuration);
        
        peerConnectionRef.current.onicecandidate = (event) => {
          console.log('ICE candidate:', event.candidate);
        };

        peerConnectionRef.current.oniceconnectionstatechange = () => {
          const state = peerConnectionRef.current.iceConnectionState;
          console.log('ICE Connection State:', state);
          setStatus(`connection_${state}`);
        };

        audioElementRef.current = new Audio();
        audioElementRef.current.autoplay = true;

        peerConnectionRef.current.ontrack = (e) => {
          console.log('Track de audio recibido:', e);
          audioElementRef.current.srcObject = e.streams[0];
          // iOS requires user interaction to play audio
          const playPromise = audioElementRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              console.error('Error reproduciendo audio:', err);
              setStatus("audio_blocked");
            });
          }
        };

        // Setup microphone with improved iOS support
        try {
          console.log('Solicitando acceso al micrófono...');
          microphoneStreamRef.current = await getMediaStream();
          console.log('Acceso al micrófono concedido:', microphoneStreamRef.current);
          
          microphoneStreamRef.current.getTracks().forEach(track => {
            console.log('Agregando track de audio:', track);
            peerConnectionRef.current.addTrack(track, microphoneStreamRef.current);
          });

          peerConnectionRef.current.onconnectionstatechange = () => {
            console.log('Connection state changed:', peerConnectionRef.current.connectionState);
            if (peerConnectionRef.current.connectionState === 'connected') {
              console.log('Conexión establecida');
              setStatus("connected");
              connectionAttempts.current = 0;
            }
          };

        } catch (err) {
          console.error('Error detallado accediendo al micrófono:', err);
          setErrorMessage(`Error de micrófono: ${err.message}`);
          setStatus("mic_error");
          return;
        }

        dataChannelRef.current = peerConnectionRef.current.createDataChannel("events");
        dataChannelRef.current.onopen = () => {
          console.log('Canal de datos abierto');
        };
        
        dataChannelRef.current.onmessage = (e) => {
          const message = JSON.parse(e.data);
          console.log('Mensaje recibido:', message);
        };

        const offer = await peerConnectionRef.current.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: false
        });
        
        await peerConnectionRef.current.setLocalDescription(offer);
        console.log('Oferta SDP creada');

        console.log('Enviando oferta a OpenAI...');
        const sdpResponse = await fetch(config.openAiRealtimeUrl, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${EPHEMERAL_KEY}`,
            'Content-Type': 'application/sdp'
          },
          body: offer.sdp
        });

        if (!sdpResponse.ok) {
          const errorText = await sdpResponse.text();
          throw new Error(`Error en respuesta SDP: ${sdpResponse.status} - ${errorText}`);
        }

        const answerSdp = await sdpResponse.text();
        console.log('Respuesta SDP recibida');

        const answer = {
          type: "answer",
          sdp: answerSdp
        };

        await peerConnectionRef.current.setRemoteDescription(answer);
        console.log('Descripción remota establecida');
      } catch (tokenError) {
        console.error('Error obteniendo token:', tokenError);
        setErrorMessage(`Error de conexión: ${tokenError.message}`);
        setStatus("token_error");
        
        // Si hay demasiados intentos fallidos, detener los intentos
        if (connectionAttempts.current >= 3) {
          console.error('Demasiados intentos fallidos, deteniendo la conexión');
          setErrorMessage('Demasiados intentos fallidos. Por favor, intenta más tarde.');
          onToggle(false);
        }
      }
    } catch (error) {
      console.error('Error en la sesión:', error);
      setErrorMessage(`Error: ${error.message}`);
      setStatus("error");
      stopSession();
    }
  };

  // Stop the conversation session
  const stopSession = () => {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
    }
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }
    
    peerConnectionRef.current = null;
    dataChannelRef.current = null;
    audioElementRef.current = null;
    setIsMuted(false);
    setStatus("inactive");
    setErrorMessage("");
  };

  // Toggle mute state
  const toggleMute = () => {
    if (!microphoneStreamRef.current) return;
    
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    
    microphoneStreamRef.current.getAudioTracks().forEach(track => {
      track.enabled = !newMuteState;
    });
  };

  // Effect to start/stop session when isActive changes
  useEffect(() => {
    if (isActive && language && status === "inactive") {
      startSession();
    } else if (!isActive && status !== "inactive") {
      stopSession();
    }
  }, [isActive, language]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  // Render the UI for the conversational agent
  return (
    <div className="conversational-agent">
      {isActive && (
        <div className="agent-controls absolute top-16 right-4 bg-white p-3 rounded-lg shadow-lg z-50 flex flex-col items-center">
          <div className="status-indicator mb-2">
            {status === "connecting" && <p>Conectando...</p>}
            {status === "connected" && <p>{language === 'es' ? 'Conectado - Hablando en español' : 'Conectado - Falando em português'}</p>}
            {status === "error" && <p>Error de conexión</p>}
            {status === "token_error" && <p>Error obteniendo token</p>}
            {status === "mic_error" && <p>Error: No se pudo acceder al micrófono</p>}
            {status === "audio_blocked" && <p>Toque la pantalla para activar el audio</p>}
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={toggleMute} 
              className={`px-3 py-1 rounded ${isMuted ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'}`}
              disabled={status !== "connected"}
            >
              {isMuted ? 'Activar Micrófono' : 'Silenciar'}
            </button>
            <button 
              onClick={() => onToggle(false)} 
              className="px-3 py-1 rounded bg-red-500 text-white"
            >
              Desconectar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationalAgent; 