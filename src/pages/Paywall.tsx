import React from 'react';
import { useAuthStatus } from '../context/AuthStatusContext';
import { generatePaymentLink } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Paywall: React.FC = () => {
  const { status, clientId, logout, isAuthenticated } = useAuthStatus();
  const navigate = useNavigate();

  if (!isAuthenticated || !clientId) {
      return <p>Acesso negado ou carregando...</p>;
  }
  
  const handlePayment = async () => {
    if (clientId) {
      try {
          alert('Gerando link de pagamento. Aguarde...');

          const link = await generatePaymentLink(clientId); 

          window.location.href = link;
      } catch (error) {
          alert('Erro ao gerar o link. Verifique se o Sistema 3 (Porta 3002) está rodando e se a chave do Stripe está correta.');
          console.error('Erro na geração do link:', error);
      }
    }
  };

  return (
    <div style={{ padding: '30px', textAlign: 'center', border: '2px solid #ff4500', maxWidth: '600px', margin: '50px auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h1>ACESSO RESTRITO (Paywall)</h1>
      <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2em' }}>
        Seu status atual é: {status}
      </p>
      
      <p style={{ marginTop: '20px', fontSize: '1.1em' }}>
        Para liberar o acesso aos eventos e realizar compras, você precisa finalizar a compra da assinatura.
      </p>
      
      <button 
        onClick={handlePayment} 
        style={{ padding: '12px 25px', backgroundColor: '#6200EE', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em', marginTop: '30px' }}
      >
        Finalizar Assinatura (R$ 9,90 - Teste)
      </button>
      
      <p style={{ marginTop: '20px' }}>
        <button onClick={logout} style={{ background: 'none', border: '1px solid #ccc', color: '#666', cursor: 'pointer', padding: '8px 15px' }}>
          Sair / Logout
        </button>
      </p>
    </div>
  );
};

export default Paywall;