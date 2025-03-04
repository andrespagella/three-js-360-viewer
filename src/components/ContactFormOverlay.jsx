import React, { useState, useEffect } from "react";

const ContactFormOverlay = ({ onClose, onSubmit }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'La empresa es requerida';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <div 
      style={{
        position: 'absolute',
        top: 17,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: isMobile ? '15px' : '20px',
          borderRadius: '8px',
          maxWidth: isMobile ? '90%' : '80%',
          width: isMobile ? '300px' : '500px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          border: '4px solid #000',
          position: 'relative',
        }}
      >
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '10px', 
          color: 'var(--text-primary)',
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: 'bold'
        }}>
          ¡No pierdas tu diseño!
        </h2>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '20px', 
          color: 'var(--text-secondary)',
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: 500
        }}>
          Solo completa tus datos y convierte tu diseño en una realidad.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nombre y apellido"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: errors.fullName ? '1px solid red' : '1px solid var(--border-medium)',
                fontSize: isMobile ? '14px' : '16px'
              }}
            />
            {errors.fullName && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.fullName}</p>
            )}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: errors.email ? '1px solid red' : '1px solid var(--border-medium)',
                fontSize: isMobile ? '14px' : '16px'
              }}
            />
            {errors.email && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.email}</p>
            )}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Empresa"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: errors.company ? '1px solid red' : '1px solid var(--border-medium)',
                fontSize: isMobile ? '14px' : '16px'
              }}
            />
            {errors.company && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.company}</p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Teléfono"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: errors.phone ? '1px solid red' : '1px solid var(--border-medium)',
                fontSize: isMobile ? '14px' : '16px'
              }}
            />
            {errors.phone && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.phone}</p>
            )}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: '15px'
          }}>
            <button 
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: isMobile ? '6px 12px' : '8px 16px',
                backgroundColor: 'white',
                color: 'black',
                border: '2px solid #000',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 'bold'
              }}
            >
              CANCELAR
            </button>
            
            <button 
              type="submit"
              style={{
                flex: 1,
                padding: isMobile ? '6px 12px' : '8px 16px',
                backgroundColor: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 'bold'
              }}
            >
              CONTINUAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactFormOverlay; 