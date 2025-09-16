import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { smartNotificationService } from '@ewa/utils';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    address: '',
    city: '',
    zipCode: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'El nombre del negocio es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'El código postal es requerido';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular registro exitoso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Crear usuario mock
      const newUser = {
        id: `u${Date.now()}`,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        role: 'customer'
      };

      // Guardar en localStorage (en una app real esto iría al backend)
      localStorage.setItem('ewa_user', JSON.stringify(newUser));
      localStorage.setItem('ewa_token', 'mock_token_' + Date.now());

      // Enviar email de bienvenida
      try {
        await smartNotificationService.sendWelcomeNotification(
          formData.email,
          formData.phone,
          `${formData.firstName} ${formData.lastName}`
        );
        console.log('Email de bienvenida enviado exitosamente');
      } catch (emailError) {
        console.error('Error enviando email de bienvenida:', emailError);
        // No bloquear el registro si falla el email
      }

      // Redirigir a la página de suscripciones
      router.push('/customer/subscriptions');
    } catch (error) {
      console.error('Error en el registro:', error);
      setErrors({ general: 'Error en el registro. Por favor intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Registro - EWA Box Water</title>
        <meta name="description" content="Regístrate en EWA Box Water para acceder a agua de calidad" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back arrow */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              ← Volver
            </Button>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <a href="/" className="flex items-center gap-2 font-medium">
              <div className="bg-blue-600 text-white flex h-8 w-8 items-center justify-center rounded-md">
                <span className="text-sm font-bold">EWA</span>
              </div>
              EWA Box Water
            </a>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Crear cuenta</CardTitle>
                <CardDescription>
                  Regístrate para acceder a agua de la más alta calidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información personal */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información personal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nombre *</label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Juan"
                          className={errors.firstName ? 'border-red-500' : ''}
                        />
                        {errors.firstName && (
                          <p className="text-sm text-red-600">⚠ {errors.firstName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Apellido *</label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Pérez"
                          className={errors.lastName ? 'border-red-500' : ''}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-red-600">⚠ {errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email *</label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="juan@ejemplo.com"
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">⚠ {errors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Teléfono *</label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-600">⚠ {errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contraseñas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Contraseña *</label>
                        <div className="relative">
                          <Input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-600">⚠ {errors.password}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confirmar contraseña *</label>
                        <div className="relative">
                          <Input
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-600">⚠ {errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Información del negocio */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información del negocio</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nombre del negocio *</label>
                      <Input
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Mi Restaurante"
                        className={errors.businessName ? 'border-red-500' : ''}
                      />
                      {errors.businessName && (
                        <p className="text-sm text-red-600">⚠ {errors.businessName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Dirección *</label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Calle Principal"
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-600">⚠ {errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ciudad *</label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="San Juan"
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600">⚠ {errors.city}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Código postal *</label>
                        <Input
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder="00901"
                          className={errors.zipCode ? 'border-red-500' : ''}
                        />
                        {errors.zipCode && (
                          <p className="text-sm text-red-600">⚠ {errors.zipCode}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Términos y condiciones */}
                  <div className="space-y-2">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Acepto los{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500 underline">
                          términos y condiciones
                        </a>{' '}
                        y la{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500 underline">
                          política de privacidad
                        </a>
                        *
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="text-sm text-red-600">⚠ {errors.acceptTerms}</p>
                    )}
                  </div>

                  {/* Error general */}
                  {errors.general && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      ⚠ {errors.general}
                    </div>
                  )}

                  {/* Botón de registro */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                  </Button>

                  {/* Enlace a login */}
                  <div className="text-center text-sm">
                    <span className="text-gray-600">¿Ya tienes una cuenta? </span>
                    <a 
                      href="/auth" 
                      className="text-blue-600 hover:text-blue-500 underline"
                    >
                      Inicia sesión
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register; 