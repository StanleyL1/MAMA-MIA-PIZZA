import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSpinner, FaCheck } from 'react-icons/fa';
import './PaymentConfirmation.css';

console.log('🚀 PaymentConfirmation module loaded');

const PaymentConfirmation = () => {
  console.log('🔍 PaymentConfirmation component loaded');
  console.log('🔍 Current URL:', window.location.href);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processingMessage] = useState('Verificando el estado del pago...');

  console.log('🔍 Current URL search params:', searchParams.toString());
  console.log('🔍 All search params:', Object.fromEntries(searchParams.entries()));

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '40px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h2>🔄 Procesando tu pago</h2>
        <p>{processingMessage}</p>
        
        <div style={{background: '#f0f0f0', padding: '20px', margin: '20px 0', borderRadius: '8px', textAlign: 'left'}}>
          <h4>Debug Info:</h4>
          <p><strong>URL actual:</strong> {window.location.href}</p>
          <p><strong>Parámetros:</strong> {searchParams.toString()}</p>
          <div>
            <strong>Parámetros individuales:</strong>
            <ul>
              {Array.from(searchParams.entries()).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <button 
          onClick={() => {
            const failureParams = new URLSearchParams({
              transaction_id: searchParams.get('idTransaccion') || 'test',
              error_code: 'INSUFFICIENT_FUNDS',
              error_message: searchParams.get('mensaje') || 'Test Error',
              amount: searchParams.get('monto') || '7.00',
              payment_method: 'Tarjeta'
            });
            navigate(`/payment/failure?${failureParams.toString()}`);
          }}
          style={{
            background: '#e41b17',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Probar Payment Failure
        </button>
        
        <button 
          onClick={() => navigate('/menu')}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Ir al Menú
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
