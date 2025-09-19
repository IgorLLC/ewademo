import React from 'react';
import Head from 'next/head';
import LandingLayout from '../../components/landing/LandingLayout';
import { Button } from '@ewa/ui';
import { products } from '../../data/products';

const ProductsIndex: React.FC = () => {
  return (
    <LandingLayout title="Catálogo EWA" onAccessRedirect={() => {}}>
      <Head>
        <meta name="description" content="Explora la línea completa de productos EWA, desde botellas individuales hasta cajas inteligentes." />
      </Head>

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-sky-500/30 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Catálogo oficial</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Hidratación EWA para cada contexto
          </h1>
          <p className="mt-6 text-lg text-white/70 sm:text-xl">
            Selecciona el formato que mejor se adapta a tu operación y configura entregas inteligentes con nuestro equipo.
          </p>
          <div className="mt-8 inline-flex gap-3">
            <Button
              size="lg"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="bg-sky-500 text-slate-900 hover:bg-sky-400"
            >
              Ver productos
            </Button>
            <button
              onClick={() => window.location.href = 'mailto:hola@ewa.com'}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-sky-400 hover:text-white"
            >
              Agenda un demo
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.slug}
                className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_40px_80px_-40px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:shadow-[0_40px_80px_-20px_rgba(56,189,248,0.35)]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.heroImage.src}
                    alt={product.heroImage.alt}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                  <span className="absolute left-5 top-5 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">
                    {product.volumeLabel}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{product.name}</h2>
                    <p className="mt-2 text-sm text-slate-500">{product.shortDescription}</p>
                    {typeof product.unitPrice === 'number' && (
                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        Desde ${product.unitPrice.toFixed(2)} por unidad
                      </p>
                    )}
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {product.highlights.slice(0, 2).map((highlight) => (
                      <li key={highlight.title} className="flex items-start gap-2">
                        <svg className="mt-1 h-4 w-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {highlight.title}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <a
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-500"
                    >
                      Ver detalles
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default ProductsIndex;
