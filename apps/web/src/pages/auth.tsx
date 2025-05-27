import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@ewa/ui';

const Auth = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verificar si ya hay un usuario autenticado al cargar la página
  useEffect(() => {
    const userJson = localStorage.getItem('ewa_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.role === 'admin' || user.role === 'operator' || user.role === 'editor') {
          window.location.href = '/admin';
        } else if (user.role === 'customer') {
          window.location.href = '/customer';
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('ewa_user');
        localStorage.removeItem('ewa_token');
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
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
        
        // Mostrar mensaje de éxito
        setError('');
        setIsLoading(false);
        
        // Mostrar mensaje de éxito antes de redirigir
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
        successMessage.innerHTML = `
          <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <svg class="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Inicio de sesión exitoso</h3>
            <p class="mt-2 text-sm text-gray-500">Redirigiendo a tu área personal...</p>
          </div>
        `;
        document.body.appendChild(successMessage);
        
        // Redirigir según el rol del usuario después de mostrar el mensaje
        setTimeout(() => {
          if (user.role === 'admin' || user.role === 'operator' || user.role === 'editor') {
            window.location.href = '/admin';
          } else if (user.role === 'customer') {
            window.location.href = '/customer';
          }
        }, 1500);
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // En un entorno real, aquí enviaríamos los datos a un API para crear el usuario
      // Para este prototipo, simplemente simulamos un registro exitoso
      
      setTimeout(() => {
        // Crear un usuario mock
        const newUser = {
          id: `u${Date.now()}`,
          name: name,
          email: email,
          role: 'customer'
        };
        
        // Generar un token mock
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6XCIke25ld1VzZXIuaWR9XCIsInJvbGUiOlwiJHtuZXdVc2VyLnJvbGV9XCIsImlhdCI6MTYxNjE0ODM2NX0.hR6QxyZ8H6LI1KcPm7CxO8S-yGlE87gGaUlHCpEkYLo`;
        
        // Almacenar datos en localStorage
        localStorage.setItem('ewa_token', mockToken);
        localStorage.setItem('ewa_user', JSON.stringify(newUser));
        
        // Redirigir al área de cliente
        router.push('/customer/subscriptions');
      }, 1000);
    } catch (err) {
      setError('Error al registrarse. Por favor intenta nuevamente.');
      console.error('Signup error:', err);
      setIsLoading(false);
    }
  };

  const renderLoginTab = () => (
    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
      <input type="hidden" name="remember" value="true" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue focus:z-10 sm:text-sm"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue focus:z-10 sm:text-sm"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-ewa-blue focus:ring-ewa-blue border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Recordarme
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-ewa-blue hover:text-ewa-dark-blue">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Credenciales de prueba:
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Cliente: juan@cliente.com / test123<br />
          Admin: admin@ewa.com / admin123
        </p>
      </div>
    </form>
  );

  const renderSignupTab = () => (
    <form className="mt-8 space-y-6" onSubmit={handleSignup}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="name" className="sr-only">Nombre completo</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue focus:z-10 sm:text-sm"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="sr-only">Correo electrónico</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue focus:z-10 sm:text-sm"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="sr-only">Contraseña</label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue focus:z-10 sm:text-sm"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Al registrarte, aceptas nuestros términos y condiciones de servicio.
        </p>
      </div>
    </form>
  );

  return (
    <>
      <Head>
        <title>{activeTab === 'login' ? 'Iniciar Sesión' : 'Registrarse'} - EWA Box Water</title>
        <meta name="description" content="Inicia sesión o regístrate en EWA Box Water" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Flecha para volver */}
        <a href="/" className="absolute top-4 left-4 flex items-center text-ewa-blue hover:text-ewa-dark-blue transition-colors duration-200">
          <svg className="h-6 w-6 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Volver</span>
        </a>
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <a href="/" className="flex justify-center items-center">
                <div className="bg-ewa-blue text-white font-bold text-2xl py-2 px-4 rounded-lg">
                  EWA BOX WATER
                </div>
              </a>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {activeTab === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea una nueva cuenta'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {activeTab === 'login' ? (
                <>
                  ¿No tienes una cuenta?{' '}
                  <button
                    onClick={() => setActiveTab('signup')}
                    className="font-medium text-ewa-blue hover:text-ewa-dark-blue"
                  >
                    Regístrate
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="font-medium text-ewa-blue hover:text-ewa-dark-blue"
                  >
                    Inicia sesión
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Tabs */}
          <div className="sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'login'
                      ? 'border-ewa-blue text-ewa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'signup'
                      ? 'border-ewa-blue text-ewa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Registrarse
                </button>
              </nav>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'login' ? renderLoginTab() : renderSignupTab()}
        </div>
      </div>
    </>
  );
};

export default Auth;
