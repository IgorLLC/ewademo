import React from 'react';
import Head from 'next/head';
import { AnimatedLogoRing } from '../../components/BrandLogo';

const AnimatedLogoDemo: React.FC = () => {
  return (
    <div className="min-h-screen grid place-items-center bg-ewa-blue/20 relative">
      <Head>
        <title>Animated Logo Ring — EWA</title>
      </Head>
      <div className="relative z-10 flex flex-col items-center gap-8 p-8">
        <AnimatedLogoRing size="lg" text="JOIN THE EWAVE •" showGuideCircle={false} />
        <p className="text-gray-700">
          Circular text rotates infinitely around the logo. Respects reduced motion settings.
        </p>
      </div>
    </div>
  );
};

export default AnimatedLogoDemo;


