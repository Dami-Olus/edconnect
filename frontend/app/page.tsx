'use client';

import { useEffect, useState } from 'react';
import api from '../services/api';

export default function HomePage() {
  const [ping, setPing] = useState('');

  useEffect(() => {
    api.get('/test')
      .then((res) => setPing(res.data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Global Ed Connect</h1>
      <p>Backend says: {ping || 'Loading...'}</p>
    </main>
  );
}
