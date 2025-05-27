import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Página no encontrada - EWA Box Water</title>
        <meta name="description" content="La página que buscas no existe" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">404</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              La página que buscas no existe o ha sido eliminada
            </p>
          </div>
          <div className="flex justify-center">
            <Link href="/admin/dashboard" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue">
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
