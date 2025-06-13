import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleTermsClick = () => {
    navigate('/terminos-condiciones');
  };

  const handlePrivacyClick = () => {
    navigate('/politica-privacidad');
  };

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 z-40 py-3 px-4 text-center"
      style={{
        backgroundColor: '#000000',
        color: '#FFFFFF',
        borderTop: '1px solid #333333'
      }}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="flex justify-center items-center space-x-6 text-sm">
          <button
            onClick={handleTermsClick}
            className="hover:underline transition-colors duration-200 text-white"
          >
            Términos y Condiciones
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={handlePrivacyClick}
            className="hover:underline transition-colors duration-200 text-white"
          >
            Política de Privacidad
          </button>
        </div>
        <div className="text-xs text-gray-300">
          © 2025 Atrim Argentina S.A. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 