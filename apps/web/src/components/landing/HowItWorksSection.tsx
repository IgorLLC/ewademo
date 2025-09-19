import React from 'react';
import { Button } from '@ewa/ui';

const steps = [
  {
    title: 'Configura tus consumos',
    description:
      'Selecciona paquetes, frecuencias y destinos. Nuestro algoritmo recomienda volúmenes basados en el tamaño de tu equipo.',
  },
  {
    title: 'Recibe, escanea y disfruta',
    description:
      'Cada caja llega con QR para registrar entregas y habilitar recordatorios automáticos. Integramos con tu calendario o Slack.',
  },
  {
    title: 'Mide el impacto en un panel',
    description:
      'Visualiza ahorros de plástico, hidratación promedio por persona y métricas de bienestar en tiempo real.',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Cómo funciona
            </div>
            <h2 className="mt-8 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Tres pasos para transformar tu hidratación en un modelo circular.
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Sin contratos rígidos ni complicaciones. Ajusta en minutos y recibe insights accionables desde el primer mes.
            </p>

            <div className="mt-10 space-y-6">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-base font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => window.open('mailto:hola@ewa.com', '_blank')}
              className="mt-10 bg-sky-500 text-white hover:bg-sky-400"
            >
              Agendar demo virtual
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -right-6 top-14 h-20 w-20 rounded-full bg-sky-400/30 blur-xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-sky-100/30">
              <div className="grid gap-0 sm:grid-cols-2">
                <div className="relative h-80">
                  <img
                    src="/images/landing/hero/hero-background.jpeg"
                    alt="Ruta de entrega inteligente de EWA"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900">
                    Ruta con cero emisiones
                  </div>
                </div>
                <div className="flex flex-col gap-6 p-8">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Impacto estimado</p>
                    <p className="mt-3 text-4xl font-semibold text-slate-900">-1.2T</p>
                    <p className="mt-1 text-sm text-slate-500">CO₂ evitado por cliente al año</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Reposición sugerida</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-500">24</div>
                      <div>
                        <p className="text-base font-semibold text-slate-900">Cajas cada 10 días</p>
                        <p className="text-xs text-slate-500">Basado en consumo promedio de 85 personas.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Integraciones</p>
                    <p className="mt-2 text-sm text-slate-600">Disponible en Slack, Teams y Google Calendar para recordatorios automáticos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
