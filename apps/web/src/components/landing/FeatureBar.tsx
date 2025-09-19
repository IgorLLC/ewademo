import React from 'react';
import { Beaker, Truck, Recycle, Headphones } from 'lucide-react';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const features: { title: string; description: string; Icon: IconType }[] = [
  {
    title: 'Minerales calibrados',
    description:
      'Mezclas diseñadas por especialistas para activar energía sostenida sin azúcares añadidos.',
    Icon: Beaker,
  },
  {
    title: 'Entrega inteligente',
    description:
      'Rutas dinámicas con cero emisiones para que tus cajas lleguen cuando más las necesitas.',
    Icon: Truck,
  },
  {
    title: 'Packaging 98% reciclable',
    description:
      'Diseñado para circular de nuevo: materiales certificados FSC y tintas a base de agua.',
    Icon: Recycle,
  },
  {
    title: 'Soporte humano 24/7',
    description:
      'Un equipo especialista te acompaña para ajustar volúmenes, resolver dudas y optimizar recursos.',
    Icon: Headphones,
  },
];

const FeatureBar: React.FC = () => {
  return (
    <section className="relative -mt-16 bg-slate-950 pb-12">
      <div className="container mx-auto px-4">
        <div className="relative z-10 grid gap-6 rounded-[32px] border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-[0_40px_80px_-24px_rgba(14,116,144,0.35)] lg:grid-cols-4">
          {features.map(({ title, description, Icon }) => (
            <div key={title} className="flex flex-col gap-4 rounded-2xl bg-white/5 p-6 transition hover:bg-white/10">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <Icon className="h-6 w-6 text-sky-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-white/60">{description}</p>
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
