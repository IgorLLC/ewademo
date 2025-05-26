import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { login, getCurrentUser } from '@ewa/api-client';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verificar si ya hay un usuario autenticado al cargar la página
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === 'admin') {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulamos la autenticación con los usuarios mock
      // Estos usuarios corresponden a los definidos en mock/db.json
      const mockUsers = [
        {
          id: 'u1',
          name: 'Juan Rivera',
          email: 'juan@cliente.com',
          password: 'test123',
          role: 'customer'
        },
        {
          id: 'u2',
          name: 'María López',
          email: 'admin@ewa.com',
          password: 'admin123',
          role: 'admin'
        },
        {
          id: 'u3',
          name: 'Restaurante Sobao',
          email: 'info@sobao.com',
          password: 'sobao123',
          role: 'customer'
        },
        {
          id: 'u6',
          name: 'Carmen Ortiz',
          email: 'carmen@ewa.com',
          password: 'carmen123',
          role: 'operator'
        },
        {
          id: 'u7',
          name: 'Pedro Díaz',
          email: 'pedro@ewa.com',
          password: 'pedro123',
          role: 'editor'
        }
      ];
      
      // Buscar el usuario por email y contraseña
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Generar un token mock
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6XCIke3VzZXIuaWR9XCIsInJvbGUiOlwiJHt1c2VyLnJvbGV9XCIsImlhdCI6MTYxNjE0ODM2NX0.hR6QxyZ8H6LI1KcPm7CxO8S-yGlE87gGaUlHCpEkYLo`;
        
        // Almacenar datos en localStorage
        localStorage.setItem('ewa_token', mockToken);
        localStorage.setItem('ewa_user', JSON.stringify(user));
        
        // Redirigir según el rol del usuario
        if (user.role === 'admin' || user.role === 'operator' || user.role === 'editor') {
          router.push('/admin');
        } else if (user.role === 'customer') {
          router.push('/customer/subscriptions');
        }
      } else {
        setError('Credenciales inválidas. Por favor verifica tu email y contraseña.');
      }
    } catch (err) {
      setError('Error de inicio de sesión. Por favor intenta nuevamente.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - EWA Box Water</title>
        <meta name="description" content="EWA Box Water - Admin Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the EWA Box Water admin panel
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                  <p className="text-sm text-gray-500 text-center">
                    Email: admin@ewabox.com<br />
                    Password: any password will work
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
