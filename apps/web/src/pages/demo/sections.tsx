import React from 'react';
import LandingLayout from '../../components/landing/LandingLayout';
import {
  Sparkles,
  Droplet,
  Truck,
  ShieldCheck,
  BarChart3,
  Leaf,
  Clock,
  Zap,
  Globe,
  Users,
  Repeat,
  Building,
  CheckCircle2,
  Thermometer,
  Heart,
  Layers,
  Target,
  StickyNote,
  Share2,
} from 'lucide-react';

const iconMap = {
  sparkles: Sparkles,
  droplet: Droplet,
  truck: Truck,
  shield: ShieldCheck,
  analytics: BarChart3,
  leaf: Leaf,
  clock: Clock,
  zap: Zap,
  globe: Globe,
  users: Users,
  repeat: Repeat,
  building: Building,
  check: CheckCircle2,
  thermometer: Thermometer,
  heart: Heart,
  layers: Layers,
  target: Target,
  notebook: StickyNote,
  share: Share2,
} as const;

type IconKey = keyof typeof iconMap;

type Feature = {
  title: string;
  description: string;
  icon?: IconKey;
};

type Metric = {
  label: string;
  value: string;
  helper?: string;
};

type Step = {
  title: string;
  description: string;
  icon?: IconKey;
  duration?: string;
};

type FAQ = {
  question: string;
  answer: string;
};

type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

type ComparisonRow = {
  label: string;
  values: string[];
};

type LayoutType =
  | 'feature-grid'
  | 'feature-with-image'
  | 'stats-highlight'
  | 'process-steps'
  | 'testimonial-card'
  | 'testimonial-grid'
  | 'cta-gradient'
  | 'faq-panel'
  | 'comparison-table'
  | 'integration-strip'
  | 'case-study'
  | 'timeline'
  | 'newsletter'
  | 'press-strip'
  | 'value-props'
  | 'logistics-split'
  | 'impact-metrics'
  | 'product-stack'
  | 'story-block'
  | 'promo-banner';

type SectionVariant = {
  id: string;
  label: string;
  eyebrow?: string;
  title: string;
  description: string;
  layout: LayoutType;
  features?: Feature[];
  metrics?: Metric[];
  steps?: Step[];
  faqs?: FAQ[];
  testimonials?: Testimonial[];
  comparison?: {
    columns: string[];
    rows: ComparisonRow[];
  };
  integrations?: string[];
  media?: {
    image: string;
    alt: string;
  };
  background?: 'light' | 'dark' | 'gradient';
};

const renderIcon = (key?: IconKey, className = 'h-6 w-6 text-sky-500') => {
  if (!key) return null;
  const Icon = iconMap[key];
  return <Icon className={className} />;
};

