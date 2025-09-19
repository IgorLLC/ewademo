import React from 'react';
import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import LandingLayout from '../components/landing/LandingLayout';
import {
  HeroSection,
  TestimonialSection,
  FeatureBar,
  ProductSection,
  AboutSection,
  HowItWorksSection,
  CTASection,
} from '../components/landing';
import { useRouter } from 'next/router';

type HomePost = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
};

interface HomeProps {
  stories: HomePost[];
}

const Home: React.FC<HomeProps> = ({ stories }) => {
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
      <HeroSection user={user} onAccessRedirect={handleAccessRedirect} />
      <FeatureBar />
      <ProductSection />
      <AboutSection />
      <HowItWorksSection />
      <TestimonialSection posts={stories} />
      <CTASection />
    </LandingLayout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const {
    PARSE_APP_ID,
    PARSE_REST_KEY,
    PARSE_SERVER_URL,
    NEXT_PUBLIC_BACK4APP_APPLICATION_ID,
    NEXT_PUBLIC_BACK4APP_REST_API_KEY,
    BACK4APP_SERVER_URL,
  } = process.env as Record<string, string | undefined>;

  const appId = PARSE_APP_ID || NEXT_PUBLIC_BACK4APP_APPLICATION_ID;
  const restKey = PARSE_REST_KEY || NEXT_PUBLIC_BACK4APP_REST_API_KEY;
  const serverUrl = (PARSE_SERVER_URL || BACK4APP_SERVER_URL || '').replace(/\/$/, '');

  if (!appId || !restKey || !serverUrl) {
    return { props: { stories: [] } };
  }

  const where = encodeURIComponent(JSON.stringify({ category: 'client-testimonials' }));
  const res = await fetch(`${serverUrl}/classes/BlogPost?where=${where}&order=-date&limit=6`, {
    headers: {
      'X-Parse-Application-Id': appId,
      'X-Parse-REST-API-Key': restKey,
      'Content-Type': 'application/json',
    },
  });
  const json = await res.json().catch(() => ({ results: [] }));
  const stories: HomePost[] = (json.results || []).map((p: any) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    imageUrl: p.image?.url || p.imageUrl || undefined,
  }));

  return { props: { stories } };
};
