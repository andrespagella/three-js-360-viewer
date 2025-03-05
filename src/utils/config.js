/**
 * Configuración para el agente conversacional y otros servicios
 */

const config = {
  // URL del servidor de tokens para el agente conversacional
  tokenServerUrl: 'https://server.atrim3dshowcase.com:3000/token',
  formServerUrl: 'https://server.atrim3dshowcase.com:3000/process-form',
  
  // URL de la API de OpenAI para la comunicación en tiempo real
  openAiRealtimeUrl: 'https://api.openai.com/v1/realtime',
  
  // API Key para el servidor de voz
  apiKey: 'client1_a1b2c3d4e5f6g7h8i9j0',
  
  // Configuración de servidores ICE para WebRTC
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ],
  
  // Tiempo de inactividad para el screensaver (en milisegundos)
  idleTimeout: 120000, // 4 minutos
  
  // Tiempo de espera antes de iniciar automáticamente el agente conversacional (en milisegundos)
  agentAutoStartDelay: 1000, // 1 segundo

};

export default config; 