const sectionVariants: SectionVariant[] = [
  {
    id: 'features-grid-1',
    label: 'Feature Grid – Circular Logistics',
    eyebrow: 'Operación circular',
    title: 'Todo lo que necesitas para entregar agua premium sin residuos',
    description:
      'Integramos cajas reutilizables, monitoreo en vivo y rutas optimizadas para que tu operación no se detenga.',
    layout: 'feature-grid',
    features: [
      {
        title: 'Cajas inteligentes',
        description: 'QR únicos, sensores y alertas para reposiciones proactivas.',
        icon: 'sparkles',
      },
      {
        title: 'Rutas eficientes',
        description: 'Optimizamos logística y devoluciones con IA logística y datos históricos.',
        icon: 'truck',
      },
      {
        title: 'Dashboard en vivo',
        description: 'Panel único con métricas de consumo, residuos evitados y SLA.',
        icon: 'analytics',
      },
    ],
  },
  {
    id: 'feature-image-2',
    label: 'Feature Split – Hospitality',
    eyebrow: 'Hospitality premium',
    title: 'Amenidades personalizadas listas en 48 horas',
    description:
      'Personalizamos sleeves, integraciones con housekeeping y reposiciones automáticas con lockers EWA.',
    layout: 'feature-with-image',
    media: {
      image: '/images/landing/products/product-1.jpeg',
      alt: 'Kit amenidades EWA',
    },
    features: [
      {
        title: 'Branding a color',
        description: 'Sleeves full color y mensajes sostenibles por habitación.',
        icon: 'share',
      },
      {
        title: 'Reposición express',
        description: 'Reposiciones sincronizadas con housekeeping y PMS.',
        icon: 'clock',
      },
      {
        title: 'Reporte ESG',
        description: 'Impacto ambiental consolidado para tus reportes globales.',
        icon: 'leaf',
      },
    ],
  },
  {
    id: 'stats-highlight-3',
    label: 'Stats Highlight – Impacto',
    eyebrow: 'Impacto medible',
    title: 'Resultados que elevan tu score ESG desde el primer trimestre',
    description:
      'Visualiza los indicadores clave que nuestros clientes reportan tras activar EWA Box Water.',
    layout: 'stats-highlight',
    background: 'dark',
    metrics: [
      { label: 'Plástico evitado', value: '64%', helper: 'Promedio en 90 días' },
      { label: 'Consumo por persona', value: '+32%', helper: 'Más hidratación saludable' },
      { label: 'Tiempo operativo', value: '-18h', helper: 'De coordinación por mes' },
      { label: 'Retorno de envases', value: '93%', helper: 'Tracking en tiempo real' },
    ],
  },
  {
    id: 'process-steps-4',
    label: 'Process Steps – Onboarding',
    eyebrow: 'Onboarding en 10 días',
    title: 'Así activamos tu operación circular de principio a fin',
    description: 'Nuestro equipo te acompaña desde el diagnóstico hasta el go-live con datos conectados.',
    layout: 'process-steps',
    steps: [
      {
        title: 'Diagnóstico y forecast',
        description: 'Analizamos consumos reales y diseñamos la matriz de entregas.',
        icon: 'notebook',
        duration: 'Día 1-2',
      },
      {
        title: 'Instalación y training',
        description: 'Configuramos lockers, QR y capacitamos a tu equipo.',
        icon: 'layers',
        duration: 'Día 3-6',
      },
      {
        title: 'Integraciones y piloto',
        description: 'Conectamos Stripe Billing, webhooks y ejecutamos piloto controlado.',
        icon: 'zap',
        duration: 'Día 7-10',
      },
    ],
  },
  {
    id: 'testimonial-card-5',
    label: 'Testimonial – Hospitality Director',
    eyebrow: 'Lo que dicen nuestros clientes',
    title: '“La experiencia del huésped subió y el plástico desapareció del check-in”',
    description:
      'Mariana López, directora de operaciones en Hotel Isla Azul, transformó la hidratación de sus 11 propiedades.',
    layout: 'testimonial-card',
    testimonials: [
      {
        quote:
          'Reducimos 3.2 toneladas de plástico al trimestre y automatizamos la reposición con lockers EWA conectados a housekeeping.',
        author: 'Mariana López',
        role: 'Directora de Operaciones, Hotel Isla Azul',
      },
    ],
  },
  {
    id: 'testimonial-grid-6',
    label: 'Testimonials – Corporate & Fitness',
    eyebrow: 'Confianza comprobada',
    title: 'Equipos de alto rendimiento confían en EWA',
    description: 'Historias reales desde corporativos a cadenas fitness en LATAM.',
    layout: 'testimonial-grid',
    testimonials: [
      {
        quote: 'Administramos 18 sedes con un dashboard y pasamos de botellas desechables a cajas retornables.',
        author: 'Pedro Hernández',
        role: 'COO, Synapse Labs',
      },
      {
        quote: 'El consumo por socio aumentó 41% porque la hidratación está donde la necesitan.',
        author: 'Laura Díaz',
        role: 'Head Coach, Pulse Fitness',
      },
    ],
  },
  {
    id: 'cta-gradient-7',
    label: 'CTA Gradient – Discovery Call',
    eyebrow: 'Empieza hoy',
    title: 'Agenda una sesión de descubrimiento y activa tu piloto sin costo',
    description:
      'Co-diseñamos tu logística circular, personalizamos branding y dejamos tu operación lista en menos de dos semanas.',
    layout: 'cta-gradient',
  },
  {
    id: 'faq-panel-8',
    label: 'FAQ Panel – Preguntas clave',
    eyebrow: 'Preguntas frecuentes',
    title: 'Todo lo que necesitas saber antes de activar EWA',
    description: 'Resolvemos las dudas más comunes sobre logística, costos y mantenimiento.',
    layout: 'faq-panel',
    faqs: [
      {
        question: '¿Cómo funciona la recogida de cajas vacías?',
        answer: 'Programamos rutas inversas semanales y confirmamos devoluciones con códigos QR por caja.',
      },
      {
        question: '¿Qué pasa si necesito reposición urgente?',
        answer: 'Contamos con stock buffer en tu ciudad y SLA de 6 horas para reposición express.',
      },
      {
        question: '¿Puedo usar mi propio branding?',
        answer: 'Sí, producimos sleeves personalizados y materiales POP a color en menos de 48 horas.',
      },
    ],
  },
  {
    id: 'comparison-table-9',
    label: 'Comparison Table – Circular vs tradicional',
    eyebrow: 'Por qué elegir EWA',
    title: 'Comparativa entre EWA y proveedores tradicionales de agua embotellada',
    description: 'Reduce costos ocultos y gana visibilidad completa sobre tu operación.',
    layout: 'comparison-table',
    comparison: {
      columns: ['EWA Box Water', 'Proveedor tradicional'],
      rows: [
        {
          label: 'Monitoreo en vivo',
          values: ['Incluido con alertas predictivas', 'No disponible'],
        },
        {
          label: 'Residuos plásticos',
          values: ['-64% promedio', '+80% botellas de un solo uso'],
        },
        {
          label: 'Reposición urgente',
          values: ['SLA 6h con app logística', '48-72h según disponibilidad'],
        },
        {
          label: 'Integraciones',
          values: ['Stripe, Slack, calendarios', 'No integraciones'],
        },
      ],
    },
  },
  {
    id: 'integration-strip-10',
    label: 'Integration Strip – Stack digital',
    eyebrow: 'Stack conectado',
    title: 'Integraciones listas para conectar tu operación',
    description:
      'Enlazamos tus herramientas favoritas para automatizar facturación, soporte y métricas ESG.',
    layout: 'integration-strip',
    integrations: ['Stripe', 'Slack', 'Notion', 'Zapier', 'Zendesk', 'Looker'],
  },
  {
    id: 'case-study-11',
    label: 'Case Study – Universidad',
    eyebrow: 'Caso destacado',
    title: 'Universidad Horizonte: 27 hectáreas libres de botellas desechables',
    description:
      'Instalamos lockers y rutas internas que abastecen 14 edificios con métricas en vivo.',
    layout: 'case-study',
    media: {
      image: '/images/landing/about/team-facility.jpeg',
      alt: 'Equipo EWA instalando lockers',
    },
    metrics: [
      { label: 'Edificios conectados', value: '14' },
      { label: 'Puntos de hidratación', value: '62' },
      { label: 'Recorridos optimizados', value: '-28%' },
    ],
  },
  {
    id: 'timeline-12',
    label: 'Timeline – Ruta de entrega',
    eyebrow: 'Ciclo operativo',
    title: 'Una semana típica con EWA en tu sede corporativa',
    description: 'Visibilidad de punta a punta para tu equipo de facilities.',
    layout: 'timeline',
    steps: [
      {
        title: 'Lunes — Diagnóstico de stock',
        description: 'El dashboard alerta niveles bajos y sugiere reposiciones.',
        icon: 'analytics',
      },
      {
        title: 'Miércoles — Recolección programada',
        description: 'Recogemos cajas vacías y registramos devoluciones con QR.',
        icon: 'repeat',
      },
      {
        title: 'Viernes — Reporte ESG',
        description: 'Enviamos resumen de consumo e impacto semanal a tu inbox.',
        icon: 'target',
      },
    ],
  },
  {
    id: 'newsletter-13',
    label: 'Newsletter – Actualizaciones',
    eyebrow: 'Recibe insights',
    title: 'Únete al boletín mensual de operaciones circulares',
    description:
      'Casos reales, benchmarks de hidratación y playbooks descargables para tu equipo.',
    layout: 'newsletter',
  },
  {
    id: 'press-strip-14',
    label: 'Press Strip – Partners',
    eyebrow: 'Seleccionados por medios',
    title: 'Los principales medios resaltan nuestra red circular',
    description: 'Historias en The Pioneer, Eco Switch, PR Retail y más.',
    layout: 'press-strip',
    integrations: ['The Pioneer', 'Eco Switch', 'PR Retail', 'Sustainable LATAM', 'Green Logistics'],
  },
  {
    id: 'value-props-15',
    label: 'Value Props – ESG',
    eyebrow: 'Valores EWA',
    title: 'Un partner ESG que opera a tu ritmo',
    description:
      'Entendemos tus objetivos ambientales, financieros y de experiencia de usuario.',
    layout: 'value-props',
    features: [
      {
        title: 'Circularidad comprobable',
        description: 'Cada caja tiene traza completa desde llenado hasta retorno.',
        icon: 'check',
      },
      {
        title: 'Bienestar del talento',
        description: 'Programas de hidratación personalizados por área y horario.',
        icon: 'heart',
      },
      {
        title: 'Escala regional',
        description: 'Operamos en CDMX, Mérida, Bogotá y Lima con SLA unificado.',
        icon: 'globe',
      },
    ],
  },
  {
    id: 'logistics-split-16',
    label: 'Logistics Split – Centros de acopio',
    eyebrow: 'Logística inteligente',
    title: 'Centros de acopio urbanos para rutas de última milla más ágiles',
    description:
      'Consolida entregas con micro hubs refrigerados y devoluciones clasificadas.',
    layout: 'logistics-split',
    media: {
      image: '/images/landing/about/process.jpeg',
      alt: 'Mapa de centros logísticos',
    },
    features: [
      {
        title: 'Micro hubs refrigerados',
        description: 'Temperatura controlada 24/7 para cajas y botellones.',
        icon: 'thermometer',
      },
      {
        title: 'Rutas dinámicas',
        description: 'Asignamos operadores según demanda y tráfico en tiempo real.',
        icon: 'truck',
      },
    ],
  },
  {
    id: 'impact-metrics-17',
    label: 'Impact Metrics – ESG Board',
    eyebrow: 'Panel ESG',
    title: 'Indicadores que tu comité ESG necesita cada trimestre',
    description: 'Exporta reportes limpios para auditorías y juntas directivas.',
    layout: 'impact-metrics',
    metrics: [
      { label: 'Huella de CO₂ evitada', value: '1.2 t', helper: 'vs botellas PET' },
      { label: 'Uso de agua optimizado', value: '85%', helper: 'Suministro aprovechado' },
      { label: 'Satisfacción usuarios', value: '4.9/5', helper: 'Encuestas internas' },
      { label: 'ROI logístico', value: '2.4x', helper: 'Comparado con gestión interna' },
    ],
  },
  {
    id: 'product-stack-18',
    label: 'Product Stack – Portfolio',
    eyebrow: 'Portafolio completo',
    title: 'Formatos pensados para cada punto de consumo',
    description:
      'Botellas de 250 ml para amenidades, litros para salas de juntas y cajas para refill masivo.',
    layout: 'product-stack',
    media: {
      image: '/images/products/500ml/2.png',
      alt: 'Portafolio de botellas EWA',
    },
    features: [
      {
        title: 'Sleeves personalizables',
        description: 'Mensaje y branding adaptado a cada campaña.',
        icon: 'sparkles',
      },
      {
        title: 'Material 100% reciclable',
        description: 'Cartón certificado y aluminio infinito.',
        icon: 'leaf',
      },
    ],
  },
  {
    id: 'story-block-19',
    label: 'Story Block – Cultura',
    eyebrow: 'Cultura circular',
    title: 'Equipos más comprometidos con la sostenibilidad',
    description:
      'Activamos campañas internas que convierten la hidratación en un hábito medible.',
    layout: 'story-block',
    testimonials: [
      {
        quote:
          'Dejamos de gestionar pedidos manuales, ahora el equipo participa con retos mensuales de hidratación y devoluciones.',
        author: 'Ana Lucía Gutiérrez',
        role: 'People Manager, Grupo Aurora',
      },
    ],
    features: [
      {
        title: 'Retos gamificados',
        description: 'Leaderboard y recompensas para equipos más hidratados.',
        icon: 'target',
      },
      {
        title: 'Comunicación interna',
        description: 'Plantillas listas para Slack, intranet y señalética.',
        icon: 'share',
      },
    ],
  },
  {
    id: 'promo-banner-20',
    label: 'Promo Banner – Lanzamiento sede',
    eyebrow: 'Lanzamiento especial',
    title: 'Activa tu segundo site con 50% en logística durante el primer mes',
    description:
      'Disponible para clientes actuales que abran una nueva sede antes del 30 de noviembre.',
    layout: 'promo-banner',
  },
];

