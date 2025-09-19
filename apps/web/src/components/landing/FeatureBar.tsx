import React from 'react';

const features = [
  {
    title: 'Minerales calibrados',
    description: 'Mezclas diseñadas por especialistas para activar energía sostenida sin azúcares añadidos.',
    icon: (
      <svg className="h-10 w-10 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: 'Entrega inteligente',
    description: 'Rutas dinámicas con cero emisiones para que tus cajas lleguen cuando más las necesitas.',
    icon: (
      <svg className="h-10 w-10 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h10a4 4 0 004-4V9a4 4 0 00-4-4h-1.586a1 1 0 01-.707-.293l-1.828-1.828A1 1 0 0012.172 3H7a4 4 0 00-4 4v8z" />
      </svg>
    ),
  },
  {
    title: 'Packaging 98% reciclable',
    description: 'Diseñado para circular de nuevo: materiales certificados FSC y tintas a base de agua.',
    icon: (
      <svg className="h-10 w-10 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6a1 1 0 001 1h6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 20v-6a1 1 0 00-1-1h-6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l7 7-7 7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 20l-7-7 7-7" />
      </svg>
    ),
  },
  {
    title: 'Soporte humano 24/7',
    description: 'Un equipo especialista te acompaña para ajustar volúmenes, resolver dudas y optimizar recursos.',
    icon: (
      <svg className="h-10 w-10 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 11c0 3.866-3.582 7-8 7a8.76 8.76 0 01-4-.94L4 18l.53-2.12A6.992 6.992 0 016 11c0-3.866 3.582-7 8-7s8 3.134 8 7z" />
      </svg>
    ),
  },
];

const FeatureBar: React.FC = () => {
  return (
    <section className="relative -mt-16 bg-slate-950 pb-12">
      <div className="container mx-auto px-4">
        <div className="relative z-10 grid gap-6 rounded-[32px] border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-[0_40px_80px_-24px_rgba(14,116,144,0.35)] lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-4 rounded-2xl bg-white/5 p-6 transition hover:bg-white/10">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/60">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-0 h-20 rounded-full bg-gradient-to-r from-sky-500/20 via-teal-500/10 to-transparent blur-3xl" />
    </section>
  );
};

export default FeatureBar;
