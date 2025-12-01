import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStatus } from '../context/AuthStatusContext';
import { useNavigate } from 'react-router-dom';

interface TicketLot {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface EventData {
  id: string;
  name: string;
  location: string;
  date: string;
  ticketLots: TicketLot[];
}

const Events: React.FC = () => {
  const { logout, clientId } = useAuthStatus();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const SISTEMA2_URL_EVENT = 'http://localhost:3001/event';
  const SISTEMA2_URL_BUY = 'http://localhost:3001/order/buy';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        setLoading(false);
        return;
    }

    try {
      const response = await axios.get(SISTEMA2_URL_EVENT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.data);
      setLoading(false);

    } catch (err: any) {
      if (err.response?.status === 403) {
          navigate('/app/paywall');
          return;
      }
      setError(err.response?.data?.message || 'Falha ao buscar eventos. Verifique se o Sistema 1 e 2 estão rodando.');
      setLoading(false);
    }
  };

  const handleBuy = async (lotId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.post(SISTEMA2_URL_BUY, 
        { ticketLotId: lotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Ingresso comprado com sucesso! Estoque atualizado.');
      fetchEvents();
      
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao comprar. Estoque esgotado ou acesso negado.');
    }
  };


  if (loading) return <h1>Carregando Eventos...</h1>;
  if (error) return <h1>Erro: {error}</h1>;

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>⭐ TicketHub: Eventos Liberados</h1>
        <button onClick={logout} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}>
          Sair / Logout
        </button>
      </div>

      <p style={{marginBottom: '20px', color: '#007bff'}}>
        Cliente ID: {clientId} | Status: ACTIVE (Acesso Total)
      </p>

      {events.map((event) => (
        <div key={event.id} style={{ border: '1px solid #333', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
          <h2>{event.name}</h2>
          <p>Local: {event.location} | Data: {new Date(event.date).toLocaleDateString()}</p>
          
          <div style={{ marginTop: '10px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
            {event.ticketLots.map((lot) => (
              <div key={lot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
                <span style={{ fontWeight: 'bold' }}>{lot.name}</span>
                <span>R$ {lot.price.toFixed(2)}</span>
                <span style={{ color: lot.quantity > 10 ? 'green' : 'red' }}>
                  {lot.quantity} ingressos restantes
                </span>
                
                <button 
                  onClick={() => handleBuy(lot.id)} 
                  disabled={lot.quantity <= 0}
                  style={{ padding: '8px 12px', cursor: lot.quantity > 0 ? 'pointer' : 'not-allowed' }}
                >
                  {lot.quantity > 0 ? 'Comprar' : 'Esgotado'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Events;