import axios from 'axios';

const SISTEMA2_URL = 'http://localhost:3000/auth';
const SISTEMA3_URL = 'http://localhost:3002/subscription';

interface AuthResponse {
  access_token: string;
}

interface LoginPayload {
  email: string;
  password: string;
  name?: string; 
}

export async function registerClient(data: LoginPayload): Promise<void> {
  await axios.post('http://localhost:3000/client/register', data);
}

export async function loginClient(data: LoginPayload): Promise<AuthResponse> {
  const response = await axios.post(`${SISTEMA2_URL}/login`, data);
  return response.data;
}

export async function generatePaymentLink(clientId: string): Promise<string> {
  const response = await axios.post(`${SISTEMA3_URL}/pay`, { clientId });
  return response.data.url;
}

export function decodeTokenStatus(token: string): { status: string } | null {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    
    return { status: payload.status || 'INACTIVE' }; 

  } catch (e) {
    console.error('Erro ao decodificar token:', e);
    return null;
  }
}