import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface ProfileData {
  address: string;
  city: string;
  zipCode: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingNotifications: boolean;
  };
  deliveryInstructions: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  
  // Preferences states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  
  // Profile picture states
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Security states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isChangingPasswordLoading, setIsChangingPasswordLoading] = useState(false);
  
  // UI states
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form validation
  const [nameError, setNameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userJson = localStorage.getItem('ewa_user');
    if (!userJson) {
      router.push('/auth');
      return;
    }

    try {
      const userData = JSON.parse(userJson);
      if (userData.role !== 'customer') {
        router.push('/auth');
        return;
      }
      setUser(userData);
      
      // Establecer los valores iniciales del formulario
      setName(userData.name || '');
      
      // Obtener datos adicionales del perfil si existen
      const profileData = localStorage.getItem('ewa_profile_data');
      if (profileData) {
        const parsedProfileData: ProfileData = JSON.parse(profileData);
        setAddress(parsedProfileData.address || '');
        setCity(parsedProfileData.city || '');
        setZipCode(parsedProfileData.zipCode || '');
        setDeliveryInstructions(parsedProfileData.deliveryInstructions || '');
        
        if (parsedProfileData.preferences) {
          setEmailNotifications(parsedProfileData.preferences.emailNotifications ?? true);
          setSmsNotifications(parsedProfileData.preferences.smsNotifications ?? true);
          setMarketingNotifications(parsedProfileData.preferences.marketingNotifications ?? false);
        }
      } else {
        // Datos mock para demostración
        setAddress('123 Calle Principal');
        setCity('San Juan');
        setZipCode('00901');
        setDeliveryInstructions('Dejar en la puerta principal, tocar el timbre');
      }
      
      // Obtener foto de perfil guardada
      const savedProfilePicture = localStorage.getItem('ewa_profile_picture');
      if (savedProfilePicture) {
        setProfilePicture(savedProfilePicture);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth');
    }
  }, [router]);

  const validateForm = () => {
    let isValid = true;
    setNameError('');
    setAddressError('');

    if (!name.trim()) {
      setNameError('El nombre es requerido');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres');
      isValid = false;
    }

    if (!address.trim()) {
      setAddressError('La dirección es requerida');
      isValid = false;
    }

    return isValid;
  };

  const validatePasswordForm = () => {
    let isValid = true;
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmNewPasswordError('');

    if (!currentPassword) {
      setCurrentPasswordError('La contraseña actual es requerida');
      isValid = false;
    }

    if (!newPassword) {
      setNewPasswordError('La nueva contraseña es requerida');
      isValid = false;
    } else if (newPassword.length < 8) {
      setNewPasswordError('La contraseña debe tener al menos 8 caracteres');
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setNewPasswordError('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
      isValid = false;
    }

    if (!confirmNewPassword) {
      setConfirmNewPasswordError('Confirma tu nueva contraseña');
      isValid = false;
    } else if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError('Las contraseñas no coinciden');
      isValid = false;
    }

    if (currentPassword === newPassword) {
      setNewPasswordError('La nueva contraseña debe ser diferente a la actual');
      isValid = false;
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Actualizar los datos del usuario (solo nombre)
      const updatedUser = {
        ...user!,
        name: name.trim()
      };
      
      // Guardar los datos del perfil
      const profileData: ProfileData = {
        address: address.trim(),
        city: city.trim(),
        zipCode: zipCode.trim(),
        deliveryInstructions: deliveryInstructions.trim(),
        preferences: {
          emailNotifications,
          smsNotifications,
          marketingNotifications
        }
      };
      
      // Guardar foto de perfil si hay una nueva
      if (selectedImage && imagePreview) {
        localStorage.setItem('ewa_profile_picture', imagePreview);
        setProfilePicture(imagePreview);
      }
      
      localStorage.setItem('ewa_user', JSON.stringify(updatedUser));
      localStorage.setItem('ewa_profile_data', JSON.stringify(profileData));
      
      setUser(updatedUser);
      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview(null);
      setSuccessMessage('Perfil actualizado correctamente');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error al actualizar el perfil');
      setTimeout(() => setErrorMessage(''), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Restaurar valores originales
    if (user) {
      setName(user.name);
      const profileData = localStorage.getItem('ewa_profile_data');
      if (profileData) {
        const parsedProfileData: ProfileData = JSON.parse(profileData);
        setAddress(parsedProfileData.address || '');
        setCity(parsedProfileData.city || '');
        setZipCode(parsedProfileData.zipCode || '');
        setDeliveryInstructions(parsedProfileData.deliveryInstructions || '');
        
        if (parsedProfileData.preferences) {
          setEmailNotifications(parsedProfileData.preferences.emailNotifications ?? true);
          setSmsNotifications(parsedProfileData.preferences.smsNotifications ?? true);
          setMarketingNotifications(parsedProfileData.preferences.marketingNotifications ?? false);
        }
      }
    }
    setIsEditing(false);
    setNameError('');
    setAddressError('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsChangingPasswordLoading(true);
    try {
      // Simular verificación de contraseña actual
      const mockUsers = [
        { email: 'juan@cliente.com', password: 'Test123!' },
        { email: 'info@sobao.com', password: 'Sobao123!' },
        { email: 'admin@ewa.com', password: 'Admin123!' }
      ];

      const currentUser = mockUsers.find(u => u.email === user?.email);
      if (!currentUser || currentUser.password !== currentPassword) {
        setCurrentPasswordError('La contraseña actual es incorrecta');
        return;
      }

      // Simular cambio de contraseña exitoso
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay de API

      // En una aplicación real, aquí actualizarías la contraseña en el backend
      setSuccessMessage('Contraseña actualizada correctamente');
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setSuccessMessage(''), 4000);

      // Agregar entrada al log de actividad de seguridad
      const securityLog = JSON.parse(localStorage.getItem('ewa_security_log') || '[]');
      securityLog.unshift({
        action: 'password_changed',
        timestamp: new Date().toISOString(),
        description: 'Contraseña actualizada'
      });
      // Mantener solo los últimos 10 eventos
      localStorage.setItem('ewa_security_log', JSON.stringify(securityLog.slice(0, 10)));

    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('Error al cambiar la contraseña');
      setTimeout(() => setErrorMessage(''), 4000);
    } finally {
      setIsChangingPasswordLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmNewPasswordError('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('ewa_token');
    localStorage.removeItem('ewa_user');
    localStorage.removeItem('ewa_profile_data');
    sessionStorage.clear();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-12 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Cargando tu perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Mi Perfil - EWA Box Water</title>
        <meta name="description" content="Gestiona tu perfil de usuario" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* Header moderno */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-8">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EWA Box Water
                </h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="/customer/subscriptions" className="relative border-b-2 border-transparent hover:border-blue-300 text-gray-600 hover:text-blue-600 font-medium py-2 transition-all duration-200 group">
                  Suscripciones
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                </a>
                <a href="/customer/oneoffs" className="relative border-b-2 border-transparent hover:border-blue-300 text-gray-600 hover:text-blue-600 font-medium py-2 transition-all duration-200 group">
                  Pedidos Únicos
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                </a>
                <a href="/customer/profile" className="relative border-b-2 border-blue-600 text-blue-600 font-semibold py-2 transition-all duration-200 group">
                  Perfil
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-100 transition-transform duration-200"></div>
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    Hola, {user.name}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium py-2 px-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header de página mejorado */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
                    Mi Perfil
                  </h1>
                  <p className="text-gray-600 text-lg">Gestiona tu información personal y preferencias</p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
          
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">¡Éxito!</h3>
                    <p className="text-green-700">{successMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {errorMessage && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Error</h3>
                    <p className="text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Información Personal</h2>
                  <p className="text-gray-600">Tu información básica y datos de contacto</p>
                </div>
              </div>
              <div className="space-y-4">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {profilePicture || imagePreview ? (
                        <img 
                          src={imagePreview || profilePicture || ''} 
                          alt="Foto de perfil" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedImage(file);
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setImagePreview(e.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  {isEditing && selectedImage && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Nueva imagen seleccionada</p>
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium py-2 px-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                      >
                        Cancelar cambio
                      </button>
                    </div>
                  )}
                  {!isEditing && (
                    <p className="text-sm text-gray-600">Foto de perfil</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Nombre completo
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (nameError) setNameError('');
                          }}
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${nameError ? 'border-red-500' : ''}`}
                          placeholder="Tu nombre completo"
                        />
                        {nameError && (
                          <p className="text-sm text-red-500">{nameError}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{name || 'No especificado'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Correo electrónico
                    </label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex-1">{user?.email}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        No editable
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Teléfono
                    </label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md flex-1">{user?.phone || 'No especificado'}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        No editable
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Información de Entrega</h2>
                  <p className="text-gray-600">Dirección y detalles para la entrega de tus pedidos</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Dirección
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            if (addressError) setAddressError('');
                          }}
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${addressError ? 'border-red-500' : ''}`}
                          placeholder="Calle y número"
                        />
                        {addressError && (
                          <p className="text-sm text-red-500">{addressError}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{address || 'No especificado'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Ciudad
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ciudad"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{city || 'No especificado'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Código Postal
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="00000"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{zipCode || 'No especificado'}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Instrucciones de entrega
                    </label>
                    {isEditing ? (
                      <textarea
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Ejemplo: Dejar en la puerta principal, tocar el timbre..."
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md min-h-[80px]">{deliveryInstructions || 'No especificado'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Preferencias de Comunicación</h2>
                  <p className="text-gray-600">Configura cómo quieres recibir notificaciones sobre tus pedidos</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Notificaciones por email</label>
                      <p className="text-sm text-muted-foreground">Recibe actualizaciones sobre tus pedidos por correo</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Notificaciones por SMS</label>
                      <p className="text-sm text-muted-foreground">Recibe actualizaciones por mensaje de texto</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Comunicaciones de marketing</label>
                      <p className="text-sm text-muted-foreground">Recibe ofertas especiales y novedades</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={marketingNotifications}
                      onChange={(e) => setMarketingNotifications(e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium py-3 px-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Security Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Seguridad</h2>
                  <p className="text-gray-600">Gestiona la seguridad de tu cuenta</p>
                </div>
              </div>
              <div className="space-y-6">
                {/* Password Change Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Cambiar contraseña</h4>
                      <p className="text-sm text-muted-foreground">Actualiza tu contraseña para mantener tu cuenta segura</p>
                    </div>
                    {!isChangingPassword && (
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium py-2 px-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <span>Cambiar</span>
                      </button>
                    )}
                  </div>

                  {/* Password Change Form */}
                  {isChangingPassword && (
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                      <div className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Contraseña actual
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                if (currentPasswordError) setCurrentPasswordError('');
                              }}
                              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 ${currentPasswordError ? 'border-red-500' : ''}`}
                              placeholder="Ingresa tu contraseña actual"
                            />
                            <button
                              type="button"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? (
                                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {currentPasswordError && (
                            <p className="text-sm text-red-500">{currentPasswordError}</p>
                          )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Nueva contraseña
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (newPasswordError) setNewPasswordError('');
                              }}
                              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 ${newPasswordError ? 'border-red-500' : ''}`}
                              placeholder="Ingresa tu nueva contraseña"
                            />
                            <button
                              type="button"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {newPasswordError && (
                            <p className="text-sm text-red-500">{newPasswordError}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Mínimo 8 caracteres con al menos una mayúscula, una minúscula y un número
                          </p>
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Confirmar nueva contraseña
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmNewPassword ? "text" : "password"}
                              value={confirmNewPassword}
                              onChange={(e) => {
                                setConfirmNewPassword(e.target.value);
                                if (confirmNewPasswordError) setConfirmNewPasswordError('');
                              }}
                              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10 ${confirmNewPasswordError ? 'border-red-500' : ''}`}
                              placeholder="Confirma tu nueva contraseña"
                            />
                            <button
                              type="button"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            >
                              {showConfirmNewPassword ? (
                                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {confirmNewPasswordError && (
                            <p className="text-sm text-red-500">{confirmNewPasswordError}</p>
                          )}
                        </div>
                      </div>

                      {/* Password Change Actions */}
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          onClick={handleCancelPasswordChange}
                          disabled={isChangingPasswordLoading}
                          className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium py-3 px-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleChangePassword}
                          disabled={isChangingPasswordLoading}
                          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {isChangingPasswordLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Actualizando...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Actualizar Contraseña</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Activity Log */}
                <div className="space-y-4 pt-6 border-t">
                  <div>
                    <h4 className="text-sm font-medium flex items-center">
                      <svg className="mr-2 h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Actividad de Seguridad Reciente
                    </h4>
                    <p className="text-sm text-muted-foreground">Últimas acciones relacionadas con la seguridad de tu cuenta</p>
                  </div>
                  
                  <div className="space-y-2">
                    {(() => {
                      const securityLog = JSON.parse(localStorage.getItem('ewa_security_log') || '[]');
                      const defaultActivities = [
                        {
                          action: 'login',
                          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                          description: 'Inicio de sesión exitoso'
                        },
                        {
                          action: 'profile_updated',
                          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                          description: 'Perfil actualizado'
                        },
                        {
                          action: 'login',
                          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                          description: 'Inicio de sesión exitoso'
                        }
                      ];
                      
                      const activities = securityLog.length > 0 ? securityLog : defaultActivities;
                      
                      return activities.slice(0, 5).map((activity: any, index: number) => {
                        const date = new Date(activity.timestamp);
                        const timeAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
                        
                        const getActivityIcon = (action: string) => {
                          switch (action) {
                            case 'password_changed':
                              return (
                                <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                              );
                            case 'login':
                              return (
                                <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                              );
                            case 'profile_updated':
                              return (
                                <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              );
                            default:
                              return (
                                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              );
                          }
                        };
                        
                        return (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                            <div className="flex-shrink-0">
                              {getActivityIcon(activity.action)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                              <p className="text-xs text-gray-500">
                                {timeAgo < 1 ? 'Hace menos de 1 hora' : 
                                 timeAgo < 24 ? `Hace ${timeAgo} ${timeAgo === 1 ? 'hora' : 'horas'}` :
                                 `Hace ${Math.floor(timeAgo / 24)} ${Math.floor(timeAgo / 24) === 1 ? 'día' : 'días'}`}
                              </p>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;