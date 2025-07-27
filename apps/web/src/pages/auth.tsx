import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowLeft } from 'lucide-react';

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar si ya hay un usuario autenticado al cargar la página
  useEffect(() => {
    const userJson = localStorage.getItem('ewa_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.role === 'customer') {
          router.replace('/subscriptions');
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
      const mockUsers = [
        {
          id: 'u1',
          name: 'Juan Rivera',
          email: 'juan@cliente.com',
          password: 'test123',
          role: 'customer'
        },
        {
          id: 'u3',
          name: 'Restaurante Sobao',
          email: 'info@sobao.com',
          password: 'sobao123',
          role: 'customer'
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
        router.replace('/subscriptions');
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
        <title>Iniciar Sesión - EWA Box Water</title>
        <meta name="description" content="Inicia sesión en tu cuenta de EWA Box Water" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          {/* Back arrow */}
          <div className="flex justify-start">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              ← Volver
            </button>
          </div>

          {/* Logo/Brand */}
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="/" className="flex items-center gap-2 font-medium">
              <div className="bg-blue-600 text-white flex size-8 items-center justify-center rounded-md">
                <span className="text-sm font-bold">EWA</span>
              </div>
              EWA Box Water
            </a>
          </div>

          {/* Login Form */}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
                  <p className="text-gray-600 text-sm mt-2">
                    Ingresa tu email para acceder a tu cuenta
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="m@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña
                      </label>
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-500 underline">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>

                  <button
                    type="button"
                    className="w-full bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Iniciar sesión con Google
                  </button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-600">¿No tienes una cuenta? </span>
                  <a href="/register" className="text-blue-600 hover:text-blue-500 underline">
                    Regístrate
                  </a>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Credenciales de prueba:
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    juan@cliente.com / test123<br />
                    info@sobao.com / sobao123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side image */}
        <div className="bg-slate-100 relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
            alt="Agua pura y cristalina"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-600/20" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Agua pura y sustentable
              </h3>
              <p className="text-gray-600 text-sm">
                Disfruta de agua de la más alta calidad, entregada directamente a tu puerta con nuestro servicio de suscripción confiable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;