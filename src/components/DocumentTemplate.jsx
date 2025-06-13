import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentTemplate = ({ title, children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  // Efecto para habilitar el scroll en las páginas de documentos
  useEffect(() => {
    // Habilitar scroll para esta página
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.position = 'static';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    
    // Restaurar el estado original cuando el componente se desmonte
    return () => {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.position = 'relative';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100vh';
    };
  }, []);

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        overflow: 'auto',
        zIndex: 9999
      }}
    >
      {/* Header with logo and back button */}
      <header 
        style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/3d-showcase-logo.svg" 
              alt="3D Showcase Logo" 
              style={{ height: '48px', width: 'auto', marginRight: '16px' }}
              onError={(e) => {
                // Fallback si no existe el logo
                e.target.style.display = 'none';
              }}
            />
          </div>
          <button
            onClick={handleBack}
            style={{
              padding: '8px 16px',
              backgroundColor: '#374151',
              color: 'white',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4B5563'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#374151'}
          >
            ← Volver a la aplicación
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: '1024px', margin: '0 auto', padding: '32px' }}>
        {/* Document title */}
        <h1 style={{ 
          fontSize: '30px', 
          fontWeight: 'bold', 
          marginBottom: '32px', 
          textAlign: 'center',
          color: '#111827'
        }}>
          {title}
        </h1>

        {/* Document content */}
        <div style={{ maxWidth: 'none' }}>
          {children}
        </div>

        {/* Footer */}
        <footer style={{ 
          marginTop: '48px', 
          paddingTop: '32px', 
          borderTop: '1px solid #e5e7eb', 
          textAlign: 'center',
          color: '#6B7280'
        }}>
          <p>© 2025 Atrim Argentina S.A. Todos los derechos reservados.</p>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>
            Última actualización: {new Date().toLocaleDateString('es-AR')}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default DocumentTemplate; 