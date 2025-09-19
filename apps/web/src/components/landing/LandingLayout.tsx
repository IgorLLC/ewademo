import React from 'react';
import Head from 'next/head';
import { Footer } from '@ewa/ui';
import LandingHeader from './LandingHeader';
import PromoMarquee from './PromoMarquee';

interface LandingLayoutProps {
  children: React.ReactNode;
  title?: string;
  user?: any;
  onAccessRedirect: () => void;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ 
  children, 
  title = 'EWA Box Water - Agua Sustentable',
  user,
  onAccessRedirect 
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="EWA Box Water - Agua sustentable en caja directo a tu puerta. Planes de suscripción que ayudan a reducir residuos plásticos." />
        <meta name="keywords" content="agua, sustentable, caja, suscripción, hidratación, eco-friendly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <PromoMarquee />
      <LandingHeader user={user} onAccessRedirect={onAccessRedirect} />
      
      <main>{children}</main>
      
      <Footer />
    </>
  );
};

export default LandingLayout;