const SectionVariantBlock: React.FC<{ variant: SectionVariant }> = ({ variant }) => {
  const baseContainer = 'container mx-auto px-4';

  switch (variant.layout) {
    case 'feature-grid':
      return (
        <section className="bg-white py-16">
          <div className={`${baseContainer} space-y-8`}>
            <div className="max-w-3xl space-y-3">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {variant.features?.map((feature) => (
                <div
                  key={feature.title}
                  className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.2)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100">
                    {renderIcon(feature.icon)}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'feature-with-image':
      return (
        <section className="bg-slate-50 py-16">
          <div className={`${baseContainer} grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center`}>
            <div className="space-y-4">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {variant.features?.map((feature) => (
                  <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white/70 p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-full bg-sky-100 p-2">
                        {renderIcon(feature.icon, 'h-5 w-5 text-sky-600')}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {variant.media && (
              <div className="relative">
                <div className="absolute -inset-4 rounded-[36px] bg-sky-200/40 blur-2xl" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-xl">
                  <img src={variant.media.image} alt={variant.media.alt} className="w-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </section>
      );
    case 'stats-highlight':
      return (
        <section className="relative overflow-hidden py-20 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          <div className="relative container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              {variant.eyebrow && (
                <span className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold sm:text-4xl">{variant.title}</h2>
              <p className="text-lg text-white/70">{variant.description}</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {variant.metrics?.map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/50">{metric.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
                  {metric.helper && <p className="mt-2 text-sm text-white/60">{metric.helper}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'process-steps':
      return (
        <section className="bg-white py-16">
          <div className={`${baseContainer} space-y-10`}>
            <div className="max-w-3xl space-y-3">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {variant.steps?.map((step) => (
                <div key={step.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-white p-3 shadow-sm">
                      {renderIcon(step.icon, 'h-6 w-6 text-emerald-600')}
                    </div>
                    {step.duration && <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{step.duration}</span>}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'testimonial-card':
      return (
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 text-white">
          <div className={`${baseContainer} flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between`}>
            <div className="max-w-xl space-y-4">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-white/70 sm:text-lg">{variant.description}</p>
            </div>
            <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
              {variant.testimonials?.map((testimonial) => (
                <blockquote key={testimonial.author} className="space-y-6">
                  <p className="text-xl leading-relaxed text-white/80">“{testimonial.quote}”</p>
                  <cite className="block text-sm text-white/60">
                    {testimonial.author} — {testimonial.role}
                  </cite>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      );
    case 'testimonial-grid':
      return (
        <section className="bg-slate-50 py-16">
          <div className={`${baseContainer} space-y-10`}>
            <div className="max-w-3xl space-y-3">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {variant.testimonials?.map((testimonial) => (
                <blockquote
                  key={testimonial.author}
                  className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.18)]"
                >
                  <p className="text-lg leading-relaxed text-slate-700">“{testimonial.quote}”</p>
                  <cite className="mt-6 block text-sm font-semibold text-slate-500">
                    {testimonial.author} — {testimonial.role}
                  </cite>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      );
    case 'cta-gradient':
      return (
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-400" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.45),transparent)]" />
          <div className="relative container mx-auto flex flex-col items-center gap-6 px-4 text-center text-slate-950">
            {variant.eyebrow && (
              <span className="inline-flex items-center rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900/80">
                {variant.eyebrow}
              </span>
            )}
            <h2 className="text-3xl font-semibold sm:text-4xl">{variant.title}</h2>
            <p className="max-w-2xl text-base text-slate-900/80 sm:text-lg">{variant.description}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-900">
                Agendar discovery call
              </button>
              <button className="rounded-full border border-slate-900/20 bg-white/70 px-8 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900/40">
                Descargar checklist
              </button>
            </div>
          </div>
        </section>
      );
    case 'faq-panel':
      return (
        <section className="bg-white py-16">
          <div className={`${baseContainer} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`}>
            <div className="space-y-4">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
            </div>
            <div className="space-y-4">
              {variant.faqs?.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-slate-900">
                    {faq.question}
                    <span className="text-slate-400 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );
    case 'comparison-table':
      return (
        <section className="bg-slate-50 py-16">
          <div className={`${baseContainer} space-y-6`}>
            <div className="max-w-3xl space-y-3">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Detalle</th>
                    {variant.comparison?.columns.map((column) => (
                      <th key={column} className="px-6 py-4">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {variant.comparison?.rows.map((row) => (
                    <tr key={row.label}>
                      <td className="px-6 py-4 font-semibold text-slate-900">{row.label}</td>
                      {row.values.map((value, index) => (
                        <td key={`${row.label}-${index}`} className="px-6 py-4 text-slate-600">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );
    case 'integration-strip':
      return (
        <section className="bg-white py-12">
          <div className={`${baseContainer} space-y-6 text-center`}>
            {variant.eyebrow && (
              <span className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                {variant.eyebrow}
              </span>
            )}
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{variant.title}</h2>
            <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {variant.integrations?.map((integration) => (
                <span
                  key={integration}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-600"
                >
                  {integration}
                </span>
              ))}
            </div>
          </div>
        </section>
      );
    case 'case-study':
      return (
        <section className="bg-slate-950 py-20 text-white">
          <div className={`${baseContainer} grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center`}>
            <div className="space-y-4">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-white/70 sm:text-lg">{variant.description}</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {variant.metrics?.map((metric) => (
                  <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">{metric.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
            {variant.media && (
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_40px_80px_-40px_rgba(6,182,212,0.45)]">
                <img src={variant.media.image} alt={variant.media.alt} className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </section>
      );
    case 'timeline':
      return (
        <section className="bg-slate-50 py-16">
          <div className={`${baseContainer} space-y-8`}>
            <div className="max-w-3xl space-y-3">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 h-full w-px bg-emerald-200" />
              <div className="space-y-8">
                {variant.steps?.map((step, index) => (
                  <div key={step.title} className="relative ml-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="absolute -left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                      {index + 1}
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                      {renderIcon(step.icon, 'h-5 w-5 text-emerald-600')}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    case 'newsletter':
      return (
        <section className="bg-white py-16">
          <div className={`${baseContainer} grid gap-10 rounded-[36px] border border-slate-200 bg-slate-50 p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center`}>
            <div className="space-y-4">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
            </div>
            <form
              className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.2)] sm:flex-row sm:items-center"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <input
                type="email"
                required
                placeholder="tu@empresa.com"
                className="h-12 flex-1 rounded-full border border-slate-200 px-5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-slate-950 shadow hover:bg-sky-400"
              >
                Recibir insights
              </button>
            </form>
          </div>
        </section>
      );
    case 'press-strip':
      return (
        <section className="bg-slate-950 py-12 text-white">
          <div className={`${baseContainer} space-y-6 text-center`}>
            {variant.eyebrow && (
              <span className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {variant.eyebrow}
              </span>
            )}
            <h2 className="text-2xl font-semibold sm:text-3xl">{variant.title}</h2>
            <p className="text-base text-white/70 sm:text-lg">{variant.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {variant.integrations?.map((name) => (
                <span key={name} className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      );
    case 'value-props':
      return (
        <section className="bg-white py-16">
          <div className={`${baseContainer} space-y-10`}>
            <div className="max-w-3xl space-y-3">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {variant.features?.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                    {renderIcon(feature.icon, 'h-5 w-5')}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'logistics-split':
      return (
        <section className="bg-slate-50 py-16">
          <div className={`${baseContainer} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center`}>
            {variant.media && (
              <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-lg">
                <img src={variant.media.image} alt={variant.media.alt} className="w-full object-cover" />
              </div>
            )}
            <div className="space-y-4">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {variant.features?.map((feature) => (
                  <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-slate-900/10 p-2 text-slate-900">
                        {renderIcon(feature.icon, 'h-5 w-5')}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    case 'impact-metrics':
      return (
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 text-white">
          <div className={`${baseContainer} space-y-8 text-center`}>
            {variant.eyebrow && (
              <span className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {variant.eyebrow}
              </span>
            )}
            <h2 className="text-3xl font-semibold sm:text-4xl">{variant.title}</h2>
            <p className="mx-auto max-w-2xl text-base text-white/70 sm:text-lg">{variant.description}</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {variant.metrics?.map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{metric.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{metric.value}</p>
                  {metric.helper && <p className="mt-2 text-sm text-white/60">{metric.helper}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'product-stack':
      return (
        <section className="bg-white py-16">
          <div className={`${baseContainer} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center`}>
            <div className="space-y-4">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-sky-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {variant.features?.map((feature) => (
                  <div key={feature.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-sky-100 p-2">
                        {renderIcon(feature.icon, 'h-5 w-5 text-sky-600')}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {variant.media && (
              <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-lg">
                <img src={variant.media.image} alt={variant.media.alt} className="w-full object-cover" />
              </div>
            )}
          </div>
        </section>
      );
    case 'story-block':
      return (
        <section className="bg-slate-50 py-16">
          <div className={`${baseContainer} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center`}>
            <div className="space-y-6">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-700">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{variant.title}</h2>
              <p className="text-base text-slate-600 sm:text-lg">{variant.description}</p>
              {variant.testimonials?.map((testimonial) => (
                <blockquote key={testimonial.author} className="rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
                  <p className="text-lg leading-relaxed text-slate-700">“{testimonial.quote}”</p>
                  <cite className="mt-4 block text-sm font-semibold text-rose-600">
                    {testimonial.author} — {testimonial.role}
                  </cite>
                </blockquote>
              ))}
            </div>
            <div className="grid gap-4">
              {variant.features?.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-rose-100 p-2 text-rose-700">
                      {renderIcon(feature.icon, 'h-5 w-5')}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'promo-banner':
      return (
        <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-14 text-white">
          <div className={`${baseContainer} flex flex-col items-center gap-4 text-center lg:flex-row lg:justify-between lg:text-left`}>
            <div className="space-y-3">
              {variant.eyebrow && (
                <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  {variant.eyebrow}
                </span>
              )}
              <h2 className="text-2xl font-semibold sm:text-3xl">{variant.title}</h2>
              <p className="text-base text-white/70 sm:text-lg">{variant.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 shadow hover:bg-slate-100">
                Reservar nueva sede
              </button>
              <button className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:border-white/50">
                Hablar con operaciones
              </button>
            </div>
          </div>
        </section>
      );
    default:
      return null;
  }
};

const SectionsDemoPage: React.FC = () => {
  return (
    <LandingLayout title="Demo secciones frontpage" onAccessRedirect={() => {}}>
      <div id="top" className="bg-slate-950 py-16 text-white">
        <div className="container mx-auto space-y-6 px-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Biblioteca UI
          </span>
          <h1 className="text-4xl font-semibold sm:text-5xl">Variantes de secciones para landing page</h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 sm:text-lg">
            Explora 20 composiciones inspiradas en nuestra portada para probar mensajes, campañas y distribuciones antes de llevarlos a producción.
          </p>
        </div>
      </div>
      <div className="space-y-16 bg-slate-100 py-16">
        {sectionVariants.map((variant) => (
          <div key={variant.id} className="space-y-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{variant.id}</p>
                  <h2 className="text-lg font-semibold text-slate-900">{variant.label}</h2>
                </div>
                <a
                  href="#top"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 hover:text-slate-600"
                >
                  Volver arriba
                </a>
              </div>
            </div>
            <SectionVariantBlock variant={variant} />
          </div>
        ))}
      </div>
    </LandingLayout>
  );
};

export default SectionsDemoPage;
