import React from 'react';
import LandingLayout from '../../components/landing/LandingLayout';
import { Droplet, Sparkles, Battery, TrendingUp } from 'lucide-react';

interface HeroCTA {
  label: string;
  style: 'primary' | 'ghost' | 'outline';
}

interface HeroVariant {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  layout:
    | 'split-right'
    | 'split-left'
    | 'background-video'
    | 'stat-overlay'
    | 'gallery'
    | 'card-stack'
    | 'quote'
    | 'minimal-centered'
    | 'floating-icons'
    | 'poster';
  accent?: string;
  image?: string;
  imageSecondary?: string;
  gallery?: string[];
  video?: string;
  stats?: Array<{ label: string; value: string }>;
  quote?: { text: string; author: string; role: string };
  ctas: HeroCTA[];
}

const heroVariants: HeroVariant[] = [
  {
    id: 'hero-1',
    badge: 'EWA Hero #1',
    title: 'Hydrate smarter, live brighter',
    subtitle:
      'Entrega de agua premium en envases circulares con monitoreo en tiempo real y logística sin plástico.',
    layout: 'split-right',
    accent: 'bg-sky-500/30',
    image: '/images/landing/products/product-1.jpeg',
    ctas: [
      { label: 'Agendar demo', style: 'primary' },
      { label: 'Ver clientes', style: 'ghost' },
    ],
  },
  {
    id: 'hero-2',
    badge: 'EWA Hero #2',
    title: 'Cajas inteligentes que eliminan plástico',
    subtitle:
      'Hoteles, gimnasios y coworkings reutilizan cajas con QR para rastrear cada entrega y retorno.',
    layout: 'split-left',
    accent: 'bg-cyan-500/30',
    image: '/images/landing/about/team-facility.jpeg',
    ctas: [
      { label: 'Ver cajas inteligentes', style: 'primary' },
      { label: 'Manual de uso', style: 'outline' },
    ],
  },
  {
    id: 'hero-3',
    badge: 'EWA Hero #3',
    title: 'Hidratación corporativa sin fricción',
    subtitle:
      'Stripe Billing + dashboard EWA: activa pagos recurrentes, lockers 24/7 y reportes ESG en un mismo flujo.',
    layout: 'background-video',
    video: 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4',
    ctas: [
      { label: 'Solicitar onboarding', style: 'primary' },
      { label: 'Ver guía Stripe', style: 'ghost' },
    ],
  },
  {
    id: 'hero-4',
    badge: 'EWA Hero #4',
    title: 'Impacto medible desde el primer mes',
    subtitle: 'Mide plástico evitado, rutas optimizadas y consumo por equipo con tableros en tiempo real.',
    layout: 'stat-overlay',
    accent: 'bg-purple-500/30',
    image: '/images/landing/hero/image1.jpeg',
    stats: [
      { label: 'plástico evitado', value: '-18K botellas/mes' },
      { label: 'rotación', value: '92% de cajas devueltas' },
      { label: 'satisfacción', value: '4.9 / 5 clientes' },
    ],
    ctas: [
      { label: 'Explorar dashboard', style: 'primary' },
    ],
  },
  {
    id: 'hero-5',
    badge: 'EWA Hero #5',
    title: 'Hospitality premium sin plástico',
    subtitle:
      'Botellas de 250 ml y 1000 ml personalizadas para amenidades y suites, con reportes ESG automáticos.',
    layout: 'gallery',
    gallery: [
      '/images/products/250ml/4.png',
      '/images/products/250ml/5.png',
      '/images/products/250ml/6.png',
      '/images/products/1000ml/4.png',
    ],
    ctas: [
      { label: 'Kit de hospitality', style: 'primary' },
    ],
  },
  {
    id: 'hero-6',
    badge: 'EWA Hero #6',
    title: 'Locker y cajas: logística en modo autopiloto',
    subtitle: 'Instalamos lockers inteligentes y cajas con QR para que tus reposiciones funcionen solas.',
    layout: 'card-stack',
    accent: 'bg-emerald-500/30',
    image: '/images/products/500ml/2.png',
    imageSecondary: '/images/landing/about/process.jpeg',
    ctas: [
      { label: 'Tour virtual', style: 'primary' },
      { label: 'Checklist de logística', style: 'ghost' },
    ],
  },
  {
    id: 'hero-7',
    badge: 'EWA Hero #7',
    title: '“El delivery que sí devuelve sus envases”',
    subtitle: 'Historias reales de Synapse Labs, Verde Logistics y Hotel Isla Azul.',
    layout: 'quote',
    quote: {
      text: 'Reducimos 64% el uso de plástico en tres meses y el dashboard nos avisa cuándo reponer.',
      author: 'Laura García',
      role: 'Directora de Operaciones, Verde Logistics',
    },
    image: '/images/products/500ml/5.png',
    ctas: [
      { label: 'Leer casos', style: 'primary' },
    ],
  },
  {
    id: 'hero-8',
    badge: 'EWA Hero #8',
    title: 'Menos plástico. Más datos.',
    subtitle: 'Emparejamos botellas, cajas y dashboard para que midas todo lo que importa sin esfuerzo.',
    layout: 'floating-icons',
    accent: 'bg-sky-500/30',
    image: '/images/landing/products/product-2.jpeg',
    ctas: [
      { label: 'Ver métricas en vivo', style: 'primary' },
      { label: 'Descargar one pager', style: 'ghost' },
    ],
  },
  {
    id: 'hero-9',
    badge: 'EWA Hero #9',
    title: 'Setup en 10 días para tu campus',
    subtitle: 'Recargamos residencias estudiantiles con lockers 24/7, cajas reutilizables y soporte humano.',
    layout: 'minimal-centered',
    accent: 'bg-lime-500/30',
    ctas: [
      { label: 'Agenda workshop', style: 'primary' },
    ],
  },
  {
    id: 'hero-10',
    badge: 'EWA Hero #10',
    title: 'El nuevo póster de tu campaña ESG',
    subtitle: 'Transforma tus reportes en storytelling visual con entregas circulares y datos accionables.',
    layout: 'poster',
    image: '/images/landing/hero/hero-background.jpeg',
    ctas: [
      { label: 'Descargar media kit', style: 'primary' },
    ],
  },
];

