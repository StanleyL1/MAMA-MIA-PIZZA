import { useState, useCallback } from 'react';

const useWompi = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Función para crear transacción en Wompi
  const createTransaction = useCallback(async (orderData, customerData) => {
    setIsProcessing(true);
    setError('');
    
    try {
      const wompiData = {
        amount: orderData.total,
        customer: {
          name: customerData.name,
          email: customerData.email || `temp_${Date.now()}@mamamianpizza.com`,
          phone: customerData.phone
        },
        orderData: orderData,
        returnUrls: {
          success: `${window.location.origin}/payment/success`,
          failure: `${window.location.origin}/payment/failure`
        }
      };

      const response = await fetch('https://api.mamamianpizza.com/api/payments/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(wompiData)
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.redirectUrl) {
          setTransactionId(result.transactionReference);
          return {
            success: true,
            redirectUrl: result.redirectUrl,
            transactionReference: result.transactionReference
          };
        } else {
          throw new Error(result.message || 'Error al crear transacción Wompi');
        }
      } else {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Error de servidor al crear transacción');
      }
    } catch (error) {
      console.error('Error creando transacción Wompi:', error);
      setError(error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Función para verificar el estado de una transacción
  const verifyTransaction = useCallback(async (transactionId, status) => {
    try {
      const response = await fetch(
        `https://api.mamamianpizza.com/api/payments/verify-payment?transactionId=${transactionId}&status=${status}`
      );

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Error del servidor al verificar el pago');
      }
    } catch (error) {
      console.error('Error verificando transacción:', error);
      throw error;
    }
  }, []);

  // Función para obtener configuración de Wompi
  const getWompiConfig = useCallback(async () => {
    try {
      const response = await fetch('https://api.mamamianpizza.com/api/payments/config');
      
      if (response.ok) {
        const config = await response.json();
        return config;
      } else {
        throw new Error('Error al obtener configuración de Wompi');
      }
    } catch (error) {
      console.error('Error obteniendo configuración Wompi:', error);
      throw error;
    }
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError('');
  }, []);

  // Función para limpiar estado
  const reset = useCallback(() => {
    setIsProcessing(false);
    setError('');
    setTransactionId('');
  }, []);

  return {
    isProcessing,
    error,
    transactionId,
    createTransaction,
    verifyTransaction,
    getWompiConfig,
    clearError,
    reset
  };
};

export default useWompi;
