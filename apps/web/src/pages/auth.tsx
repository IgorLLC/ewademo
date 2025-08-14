import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { readSessionFromCookie } from '../lib/session';
// Using inline SVG icons for better compatibility

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password';

const Auth = () => {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [resetToken] = useState(''); // For demo purposes
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  // Verificar si ya hay un usuario autenticado al cargar la página
  useEffect(() => {
    const cookieUser = readSessionFromCookie();
    if (cookieUser) {
      if (cookieUser.role === 'admin') router.replace('/admin/dashboard');
      else if (cookieUser.role === 'customer') router.replace('/customer/subscriptions');
      return;
    }
    const userJson = localStorage.getItem('ewa_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.role === 'admin') router.replace('/admin/dashboard');
        else if (user.role === 'customer') router.replace('/customer/subscriptions');
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('ewa_user');
        localStorage.removeItem('ewa_token');
      }
    }
  }, [router]);

  const clearErrors = () => {
    setError('');
    setSuccess('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setNameError('');
  };

  const validateForm = () => {
    let isValid = true;
    clearErrors();

    if (!email) {
      setEmailError('El email es requerido');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Por favor ingresa un email válido');
      isValid = false;
    }

    if (authMode === 'signup' && !name.trim()) {
      setNameError('El nombre es requerido');
      isValid = false;
    }

    if (authMode !== 'forgot-password') {
      if (!password) {
        setPasswordError('La contraseña es requerida');
        isValid = false;
      } else if (password.length < 8) {
        setPasswordError('La contraseña debe tener al menos 8 caracteres');
        isValid = false;
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        setPasswordError('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
        isValid = false;
      }

      if (authMode === 'signup' || authMode === 'reset-password') {
        if (!confirmPassword) {
          setConfirmPasswordError('Confirma tu contraseña');
          isValid = false;
        } else if (password !== confirmPassword) {
          setConfirmPasswordError('Las contraseñas no coinciden');
          isValid = false;
        }
      }
    }

    return isValid;
  };

  const mockUsers = [
    {
      id: 'u1',
      name: 'Juan Rivera',
      email: 'juan@cliente.com',
      password: 'Test123!',
      role: 'customer'
    },
    {
      id: 'u3',
      name: 'Restaurante Sobao',
      email: 'info@sobao.com',
      password: 'Sobao123!',
      role: 'customer'
    },
    {
      id: 'admin1',
      name: 'Administrador EWA',
      email: 'admin@ewa.com',
      password: 'Admin123!',
      role: 'admin'
    }
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6XCIke3VzZXIuaWR9XCIsInJvbGUiOlwiJHt1c2VyLnJvbGV9XCIsImlhdCI6MTYxNjE0ODM2NX0.hR6QxyZ8H6LI1KcPm7CxO8S-yGlE87gGaUlHCpEkYLo`;
          
          localStorage.setItem('ewa_token', mockToken);
          localStorage.setItem('ewa_user', JSON.stringify(user));
          try { await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) }); } catch {}
          
          if (user.role === 'admin') {
            router.replace('/admin/dashboard');
          } else {
            router.replace('/customer/subscriptions');
          }
        } else {
          setError('Credenciales inválidas. Por favor verifica tu email y contraseña.');
        }
      } else if (authMode === 'signup') {
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
          setError('Ya existe una cuenta con este email.');
          return;
        }

        const newUser = {
          id: `u${Date.now()}`,
          name: name.trim(),
          email,
          password,
          role: 'customer' as const
        };

        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6XCIke25ld1VzZXIuaWR9XCIsInJvbGUiOlwiJHtuZXdVc2VyLnJvbGV9XCIsImlhdCI6MTYxNjE0ODM2NX0.hR6QxyZ8H6LI1KcPm7CxO8S-yGlE87gGaUlHCpEkYLo`;
        
        localStorage.setItem('ewa_token', mockToken);
        localStorage.setItem('ewa_user', JSON.stringify(newUser));
        try { await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) }); } catch {}
        
        router.replace('/customer/subscriptions');
      } else if (authMode === 'forgot-password') {
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          setSuccess('Se ha enviado un enlace de recuperación a tu email.');
          // In a real app, this would send an email with a secure reset link
          setTimeout(() => {
            setAuthMode('reset-password');
          }, 2000);
        } else {
          setError('No se encontró una cuenta con este email.');
        }
      } else if (authMode === 'reset-password') {
        setSuccess('Contraseña actualizada correctamente.');
        setTimeout(() => {
          setAuthMode('login');
          setPassword('');
          setConfirmPassword('');
        }, 2000);
      }
    } catch (err) {
      setError('Error en la operación. Por favor intenta nuevamente.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearErrors();
    setIsLoading(true);

    try {
      const googleUser = {
        id: 'google_user_1',
        name: 'Usuario Google',
        email: 'usuario@gmail.com',
        role: 'customer'
      };

      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6XCIke2dvb2dsZVVzZXIuaWR9XCIsInJvbGUiOlwiJHtnb29nbGVVc2VyLnJvbGV9XCIsImlhdCI6MTYxNjE0ODM2NX0.hR6QxyZ8H6LI1KcPm7CxO8S-yGlE87gGaUlHCpEkYLo`;
      
      localStorage.setItem('ewa_token', mockToken);
      localStorage.setItem('ewa_user', JSON.stringify(googleUser));
      try { await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(googleUser) }); } catch {}
      
      if (googleUser.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/customer/subscriptions');
      }
    } catch (err) {
      setError('Error al iniciar sesión con Google. Por favor intenta nuevamente.');
      console.error('Google login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthModeConfig = () => {
    switch (authMode) {
      case 'login':
        return {
          title: 'Iniciar Sesión',
          description: 'Ingresa tu email para acceder a tu cuenta',
          submitText: 'Iniciar sesión',
          switchText: '¿No tienes una cuenta?',
          switchAction: 'Regístrate',
          switchMode: 'signup' as AuthMode
        };
      case 'signup':
        return {
          title: 'Crear Cuenta',
          description: 'Crea tu cuenta para comenzar',
          submitText: 'Crear cuenta',
          switchText: '¿Ya tienes una cuenta?',
          switchAction: 'Iniciar sesión',
          switchMode: 'login' as AuthMode
        };
      case 'forgot-password':
        return {
          title: 'Recuperar Contraseña',
          description: 'Ingresa tu email para recibir instrucciones',
          submitText: 'Enviar instrucciones',
          switchText: '¿Recordaste tu contraseña?',
          switchAction: 'Iniciar sesión',
          switchMode: 'login' as AuthMode
        };
      case 'reset-password':
        return {
          title: 'Nueva Contraseña',
          description: 'Ingresa tu nueva contraseña',
          submitText: 'Actualizar contraseña',
          switchText: 'Volver al',
          switchAction: 'inicio de sesión',
          switchMode: 'login' as AuthMode
        };
    }
  };

  const config = getAuthModeConfig();

  return (
    <>
      <Head>
        <title>{config.title} - EWA Box Water</title>
        <meta name="description" content={`${config.title} en tu cuenta de EWA Box Water`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          {/* Back arrow */}
          <div className="flex justify-start">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 p-0 h-auto"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </Button>
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

          {/* Auth Form */}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{config.title}</CardTitle>
                  <CardDescription>{config.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAuth} className="space-y-4">
                    {authMode === 'signup' && (
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Nombre completo
                        </label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Tu nombre completo"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (nameError) setNameError('');
                          }}
                          className={nameError ? 'border-red-500' : ''}
                          required
                        />
                        {nameError && (
                          <p className="text-sm text-red-500">{nameError}</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Email
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <Input
                          id="email"
                          type="email"
                          placeholder="usuario@ejemplo.com"
                          className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError('');
                          }}
                          required
                        />
                      </div>
                      {emailError && (
                        <p className="text-sm text-red-500">{emailError}</p>
                      )}
                    </div>

                    {authMode !== 'forgot-password' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {authMode === 'reset-password' ? 'Nueva contraseña' : 'Contraseña'}
                          </label>
                          {authMode === 'login' && (
                            <Button
                              type="button"
                              variant="link"
                              className="p-0 h-auto text-sm text-blue-600 hover:text-blue-500"
                              onClick={() => setAuthMode('forgot-password')}
                            >
                              ¿Olvidaste tu contraseña?
                            </Button>
                          )}
                        </div>
                        <div className="relative">
                          <svg className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className={`pl-10 pr-10 ${passwordError ? 'border-red-500' : ''}`}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (passwordError) setPasswordError('');
                            }}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPassword ? (
                              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </Button>
                        </div>
                        {passwordError && (
                          <p className="text-sm text-red-500">{passwordError}</p>
                        )}
                      </div>
                    )}

                    {(authMode === 'signup' || authMode === 'reset-password') && (
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Confirmar contraseña
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className={`pl-10 pr-10 ${confirmPasswordError ? 'border-red-500' : ''}`}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (confirmPasswordError) setConfirmPasswordError('');
                            }}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showConfirmPassword ? (
                              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </Button>
                        </div>
                        {confirmPasswordError && (
                          <p className="text-sm text-red-500">{confirmPasswordError}</p>
                        )}
                      </div>
                    )}

                    {error && (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                        {success}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Procesando...' : config.submitText}
                    </Button>

                    {(authMode === 'login' || authMode === 'signup') && (
                      <>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGoogleSignIn}
                          disabled={isLoading}
                          className="w-full"
                        >
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.26c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          {isLoading ? 'Iniciando...' : 'Continuar con Google'}
                        </Button>
                      </>
                    )}
                  </form>

                  <div className="text-center text-sm mt-6">
                    <span className="text-muted-foreground">{config.switchText} </span>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-blue-600 hover:text-blue-500"
                      onClick={() => {
                        setAuthMode(config.switchMode);
                        clearErrors();
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                        setName('');
                      }}
                    >
                      {config.switchAction}
                    </Button>
                  </div>

                  {authMode === 'login' && (
                    <div className="mt-4 text-center">
                      <p className="text-xs text-muted-foreground">
                        Credenciales de prueba:
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        juan@cliente.com / Test123!<br />
                        info@sobao.com / Sobao123!<br />
                        admin@ewa.com / Admin123!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
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