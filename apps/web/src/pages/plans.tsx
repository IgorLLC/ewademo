import React from 'react';
import Head from 'next/head';
import LandingLayout from '../components/landing/LandingLayout';
import { Button } from '@ewa/ui';
import { products } from '../data/products';

const tieredPlans = [
  {
    id: 'ewa-lite',
    title: 'EWA Lite',
    description: 'Ideal para estudios, Airbnbs o gimnasios boutique que necesitan reposiciones pequeñas.',
    frequency: 'Entrega quincenal',
    volume: 'Hasta 48 botellas (250 ml + 500 ml)',
    price: '$149 / mes',
    discount: 'Ahorra 18% vs compras individuales',
    features: [
      'Caja inteligente con QR y monitoreo básico',
      'Soporte en horario comercial',
      'Reporte mensual de plástico evitado',
    ],
    productSlugs: ['250ml', '500ml'],
  },
  {
    id: 'ewa-growth',
    title: 'EWA Growth',
    description: 'Nuestro plan más popular para oficinas medianas, hospitality y coworkings.',
    frequency: 'Entrega semanal',
    volume: 'Hasta 120 botellas + 12 cajas reutilizables',
    price: '$349 / mes',
    discount: 'Ahorra 26% y recibe logística prioritaria',
    features: [
      'Dashboard en tiempo real con alertas predictivas',
      'Pick-ups ilimitados de cajas y botellones',
      'Integración con calendarios logísticos y Slack',
    ],
    productSlugs: ['250ml', '500ml', '1000ml', 'caja'],
    highlighted: true,
  },
  {
    id: 'ewa-enterprise',
    title: 'EWA Enterprise',
    description: 'Para cadenas hoteleras, residencias estudiantiles o corporativos multi-sede.',
    frequency: 'Entrega personalizada',
    volume: 'Desde 300 botellas + lockers satélite',
    price: 'Cotización a medida',
    discount: 'Incluye consultoría ESG y métricas trimestrales',
    features: [
      'SLA 24/7 y soporte en sitio',
      'Integración API para inventario y facturación',
      'Lockers inteligentes con sensores de temperatura',
    ],
    productSlugs: ['250ml', '500ml', '1000ml', 'caja'],
  },
];

const PlansPage: React.FC = () => {
  return (
    <LandingLayout title="Planes de Suscripción" onAccessRedirect={() => {}}>
      <Head>
        <meta
          name="description"
          content="Selecciona el plan EWA que mejor se adapte a tu operación y activa la logística circular con Stripe."
        />
      </Head>

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-24 top-12 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-24 text-center lg:text-left lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Planes EWA</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Suscripciones que combinan hidratación premium y logística sin fricción
            </h1>
            <p className="mt-6 text-lg text-white/70 sm:text-xl">
              Selecciona un nivel, ajusta consumos en nuestro dashboard y activa pagos recurrentes con Stripe Billing. Nos ocupamos de las entregas, retornos y métricas ambientales.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => document.getElementById('plan-cards')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-sky-500 text-slate-900 hover:bg-sky-400"
              >
                Ver planes
              </Button>
              <button
                onClick={() => window.location.href = 'mailto:hola@ewa.com'}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-sky-400 hover:text-white"
              >
                Cotización a medida
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-12 w-full max-w-md lg:mt-0">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_40px_80px_-32px_rgba(59,130,246,0.35)]">
              <img
                src="/images/landing/products/product-2.jpeg"
                alt="Botellas EWA en exhibición"
                className="aspect-[4/5] w-full rounded-[24px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="plan-cards" className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {tieredPlans.map((plan) => (
              <article
                key={plan.id}
                className={`group flex h-full flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:shadow-[0_40px_80px_-20px_rgba(56,189,248,0.35)] ${plan.highlighted ? 'ring-2 ring-sky-500' : ''}`}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-slate-900">{plan.title}</h2>
                  <p className="mt-3 text-sm text-slate-600">{plan.description}</p>
                  <div className="mt-6 space-y-2 text-sm text-slate-500">
                    <p><span className="font-semibold text-slate-900">{plan.frequency}</span></p>
                    <p>{plan.volume}</p>
                    <p className="font-semibold text-slate-900">{plan.price}</p>
                    <p className="text-sky-600 font-medium">{plan.discount}</p>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <svg className="mt-1 h-4 w-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto border-t border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Formatos incluidos</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {plan.productSlugs.map((slug) => {
                      const product = products.find((item) => item.slug === slug);
                      return (
                        <span
                          key={slug}
                          className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow"
                        >
                          {product?.name || slug}
                        </span>
                      );
                    })}
                  </div>
                  <Button
                    onClick={() => window.location.href = 'mailto:hola@ewa.com'}
                    className={`mt-6 w-full ${plan.highlighted ? 'bg-sky-500 text-white hover:bg-sky-400' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    Solicitar demo
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </LandingLayout>
  );
};

export default PlansPage;
