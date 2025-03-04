import React, { useState, useEffect } from "react";
import config from "../utils/config";

const ContactFormOverlay = ({ onClose, onSubmit, selectedItems = {} }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      
      try {
        // Recopilar los SKUs de los productos seleccionados
        const selectedSkus = [];
        
        try {
          // Recorrer todas las colecciones con productos seleccionados
          for (const [collection, selectedIndex] of Object.entries(selectedItems)) {
            // Solo procesar si hay un producto seleccionado (índice diferente de 0)
            if (selectedIndex !== 0) {
              try {
                // Cargar dinámicamente la colección
                const module = await import(`../data/collections/${collection}.json`);
                const products = module.default;
                
                // Verificar si el índice seleccionado es válido
                if (products && products.length > selectedIndex) {
                  const product = products[selectedIndex];
                  if (product && product.SKU) {
                    selectedSkus.push(product.SKU);
                  }
                }
              } catch (error) {
                console.error(`Error al cargar la colección ${collection}:`, error);
              }
            }
          }
          
          console.log('SKUs de productos seleccionados:', selectedSkus.join(', '));
        } catch (error) {
          console.error('Error al procesar los SKUs:', error);
        }
        
        // Preparar los datos del formulario con los productos seleccionados
        const formDataWithProducts = {
          ...formData,
          products: selectedSkus.length > 0 ? selectedSkus.join(', ') : 'Ninguno'
        };
        
        // Enviar el formulario con los productos seleccionados
        const response = await fetch(config.formServerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey
          },
          body: JSON.stringify(formDataWithProducts),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        // Llamar a onSubmit con los datos y la respuesta del servidor
        onSubmit(formDataWithProducts, data);
        
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        setSubmitError('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
      } finally {
        setIsSubmitting(false);
      }
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
          width: isMobile ? '300px' : '400px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          border: '4px solid #000',
          position: 'relative',
        }}
      >
        <h2 style={{ 
          textAlign: 'left', 
          marginBottom: '10px', 
          color: 'var(--text-primary)',
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: 'bold'
        }}>
          ¡No pierdas tu diseño!
        </h2>
        
        <p style={{ 
          textAlign: 'left', 
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
          
          {submitError && (
            <div style={{ 
              marginBottom: '15px', 
              padding: '8px', 
              backgroundColor: 'rgba(255, 0, 0, 0.1)', 
              borderRadius: '4px',
              color: 'red',
              fontSize: '14px'
            }}>
              {submitError}
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            gap: '15px'
          }}>
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: isMobile ? '6px 12px' : '8px 16px',
                backgroundColor: 'white',
                color: 'black',
                border: '2px solid #000',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 'bold',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              CANCELAR
            </button>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: isMobile ? '6px 12px' : '8px 16px',
                backgroundColor: '#000',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 'bold',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'ENVIANDO...' : 'CONTINUAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactFormOverlay; 