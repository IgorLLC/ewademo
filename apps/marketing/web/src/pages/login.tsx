import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  // Redirigir a la nueva página de autenticación
  useEffect(() => {
    router.push('/auth');
  }, [router]);

  // No se necesita manejar el envío del formulario, ya que redirigimos a /auth

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p>Redirigiendo a la página de autenticación...</p>
    </div>
  );
};

export default Login;
