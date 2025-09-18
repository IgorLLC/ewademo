import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import MultiStepRegister from '@/components/auth/MultiStepRegister';

const Register = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Registro - EWA Box Water</title>
        <meta name="description" content="Regístrate en EWA Box Water para acceder a agua de calidad" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 py-8">
          {/* Back arrow */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al inicio
            </Button>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <a href="/" className="flex items-center gap-3 font-bold text-xl text-gray-800">
              <div className="bg-blue-600 text-white flex h-10 w-10 items-center justify-center rounded-lg shadow-lg">
                <span className="text-lg font-bold">E</span>
              </div>
              EWA Box Water
            </a>
          </div>

          {/* Multi-step registration form */}
          <MultiStepRegister />
        </div>
      </div>
    </>
  );
};

export default Register; 
