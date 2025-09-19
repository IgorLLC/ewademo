import React from 'react';
import { Button } from '@ewa/ui';
import { useRouter } from 'next/router';

interface HeroSectionProps {
  user?: any;
  onAccessRedirect: () => void;
}

const highlightStats = [
  {
    label: 'Hidratación inteligente',
    value: '72 hrs',
    helper: 'de frescura garantizada',
  },
  {
    label: 'Residuos plásticos evitados',
    value: '18K+',
    helper: 'botellas al mes junto a clientes',
  },
  {
    label: 'Clientes felices',
    value: '4.9★',
    helper: 'promedio en reseñas verificadas',
  },
];

const trustedLogos = ['The Pioneer', 'Caribbean Today', 'Eco Switch', 'PR Retail'];

const HeroSection: React.FC<HeroSectionProps> = ({ user, onAccessRedirect }) => {
  const router = useRouter();

  const goToPlans = () => router.push('/plans');
  const goToRegister = () => router.push('/register');

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute bottom-[-160px] left-1/3 h-[420px] w-[420px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_rgba(15,23,42,0))]" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 pb-24 pt-32 lg:pb-32 lg:pt-36">
          <div className="grid gap-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] xl:gap-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 backdrop-blur">
                Nueva generación de hidratación consciente
              </div>
              <h1 className="mt-8 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                Agua premium en caja para equipos que quieren rendir más y contaminar menos.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/70 sm:text-xl">
                EWA Box Water combina minerales calibrados con envases 100% reciclables para que cada sorbo cuente. Entrega programada, monitoreo inteligente y soporte humano 24/7.
              </p>

              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  onClick={user ? onAccessRedirect : goToPlans}
                  className="bg-sky-500 text-slate-950 hover:bg-sky-400 px-8 py-4 text-base font-semibold shadow-lg shadow-sky-500/30 transition"
                >
                  {user ? 'Ir a mi panel' : 'Ver planes disponibles'}
                </Button>
                <button
                  onClick={user ? goToPlans : goToRegister}
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white/80 transition hover:border-sky-400 hover:text-white"
                >
                  {user ? 'Explorar planes corporativos' : 'Crear cuenta gratuita'}
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-3">
                {highlightStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <div className="text-sm font-medium uppercase tracking-wide text-white/50">{stat.label}</div>
                    <div className="mt-3 text-3xl font-semibold text-white">{stat.value}</div>
                    <div className="mt-2 text-sm text-white/60">{stat.helper}</div>
                  </div>
                ))}
              </div>

              <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 text-xs uppercase tracking-[0.3em] text-white/40">
                <span className="font-semibold text-white/60">Con la confianza de</span>
                {trustedLogos.map((logo) => (
                  <span key={logo}>{logo}</span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-8 hidden h-24 w-24 rounded-3xl border border-white/10 bg-white/5 backdrop-blur lg:block" />
              <div className="absolute -right-8 bottom-6 hidden h-20 w-20 rounded-full border border-white/10 bg-sky-400/20 blur-xl lg:block" />

              <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[28px]">
                  <img
                    src="/images/landing/hero/image1.jpeg"
                    alt="EWA Box Water - Kit de hidratación"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent" />
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6 text-left">
                  <div className="flex items-center justify-between text-sm text-white/50">
                    <span>Dashboard en tiempo real</span>
                    <svg className="h-5 w-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-white">Recomendaciones personalizadas</h3>
                  <p className="mt-2 text-sm text-white/60">
                    Ajusta entregas, monitorea consumos y recibe alertas cuando tu equipo necesita recargas.
                  </p>
                  <ul className="mt-4 space-y-3 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Alertas predictivas por consumo
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Integración con calendarios logísticos
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Reportes de impacto ambiental
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
