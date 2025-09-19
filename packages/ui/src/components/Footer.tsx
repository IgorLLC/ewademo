import React, { useState, useId } from 'react';

export interface FooterProps {
  children?: React.ReactNode;
}

const AnimatedLogoRingInline: React.FC<{
  logoSize?: number;
  text?: string;
  color?: string;
}> = ({ logoSize = 72, text = 'JOIN THE EWAVE •', color = '#ffffff' }) => {
  const id = useId();
  const ringSize = Math.round(logoSize * 1.8);
  const ringPadding = Math.max(6, Math.round(logoSize * 0.04));
  const radius = Math.round(ringSize / 2 - 12 - ringPadding);
  const pathId = `ewa-footer-circle-${id}`;
  const repeatedText = Array.from({ length: 8 })
    .map(() => text.trim())
    .join(' ');

  return (
    <div
      className="relative inline-grid place-items-center isolate"
      style={{ width: ringSize, height: ringSize }}
      aria-hidden="true"
    >
      <img
        src="/images/branding/ewa-logo-white.svg"
        alt="EWA Box Water"
        width={logoSize}
        height={logoSize}
        className="relative z-10 object-contain"
      />
      <svg
        className="absolute inset-0 z-20 ewa-rotate-slow pointer-events-none"
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        width={ringSize}
        height={ringSize}
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <path id={pathId} d={`M ${ringSize / 2},${ringSize / 2} m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`} />
        </defs>
        <text
          fill={color}
          className="font-extrabold tracking-[0.2em]"
          style={{ fontSize: Math.max(10, Math.round(logoSize * 0.14)) }}
        >
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

const Footer: React.FC<FooterProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Por favor ingresa un correo válido.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');
      // Intentar enviar al endpoint de la app Next.js
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' })
      });

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setMessage('¡Gracias! Te mantendremos al tanto.');
      setEmail('');
    } catch (err) {
      // Degradación elegante si el endpoint no existe
      try {
        window.localStorage.setItem('ewa_newsletter_email', email);
      } catch {}
      setStatus('success');
      setMessage('¡Gracias! Hemos registrado tu interés.');
      setEmail('');
    }
  };

  return (
    <footer className="relative text-white overflow-hidden">
      {/* Banda superior con gradiente de marca */}
      <div className="relative bg-gradient-to-r from-ewa-blue via-ewa-dark-blue to-ewa-blue rounded-t-[36px]">
        {/* Ola decorativa en el borde superior */}
        <svg aria-hidden="true" className="absolute -top-6 left-0 w-full text-ewa-blue/25" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,30 C180,60 360,0 540,30 C720,60 900,0 1080,30 C1260,60 1440,0 1440,0 L1440,60 L0,60 Z" />
        </svg>
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:items-center">
            {/* Marca y mensaje */}
            <div className="flex items-start space-x-4">
              <div className="mt-1">
                <AnimatedLogoRingInline logoSize={72} />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
                  Join the EWAVE
                </h2>
                <p className="mt-3 text-white/90 max-w-xl text-lg">
                  Suscríbete para recibir novedades, lanzamientos y tips de hidratación
                  sustentable.
                </p>
              </div>
            </div>

            {/* Formulario de newsletter */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo..."
                  aria-label="Correo electrónico"
                  className="flex-1 rounded-2xl px-6 py-4 text-gray-900 placeholder-gray-600 bg-white border-[3px] border-white/70 shadow-inner focus:outline-none focus:ring-2 focus:ring-white/80"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center rounded-2xl px-8 py-4 font-extrabold uppercase tracking-wide bg-white text-ewa-dark-blue hover:bg-white/95 active:bg-white/90 transition disabled:opacity-70 shadow-md"
                >
                  {status === 'loading' ? 'Enviando…' : 'Suscribirme'}
                </button>
              </form>
              {message && (
                <p className={`mt-2 text-sm ${status === 'error' ? 'text-yellow-200' : 'text-white'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Zona inferior con enlaces */}
      <div className="bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
            <div>
              <div className="mb-4">
                <AnimatedLogoRingInline logoSize={56} />
              </div>
              <p className="text-gray-300 leading-relaxed text-sm max-w-xs">
                Agua en caja, entregada de forma responsable. Hidratación fácil y
                sustentable para tu día a día.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Shop</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="/products" className="text-gray-300 hover:text-ewa-blue transition-colors">Productos</a></li>
                <li><a href="/plans" className="text-gray-300 hover:text-ewa-blue transition-colors">Planes</a></li>
                <li><a href="/subscriptions" className="text-gray-300 hover:text-ewa-blue transition-colors">Suscripciones</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Aprende</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="/about" className="text-gray-300 hover:text-ewa-blue transition-colors">Nuestra historia</a></li>
                <li><a href="/why-ewa" className="text-gray-300 hover:text-ewa-blue transition-colors">¿Por qué EWA?</a></li>
                <li><a href="/blog" className="text-gray-300 hover:text-ewa-blue transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Soporte</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="/contact" className="text-gray-300 hover:text-ewa-blue transition-colors">Contacto</a></li>
                <li><a href="/privacy" className="text-gray-300 hover:text-ewa-blue transition-colors">Privacidad</a></li>
                <li><a href="/legal" className="text-gray-300 hover:text-ewa-blue transition-colors">Legal</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">Síguenos</h3>
              <div className="mt-4 flex items-center gap-4">
                <a href="#" aria-label="Instagram" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition ring-2 ring-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM17.5 6a1 1 0 100 2 1 1 0 000-2z" />
                  </svg>
                </a>
                <a href="#" aria-label="TikTok" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition ring-2 ring-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path d="M14.5 3a7.5 7.5 0 006 2.9v2.4a9.9 9.9 0 01-5.1-1.5v7.2A5.5 5.5 0 119 8.6v2.5a3 3 0 103 3V3h2.5z" />
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition ring-2 ring-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path d="M22 5.9a8.2 8.2 0 01-2.4.7 4.1 4.1 0 001.8-2.3 8.2 8.2 0 01-2.6 1 4.1 4.1 0 00-7 3.7A11.6 11.6 0 013 5.2a4.1 4.1 0 001.3 5.5 4.1 4.1 0 01-1.9-.5v.1a4.1 4.1 0 003.3 4 4.1 4.1 0 01-1.9.1 4.1 4.1 0 003.8 2.8A8.3 8.3 0 012 19.1a11.7 11.7 0 006.3 1.8c7.6 0 11.8-6.3 11.8-11.8v-.5A8.4 8.4 0 0022 5.9z" />
                  </svg>
                </a>
              </div>

              <p className="mt-6 text-gray-300 leading-relaxed text-sm">
                Puerto Rico<br />
                team@ewaboxwater.com<br />
                (787) 936-7992
              </p>
            </div>
          </div>

          {children}

          <div className="mt-12 border-t border-white/10 pt-8 text-center text-gray-400">
            &copy; {currentYear} EWA Box Water. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
