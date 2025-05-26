import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from '@ewa/api-client';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const user = getCurrentUser();
    const publicPaths = ['/login', '/register', '/forgot-password'];
    const isPublicPath = publicPaths.includes(router.pathname);

    if (!user && !isPublicPath) {
      // Redirect to login if not authenticated and not on a public path
      router.push('/login');
    } else if (user && isPublicPath) {
      // Redirect to dashboard if authenticated and on a public path
      router.push('/subscriptions');
    }

    setIsLoading(false);
  }, [router.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
      </div>
    );
  }

  return <Component {...pageProps} />;
}

export default MyApp;
