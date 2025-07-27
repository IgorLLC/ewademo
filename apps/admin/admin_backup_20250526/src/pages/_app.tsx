import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from '@ewa/api-client';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  // Versión simplificada sin comprobaciones de autenticación en _app.tsx
  // La autenticación se manejará en cada página individual según sea necesario
  return <Component {...pageProps} />;
}

export default MyApp;
