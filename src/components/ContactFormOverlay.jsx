import React, { useState, useEffect } from "react";
import config from "../utils/config";
import { useTranslation } from "react-i18next";

const ContactFormOverlay = ({ onClose, onSubmit, selectedItems = {} }) => {
  const { t } = useTranslation();
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
      newErrors.fullName = t('forms.required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('forms.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = t('forms.required');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('forms.required');
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
        const selectedProductDetails = {};
        
        try {
          console.log('Procesando selecciones del usuario:', selectedItems);
          
          // Recorrer todas las colecciones con productos seleccionados
          for (const [collection, selectedIndex] of Object.entries(selectedItems)) {
            console.log(`Procesando colección ${collection} con índice ${selectedIndex}`);
            
            // Solo procesar si hay un producto seleccionado (índice diferente de 0)
            if (selectedIndex !== 0) {
              try {
                // Cargar dinámicamente la colección
                const module = await import(`../data/collections/${collection}.json`);
                const products = module.default;
                
                console.log(`Colección ${collection} cargada con ${products?.length || 0} productos`);
                
                // Verificar si el índice seleccionado es válido
                if (products && products.length > selectedIndex) {
                  const product = products[selectedIndex];
                  if (product) {
                    // Guardar el SKU si existe
                    if (product.SKU) {
                      selectedSkus.push(product.SKU);
                    }
                    
                    // Guardar detalles del producto seleccionado
                    selectedProductDetails[collection] = {
                      index: selectedIndex,
                      name: product.name || 'Sin nombre',
                      sku: product.SKU || 'Sin SKU'
                    };
                    
                    console.log(`Producto seleccionado en ${collection}:`, selectedProductDetails[collection]);
                  }
                }
              } catch (error) {
                console.error(`Error al cargar la colección ${collection}:`, error);
              }
            }
          }
          
          console.log('SKUs de productos seleccionados:', selectedSkus.join(', '));
          console.log('Detalles de productos seleccionados:', selectedProductDetails);
        } catch (error) {
          console.error('Error al procesar los SKUs:', error);
        }
        
        // Crear un string con todos los productos seleccionados
        let productsString = 'Ninguno';
        if (selectedSkus.length > 0) {
          productsString = selectedSkus.join(', ');
        }
        
        console.log('String final de productos:', productsString);
        
        // Preparar los datos del formulario con los productos seleccionados
        const formDataWithProducts = {
          ...formData,
          products: productsString,
          selectedItems: {...selectedItems}, // Incluir todas las selecciones originales (copia profunda)
          selectedProductDetails: selectedProductDetails, // Incluir detalles de los productos
          allSelectedSkus: selectedSkus // Incluir array de SKUs para facilitar procesamiento
        };
        
        console.log('Datos del formulario completos para guardar:', formDataWithProducts);
        
        // En lugar de enviar el formulario inmediatamente, lo guardamos en memoria
        // llamando a onSubmit con los datos preparados pero sin enviarlos al servidor
        onSubmit(formDataWithProducts, null);
        
      } catch (error) {
        console.error('Error al procesar el formulario:', error);
        setSubmitError('Hubo un error al procesar el formulario. Por favor, inténtalo de nuevo.');
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
          {t('forms.title', '¡No pierdas tu diseño!')}
        </h2>
        
        <p style={{ 
          textAlign: 'left', 
          marginBottom: '20px', 
          color: 'var(--text-secondary)',
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: 500
        }}>
          {t('forms.subtitle', 'Solo completa tus datos y convierte tu diseño en una realidad.')}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input 
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={t('forms.name')}
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
              placeholder={t('forms.email')}
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
              placeholder={t('forms.company', 'Empresa')}
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
              placeholder={t('forms.phone')}
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
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'white',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 'bold'
              }}
            >
              {t('buttons.back')}
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 'bold',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Enviando...' : t('buttons.submit')}
            </button>
          </div>
          
          {submitError && (
            <p style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>{submitError}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactFormOverlay; 