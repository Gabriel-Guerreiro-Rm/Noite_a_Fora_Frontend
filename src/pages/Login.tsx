import React, { useState } from 'react';
import { loginClient, registerClient } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegister && !name)) {
        setError('Preencha todos os campos.');
        return;
    }

    try {
      if (isRegister) {
        await registerClient({ email, password, name });
        alert('Registro realizado com sucesso! Faça login.');
        setIsRegister(false);
      } else {
        const { access_token } = await loginClient({ email, password });
        localStorage.setItem('token', access_token);
        window.location.reload(); 
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro de conexão ou credenciais inválidas.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h1>{isRegister ? 'Registrar Cliente' : 'Fazer Login'}</h1>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div style={{ marginBottom: '10px' }}>
            <label>Nome:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isRegister ? 'Registrar' : 'Entrar'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px' }}>
        {isRegister ? 'Já tem conta? ' : 'Não tem conta? '}
        <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
          {isRegister ? 'Fazer Login' : 'Criar Conta'}
        </button>
      </p>
      
      <p style={{ fontSize: '12px', marginTop: '30px', color: '#666' }}>
        * Lembre-se de iniciar os **Sistemas 1, 2 e 3** nas portas corretas (3001, 3000 e 3002).
      </p>
    </div>
  );
};

export default LoginPage;