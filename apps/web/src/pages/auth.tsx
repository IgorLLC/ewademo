import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser, login as loginApi, logout as logoutApi, requestPasswordReset as requestPasswordResetApi, signUp as signUpApi } from '@ewa/api-client';
import BrandLogo from '../components/BrandLogo';

type AuthMode = 'login' | 'signup' | 'forgot-password';

const Auth = () => {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    try {
      const user = getCurrentUser();
      if (!user) return;
      if (user.role === 'admin') {
        router.replace('/admin/dashboard');
      } else if (user.role === 'customer') {
        router.replace('/customer/subscriptions');
      }
    } catch (err) {
      console.error('Error reading session:', err);
      logoutApi().catch(() => {});
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

      if (authMode === 'signup') {
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      if (authMode === 'login') {
        const { user } = await loginApi(email.trim(), password);
        if (user.role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/customer/subscriptions');
        }
      } else if (authMode === 'signup') {
        const { user } = await signUpApi({
          name: name.trim(),
          email: email.trim(),
          password,
          role: 'customer',
        });
        if (user.role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/customer/subscriptions');
        }
      } else if (authMode === 'forgot-password') {
        await requestPasswordResetApi(email.trim());
        setSuccess('Hemos enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      const message = err instanceof Error ? err.message : 'Error en la operación. Por favor intenta nuevamente.';
      setError(message);
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
          switchMode: 'signup' as AuthMode,
        };
      case 'signup':
        return {
          title: 'Crear Cuenta',
          description: 'Crea tu cuenta para comenzar',
          submitText: 'Crear cuenta',
          switchText: '¿Ya tienes una cuenta?',
          switchAction: 'Iniciar sesión',
          switchMode: 'login' as AuthMode,
        };
      case 'forgot-password':
        return {
          title: 'Recuperar Contraseña',
          description: 'Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña',
          submitText: 'Enviar instrucciones',
          switchText: '¿Recordaste tu contraseña?',
          switchAction: 'Iniciar sesión',
          switchMode: 'login' as AuthMode,
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
          <div className="flex justify-center md:justify-start">
            <a href="/" className="flex items-center" aria-label="Ir al inicio">
              <BrandLogo size="md" className="h-12 w-12" />
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
                            Contraseña
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

                    {authMode === 'signup' && (
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
