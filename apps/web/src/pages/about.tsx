import React from 'react';
import Head from 'next/head';
import LandingLayout from '../components/landing/LandingLayout';
import AboutSection from '../components/landing/AboutSection';
import { CTASection } from '../components/landing';

const milestones = [
  {
    year: '2021',
    title: 'EWA nace en Puerto Rico',
    description:
      'Comenzamos con un piloto en San Juan, entregando agua embotellada en aluminio a 12 clientes corporativos que buscaban eliminar el plástico de sus operaciones.',
  },
  {
    year: '2022',
    title: 'Lanzamos la caja inteligente',
    description:
      'Desarrollamos la caja reusable con código QR para rastreo y logramos reducir 18K botellas plásticas al mes junto a nuestros primeros aliados logísticos.',
  },
  {
    year: '2023',
    title: 'Expansión a hospitalidad',
    description:
      'Hoteles y espacios de hospitality adoptaron los formatos de 250 ml y 1000 ml personalizables, integrando reportes de impacto en sus métricas ESG.',
  },
  {
    year: '2024',
    title: 'Integración completa de datos',
    description:
      'El dashboard en tiempo real permite a los clientes ajustar entregas, monitorear consumo y medir las emisiones evitadas en cada sucursal.',
  },
];

const values = [
  {
    title: 'Circularidad primero',
    description: 'Cada producto nace con un ciclo de retorno definido y métricas claras de reutilización.',
  },
  {
    title: 'Datos accionables',
    description: 'Transformamos consumos en recomendaciones y alertas predictivas para evitar desperdicios.',
  },
  {
    title: 'Compromiso local',
    description: 'Operamos desde Puerto Rico, trabajando con productores y centros logísticos de la región.',
  },
  {
    title: 'Impacto medible',
    description: 'Compartimos reportes ESG listos para auditorías con cada cliente corporativo.',
  },
];

const AboutPage: React.FC = () => {
  return (
    <LandingLayout title="Conoce a EWA" onAccessRedirect={() => {}}>
      <Head>
        <meta
          name="description"
          content="Somos un equipo de Puerto Rico enfocado en hidratar sin plástico, combinando logística circular y datos en tiempo real."
        />
      </Head>

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-32 top-16 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute -left-28 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-24 text-center lg:text-left lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Nuestra misión</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Hidratamos Puerto Rico con logística circular y experiencias premium
            </h1>
            <p className="mt-6 text-lg text-white/70 sm:text-xl">
              Desde 2021 reducimos plásticos de un solo uso junto a empresas, hoteles y gimnasios. Nuestro equipo construye una cadena de suministro inteligente, medible y humana.
            </p>
          </div>
          <div className="mt-12 w-full max-w-md lg:mt-0">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_40px_80px_-32px_rgba(56,189,248,0.35)]">
              <img
                src="/images/landing/about/team-facility.jpeg"
                alt="Equipo de logística EWA"
                className="aspect-[4/5] w-full rounded-[24px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Nuestra historia</h2>
          <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
            Crecemos de la mano de comunidades locales, documentando cada paso para garantizar transparencia y replicabilidad.
          </p>
          <div className="mt-12 space-y-8 border-l-2 border-slate-200 pl-8">
            {milestones.map((item) => (
              <div key={item.year} className="relative">
                <span className="absolute -left-[46px] top-0 flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
                  {item.year}
                </span>
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Lo que nos mueve</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{value.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </LandingLayout>
  );
};

export default AboutPage;
