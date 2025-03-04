/**
 * Configuración para el agente conversacional y otros servicios
 */

const config = {
  // URL del servidor de tokens para el agente conversacional
  // Nota: Asegúrate de que esta URL sea accesible y tenga un certificado válido
  tokenServerUrl: 'https://localhost:3000/token',
  
  // URL de la API de OpenAI para la comunicación en tiempo real
  openAiRealtimeUrl: 'https://api.openai.com/v1/realtime',
  
  // Configuración de servidores ICE para WebRTC
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ],
  
  // Tiempo de inactividad para el screensaver (en milisegundos)
  idleTimeout: 60000, // 60 segundos
  
  // Tiempo de espera antes de iniciar automáticamente el agente conversacional (en milisegundos)
  agentAutoStartDelay: 1000, // 1 segundo
};

export default config; 