const CTAButton: React.FC<{ label: string; style: HeroCTA['style'] }> = ({ label, style }) => {
  const base = 'rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  if (style === 'primary') {
    return <button className={`${base} bg-sky-500 text-slate-900 hover:bg-sky-400 focus:ring-sky-500`}>{label}</button>;
  }
  if (style === 'outline') {
    return <button className={`${base} border border-white/30 text-white/80 hover:border-sky-400 hover:text-white focus:ring-sky-400`}>{label}</button>;
  }
  return <button className={`${base} border border-white/20 text-white/80 hover:border-sky-400 hover:text-white focus:ring-sky-400`}>{label}</button>;
};

const HeroVariantBlock: React.FC<{ variant: HeroVariant }> = ({ variant }) => {
  switch (variant.layout) {
    case 'split-left':
      return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0">
            <div className={`absolute -right-36 bottom-0 h-96 w-96 rounded-full ${variant.accent} blur-3xl`} />
          </div>
          <div className="relative container mx-auto flex flex-col-reverse gap-12 px-4 py-24 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-md">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_40px_80px_-32px_rgba(59,130,246,0.35)]">
                <img src={variant.image} alt={variant.title} className="aspect-[4/5] w-full rounded-[24px] object-cover" />
              </div>
            </div>
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {variant.badge}
              </span>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">{variant.title}</h2>
              <p className="text-lg text-white/70">{variant.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                {variant.ctas.map((cta) => (
                  <CTAButton key={cta.label} label={cta.label} style={cta.style} />
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    case 'background-video':
      return (
        <section className="relative overflow-hidden text-white">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={variant.video}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-slate-950/80" />
          <div className="relative container mx-auto flex flex-col gap-6 px-4 py-32 text-center lg:text-left">
            <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              {variant.badge}
            </span>
            <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {variant.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-white/75">{variant.subtitle}</p>
            <div className="mx-auto flex flex-wrap justify-center gap-3 lg:justify-start">
              {variant.ctas.map((cta) => (
                <CTAButton key={cta.label} label={cta.label} style={cta.style} />
              ))}
            </div>
          </div>
        </section>
      );
    case 'stat-overlay':
      return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0">
            <div className={`absolute -left-32 top-12 h-80 w-80 rounded-full ${variant.accent} blur-3xl`} />
          </div>
          <div className="relative container mx-auto flex flex-col gap-12 px-4 py-24 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-6">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {variant.badge}
              </span>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">{variant.title}</h2>
              <p className="text-lg text-white/70">{variant.subtitle}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {variant.stats?.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {variant.ctas.map((cta) => (
                  <CTAButton key={cta.label} label={cta.label} style={cta.style} />
                ))}
              </div>
            </div>
            <div className="w-full max-w-md">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_40px_80px_-32px_rgba(59,130,246,0.35)]">
                <img src={variant.image} alt={variant.title} className="aspect-[4/5] w-full rounded-[24px] object-cover" />
              </div>
            </div>
          </div>
        </section>
      );
    case 'gallery':
      return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0">
            <div className="absolute -right-40 top-12 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-3xl" />
          </div>
          <div className="relative container mx-auto flex flex-col gap-12 px-4 py-24 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-6">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {variant.badge}
              </span>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">{variant.title}</h2>
              <p className="text-lg text-white/70">{variant.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                {variant.ctas.map((cta) => (
                  <CTAButton key={cta.label} label={cta.label} style={cta.style} />
                ))}
              </div>
            </div>
            <div className="grid w-full max-w-xl grid-cols-2 gap-4">
              {variant.gallery?.map((src) => (
                <img key={src} src={src} alt={variant.title} className="h-40 w-full rounded-2xl object-cover" />
              ))}
            </div>
          </div>
        </section>
      );
    case 'card-stack':
      return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0">
            <div className={`absolute -left-32 bottom-0 h-96 w-96 rounded-full ${variant.accent} blur-3xl`} />
          </div>
          <div className="relative container mx-auto grid gap-12 px-4 py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {variant.badge}
              </span>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">{variant.title}</h2>
              <p className="text-lg text-white/70">{variant.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                {variant.ctas.map((cta) => (
                  <CTAButton key={cta.label} label={cta.label} style={cta.style} />
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-10 top-8 hidden h-40 w-40 rounded-[28px] border border-white/10 bg-white/10 backdrop-blur lg:block" />
              <div className="relative rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <img src={variant.image} alt={variant.title} className="rounded-2xl object-cover" />
                {variant.imageSecondary && (
                  <img
                    src={variant.imageSecondary}
                    alt={`${variant.title} secondary`}
                    className="absolute -bottom-6 -right-6 w-40 rounded-2xl border-4 border-slate-950 object-cover shadow-2xl"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      );
    case 'quote':
      return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
          <div className="relative container mx-auto flex flex-col gap-12 px-4 py-24 text-center lg:flex-row lg:items-center lg:text-left">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {variant.badge}
              </span>
              <blockquote className="text-4xl font-semibold leading-snug text-white sm:text-5xl">
                “{variant.quote?.text}”
              </blockquote>
              <p className="text-sm text-white/60">
                {variant.quote?.author} — {variant.quote?.role}
              </p>
              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                {variant.ctas.map((cta) => (
                  <CTAButton key={cta.label} label={cta.label} style={cta.style} />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="mx-auto max-w-md rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <img src={variant.image} alt={variant.title} className="rounded-[24px] object-cover" />
              </div>
            </div>
          </div>
        </section>
      );
    case 'floating-icons':
      return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
          <div className="absolute left-1/4 top-12 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="relative container mx-auto grid gap-12 px-4 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {variant.badge}
              </span>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">{variant.title}</h2>
              <p className="text-lg text-white/70">{variant.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                {variant.ctas.map((cta) => (
                  <CTAButton key={cta.label} label={cta.label} style={cta.style} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 text-left text-sm text-white/70">
                <div className="flex items-start gap-3">
                  <Droplet className="h-6 w-6 text-sky-400" />
                  <span>Envases de aluminio y cajas reutilizables listos para reciclar.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-sky-400" />
                  <span>Panel con recomendaciones basadas en consumo real.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Battery className="h-6 w-6 text-sky-400" />
                  <span>Lockers inteligentes con sensores de temperatura.</span>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-6 w-6 text-sky-400" />
                  <span>Reportes ESG automáticos para tus stakeholders.</span>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-8 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-white/10" />
              <div className="relative rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <img src={variant.image} alt={variant.title} className="rounded-[24px] object-cover" />
              </div>
            </div>
          </div>
        </section>
      );
    case 'minimal-centered':
      return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0">
            <div className={`absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full ${variant.accent} blur-3xl`} />
          </div>
          <div className="relative container mx-auto px-4 py-28 text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              {variant.badge}
            </span>
            <h2 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">{variant.title}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-white/70">{variant.subtitle}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {variant.ctas.map((cta) => (
                <CTAButton key={cta.label} label={cta.label} style={cta.style} />
              ))}
            </div>
          </div>
        </section>
      );
    case 'poster':
      return (
        <section
          className="relative overflow-hidden text-white"
          style={{
            backgroundImage: `linear-gradient(rgba(8,15,32,0.75), rgba(8,15,32,0.85)), url('${variant.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container mx-auto px-4 py-32 text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              {variant.badge}
            </span>
            <h2 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">{variant.title}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-lg text-white/80">{variant.subtitle}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {variant.ctas.map((cta) => (
                <CTAButton key={cta.label} label={cta.label} style={cta.style} />
              ))}
            </div>
          </div>
        </section>
      );
    default:
      return (
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0">
            <div className={`absolute -right-24 top-10 h-80 w-80 rounded-full ${variant.accent} blur-3xl`} />
            <div className={`absolute -left-24 bottom-0 h-96 w-96 rounded-full ${variant.accent} blur-3xl`} />
          </div>
          <div className="relative container mx-auto flex flex-col gap-12 px-4 py-24 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                {variant.badge}
              </span>
              <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">{variant.title}</h2>
              <p className="text-lg text-white/70">{variant.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                {variant.ctas.map((cta) => (
                  <CTAButton key={cta.label} label={cta.label} style={cta.style} />
                ))}
              </div>
            </div>
            <div className="w-full max-w-md">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_40px_80px_-32px_rgba(59,130,246,0.35)]">
                <img src={variant.image} alt={variant.title} className="aspect-[4/5] w-full rounded-[24px] object-cover" />
              </div>
            </div>
          </div>
        </section>
      );
  }
};

const DemoHeroesPage: React.FC = () => {
  return (
    <LandingLayout title="Demo Heroes" onAccessRedirect={() => {}}>
      <div className="bg-slate-900 py-10 text-center text-white">
        <h1 className="text-3xl font-semibold">Variaciones del Hero EWA</h1>
        <p className="mt-2 text-sm text-white/70">
          Iteraciones con diferentes composiciones, CTA y assets para inspirar campañas y experimentos A/B.
        </p>
      </div>

      <div className="space-y-24 bg-white py-16">
        {heroVariants.map((variant) => (
          <HeroVariantBlock key={variant.id} variant={variant} />
        ))}
      </div>
    </LandingLayout>
  );
};

export default DemoHeroesPage;
