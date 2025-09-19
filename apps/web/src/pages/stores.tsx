import React from 'react';
import Head from 'next/head';
import LandingLayout from '../components/landing/LandingLayout';
import { Button } from '@ewa/ui';

const storeLocations = [
  {
    name: 'San Juan Hub',
    description: 'Centro logístico principal, pick-up habilitado y soporte técnico para clientes corporativos.',
    address: 'Calle Loíza 123, San Juan, PR 00911',
    hours: 'Lunes a sábado · 8:00am – 6:00pm',
    contact: '(787) 555-0101',
  },
  {
    name: 'Condado Experience Store',
    description: 'Showroom con degustaciones, merchandising y configuraciones de planes circulares.',
    address: 'Avenida Ashford 456, San Juan, PR 00907',
    hours: 'Todos los días · 10:00am – 8:00pm',
    contact: '(787) 555-0112',
  },
  {
    name: 'Ponce Fulfillment',
    description: 'Punto de distribución para el sur de Puerto Rico, con lockers 24/7 y soporte en sitio.',
    address: 'Carr. PR-2 Km. 223, Ponce, PR 00717',
    hours: 'Lunes a viernes · 9:00am – 5:00pm',
    contact: '(787) 555-0145',
  },
  {
    name: 'Mayagüez Pickup Point',
    description: 'Ideal para negocios del oeste que buscan reposiciones rápidas y configuración de cajas.',
    address: 'Calle Mendez Vigo 789, Mayagüez, PR 00680',
    hours: 'Martes a sábado · 9:00am – 5:00pm',
    contact: '(787) 555-0168',
  },
];

const StoresPage: React.FC = () => {
  return (
    <LandingLayout title="Encuentra EWA" onAccessRedirect={() => {}}>
      <Head>
        <meta
          name="description"
          content="Ubica nuestros hubs de entrega y showrooms en Puerto Rico, agenda visitas y recoge tus pedidos circulares."
        />
      </Head>

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-20 top-12 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-24 text-center lg:text-left lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Puntos EWA</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Más de 4 hubs circulares para recoger, reusar y reponerte cuando lo necesites
            </h1>
            <p className="mt-6 text-lg text-white/70 sm:text-xl">
              Cada ubicación cuenta con lockers inteligentes, soporte humano y área de recarga para botellones retornables. Agenda tu visita o coordina pick-up sin filas.
            </p>
          </div>
          <div className="mt-12 w-full max-w-md lg:mt-0">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_40px_80px_-32px_rgba(59,130,246,0.35)]">
              <img
                src="/images/landing/hero/image1.jpeg"
                alt="Centro logístico EWA"
                className="aspect-[4/5] w-full rounded-[24px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="lg:w-2/3 space-y-6">
              {storeLocations.map((store) => (
                <article key={store.name} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">{store.name}</h2>
                      <p className="mt-2 text-sm text-slate-600">{store.description}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      <p className="font-semibold text-slate-700">{store.hours}</p>
                      <p className="mt-1">{store.contact}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p>{store.address}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-500"
                    >
                      Ver en mapa
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <Button
                      onClick={() => window.location.href = 'mailto:hola@ewa.com'}
                      className="bg-sky-500 text-white hover:bg-sky-400"
                    >
                      Agendar pick-up
                    </Button>
                  </div>
                </article>
              ))}
            </div>
            <aside className="lg:w-1/3">
              <div className="sticky top-24 rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <h3 className="text-lg font-semibold text-slate-900">¿Necesitas otro punto EWA?</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Estamos expandiendo lockers y pop-ups en centros comerciales y coworkings. Escríbenos para evaluar tu zona.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <svg className="mt-1 h-4 w-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lockers 24/7 con QR y sensores de temperatura.
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="mt-1 h-4 w-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Talleres para capacitar equipos de housekeeping y facilities.
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="mt-1 h-4 w-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Reportes ambientales listos para tus stakeholders cada trimestre.
                  </li>
                </ul>
                <Button
                  onClick={() => window.location.href = 'mailto:hola@ewa.com'}
                  className="mt-6 w-full bg-slate-900 text-white hover:bg-slate-800"
                >
                  Contáctanos
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default StoresPage;
