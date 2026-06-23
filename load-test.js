import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 50 },  // Aquecimento
    { duration: '30s', target: 200 }, // O pico da Black Friday
    { duration: '10s', target: 0 },   // Esfriamento
  ],
  thresholds: {
    http_req_duration: ['p(95)<2500'], 
    http_req_failed: ['rate<0.05'],    
  },
};

export default function () {
  const payload = JSON.stringify({
    clienteEmail: 'cliente@entregasja.com',
    valor: 150.00,
    cartao: { numero: '123456789', cvv: '123', validade: '12/2030' }
  });

  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post('http://localhost:3000/api/v1/checkout', payload, params);

  check(res, {
    'status e 200 ou 500': (r) => r.status === 200 || r.status === 500,
  });

  sleep(0.1);
}