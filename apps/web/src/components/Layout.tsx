import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar, Footer, Button } from '@ewa/ui';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'EWA Box Water' }) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="EWA Box Water - Sustainable water delivery service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Navbar>
        <div className="flex items-center w-full">
          <div className="flex items-center">
            <a href="/" className="mr-6">
              <div className="bg-ewa-blue text-white font-bold text-xl py-1 px-3 rounded-lg">
                EWA BOX WATER
              </div>
            </a>
            <div className="flex items-center space-x-6">
              <a href="/" className="text-gray-700 hover:text-ewa-blue font-medium">
                Home
              </a>
              <a href="/plans" className="text-gray-700 hover:text-ewa-blue font-medium">
                Plans
              </a>
              <a href="/blog" className="text-gray-700 hover:text-ewa-blue font-medium">
                Blog
              </a>
            </div>
          </div>
          <div className="ml-auto">
            <a href="/auth" className="inline-block">
              <div className="shadow-md hover:shadow-lg transition-all duration-200">
                <Button variant="primary" size="md">Iniciar sesión / Registrarse</Button>
              </div>
            </a>
          </div>
        </div>
      </Navbar>
      
      <main>{children}</main>
      
      <Footer />
    </>
  );
};

export default Layout;
