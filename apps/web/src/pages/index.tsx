import React from 'react';
import { useEffect, useState } from 'react';
import LandingLayout from '../components/landing/LandingLayout';
import { 
  HeroSection, 
  TestimonialSection, 
  FeatureBar, 
  ProductSection, 
  AboutSection, 
  HowItWorksSection 
} from '../components/landing';
import { useRouter } from 'next/router';

const Home = () => {
  type UserRole = 'admin' | 'operator' | 'editor' | 'customer';
  interface StoredUser {
    name?: string;
    email?: string;
    role?: UserRole | string;
  }

  const [user, setUser] = useState<StoredUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay usuario autenticado
    const userJson = localStorage.getItem('ewa_user');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson) as StoredUser;
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleAccessRedirect = () => {
    if (user) {
      // Usuario autenticado - redirigir según rol
      if (user.role === 'admin' || user.role === 'operator' || user.role === 'editor') {
        router.push('/admin');
      } else if (user.role === 'customer') {
        router.push('/customer');
      }
    } else {
      // Usuario no autenticado - ir a login
      router.push('/auth');
    }
  };

  return (
    <LandingLayout 
      title="EWA Box Water - Agua Sustentable"
      user={user}
      onAccessRedirect={handleAccessRedirect}
    >
      {/* New Landing Page Sections */}
      <HeroSection user={user} onAccessRedirect={handleAccessRedirect} />
      <TestimonialSection />
      <FeatureBar />
      <ProductSection />
      <AboutSection />
      <HowItWorksSection />
    </LandingLayout>
  );
};

export default Home;
