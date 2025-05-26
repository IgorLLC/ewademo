import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar, Footer } from '@ewa/ui';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'EWA Box Water' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="EWA Box Water - Sustainable water delivery service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Navbar>
        <Link href="/" className="text-gray-700 hover:text-ewa-blue">
          Home
        </Link>
        <Link href="/plans" className="text-gray-700 hover:text-ewa-blue">
          Plans
        </Link>
        <Link href="/blog" className="text-gray-700 hover:text-ewa-blue">
          Blog
        </Link>
        <Link href="/customer" className="text-gray-700 hover:text-ewa-blue">
          Customer Login
        </Link>
      </Navbar>
      
      <main>{children}</main>
      
      <Footer />
    </>
  );
};

export default Layout;
