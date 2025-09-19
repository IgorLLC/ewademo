import React, { useMemo, useState } from 'react';
import { Button } from '@ewa/ui';
import { useRouter } from 'next/router';

const segments = [
  {
    id: 'play',
    label: 'Hidratación diaria',
    heading: 'Para equipos que necesitan rendimiento constante',
    description:
      'Nuestras cajas de 12 oz. mantienen el equilibrio mineral perfecto para oficinas, gimnasios y espacios creativos que operan sin pausa.',
    highlights: ['Reposición automática inteligente', 'Panel de consumo compartido', 'Entrega en bloques de 24h'],
  },
  {
    id: 'work',
    label: 'Operaciones & logística',
    heading: 'Hidrata a tu crew en ruta sin generar residuos',
    description:
      'Ideal para centros de distribución, brigadas y equipos de campo. Configura entregas móviles y controla inventario en cada punto.',
    highlights: ['Trackers QR para cada caja', 'Alertas de reposición por ubicación', 'Facturación centralizada'],
  },
  {
    id: 'sleep',
    label: 'Bienestar & hospitality',
    heading: 'Hospitalidad premium con impacto ambiental mínimo',
    description:
      'Combina experiencias boutique con hidratación responsable en hoteles, spas y residencias temporales.',
    highlights: ['Diseño a la vista del huésped', 'Firmas personalizadas por marca', 'Consumo medido por estancia'],
  },
];

const products = [
  {
    id: 'natural',
    title: 'EWA Pure Flow',
    flavor: 'Agua natural remineralizada',
    badge: 'Más pedido',
    description: 'Blend balanceado con calcio y magnesio para sensación suave y ligera.',
    image: '/images/landing/products/product-1.jpeg',
    price: 'Desde $28/pack',
  },
  {
    id: 'electrolytes',
    title: 'EWA Active Boost',
    flavor: 'Electrolitos + zinc',
    badge: 'Equipos deportivos',
    description: 'Recuperación rápida tras jornadas intensas con sodio controlado y potasio extra.',
    image: '/images/landing/products/product-2.jpeg',
    price: 'Desde $32/pack',
  },
  {
    id: 'alkaline',
    title: 'EWA Alkaline Night',
    flavor: 'Ph 8.5 con antioxidantes',
    badge: 'Hospitality',
    description: 'Suaviza la digestión nocturna y reduce la sensación de resequedad al despertar.',
    image: '/images/landing/products/product-1.jpeg',
    price: 'Desde $35/pack',
  },
];

const ProductSection: React.FC = () => {
  const router = useRouter();
  const [activeSegment, setActiveSegment] = useState(segments[0].id);

  const currentSegment = useMemo(
    () => segments.find((segment) => segment.id === activeSegment) ?? segments[0],
    [activeSegment],
  );

  return (
    <section className="relative bg-slate-950 py-20">
      <div className="relative container mx-auto px-4">
        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="lg:w-2/5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
              Catálogo ewa
            </div>
            <h2 className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl">Nuestros programas adaptados a tu realidad</h2>
            <p className="mt-3 text-base text-white/70 sm:text-lg">
              Activa un plan recurrente o mezcla sabores según la temporada. Nuestro equipo acompaña el ajuste para que nunca más tengas exceso ni faltantes.
            </p>

            {/* Simpler category pills */}
            <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-sm text-white/70">
              {segments.map((segment) => (
                <button
                  key={segment.id}
                  onClick={() => setActiveSegment(segment.id)}
                  className={`rounded-full px-4 py-1.5 transition ${
                    segment.id === activeSegment
                      ? 'bg-white text-slate-900 shadow'
                      : 'hover:text-white/90'
                  }`}
                >
                  {segment.label}
                </button>
              ))}
            </div>

            {/* Compact feature box */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-base font-semibold text-white">{currentSegment.heading}</h3>
              <p className="mt-2 text-sm text-white/60">{currentSegment.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {currentSegment.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => router.push('/plans')}
                className="mt-5 bg-sky-500 text-slate-950 hover:bg-sky-400"
              >
                Configurar mi plan
              </Button>
            </div>
          </div>

          <div className="lg:w-3/5">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[...products, ...products].map((product, idx) => (
                <article
                  key={`${product.id}-${idx}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-sky-400/60"
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {/* Badges hidden per request */}
                  </div>

                  <div className="mt-4 space-y-2.5 text-white">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-white/50">
                      <span>{product.flavor}</span>
                      <span>{product.price}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    {/* Description hidden per request */}
                    <button
                      className="group/cta inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                    >
                      Ver detalles
                      <svg className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
