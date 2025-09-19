import React from 'react';
import { Button } from '@ewa/ui';

const pillars = [
  'Operamos con energía renovable certificada y recuperamos 95% del agua utilizada en planta.',
  'Cada caja ahorra 450 gramos de plástico de un solo uso frente a botellas convencionales.',
  'Programas de impacto comunitario que instalan estaciones de recarga en escuelas públicas.',
];

const AboutSection: React.FC = () => {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-center">
          <div className="relative">
            <div className="absolute -left-8 top-10 hidden h-24 w-24 rounded-full border border-white/10 bg-sky-500/20 blur-xl lg:block" />
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <img
                  src="/images/landing/about/team-facility.jpeg"
                  alt="Equipo EWA Box Water operando en planta"
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-sm uppercase tracking-[0.3em] text-white/60">
                  Planta certificada B
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <img
                  src="/images/landing/about/process.jpeg"
                  alt="Proceso circular de EWA"
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-sm uppercase tracking-[0.3em] text-white/60">
                  Envase 98% reciclable
                </div>
              </div>
              <div className="col-span-1 sm:col-span-2 rounded-[28px] border border-white/10 bg-gradient-to-r from-sky-500/20 via-cyan-500/10 to-transparent p-8 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Compromiso neto</p>
                <p className="mt-4 text-3xl font-semibold text-white">0% plástico. 100% trazabilidad.</p>
                <p className="mt-3 text-sm text-white/70">
                  Cada lote cuenta con código QR único que permite rastrear la procedencia del agua, tiempo de envasado y huella de carbono compensada.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
              Nuestra misión
            </div>
            <h2 className="mt-8 text-3xl font-semibold text-white sm:text-4xl">
              Tecnología, datos y comunidad para reimaginar el ciclo del agua.
            </h2>
            <p className="mt-4 text-base text-white/85 sm:text-lg">
              Somos una empresa de Puerto Rico que combina innovación científica y logística regenerativa. Cada entrega viene acompañada de métricas claras para tus equipos y reportes ambientales para tus stakeholders.
            </p>
            <ul className="mt-10 space-y-4 text-sm text-white/85">
              {pillars.map((pillar) => (
                <li key={pillar} className="flex items-start gap-3">
                  <svg className="mt-1 h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {pillar}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => window.open('https://instagram.com', '_blank')}
              className="mt-10 bg-white text-slate-900 hover:bg-slate-100"
            >
              Conocer la historia completa
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
