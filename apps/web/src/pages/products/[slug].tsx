import React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { findProductBySlug, productSlugs, ProductDetail } from '../../data/products';
import LandingLayout from '../../components/landing/LandingLayout';
import { Button } from '@ewa/ui';

interface ProductPageProps {
  product: ProductDetail;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const router = useRouter();

  const handlePlanRedirect = () => {
    router.push('/plans');
  };

  const handleContactRedirect = () => {
    if (typeof window !== 'undefined') {
      window.open('mailto:hola@ewa.com', '_blank');
    }
  };

  return (
    <LandingLayout
      title={`${product.name} - Catálogo EWA`}
      onAccessRedirect={handlePlanRedirect}
    >
      <Head>
        <meta name="description" content={product.shortDescription} />
      </Head>

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>
        <div className="relative">
          <div className="container mx-auto flex flex-col gap-12 px-4 py-24 lg:flex-row lg:items-center">
            <div className="lg:w-1/2">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_40px_80px_-32px_rgba(56,189,248,0.35)]">
                <div className="aspect-[3/4] overflow-hidden rounded-[28px]">
                  <img
                    src={product.heroImage.src}
                    alt={product.heroImage.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Formato {product.volumeLabel}
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-white/70 sm:text-xl">{product.shortDescription}</p>
              <p className="mt-6 text-sm text-white/60">{product.description}</p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={handlePlanRedirect}
                  className="bg-sky-500 text-slate-900 hover:bg-sky-400"
                >
                  Configurar suscripción
                </Button>
                <button
                  onClick={handleContactRedirect}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-sky-400 hover:text-white"
                >
                  Hablar con ventas
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <dl className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <dt className="text-xs uppercase tracking-[0.3em] text-white/50">Volumen</dt>
                  <dd className="mt-2 text-xl font-semibold text-white">{product.volumeLabel}</dd>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <dt className="text-xs uppercase tracking-[0.3em] text-white/50">Servings sugeridos</dt>
                  <dd className="mt-2 text-xl font-semibold text-white">{product.servings}</dd>
                </div>
                {typeof product.unitPrice === 'number' && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <dt className="text-xs uppercase tracking-[0.3em] text-white/50">Precio unitario sugerido</dt>
                    <dd className="mt-2 text-xl font-semibold text-white">
                      ${product.unitPrice.toFixed(2)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Galería</h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">Explora el producto en diferentes contextos y aplicaciones.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {product.gallery.map((image) => (
              <div key={image.src} className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
                <img src={image.src} alt={image.alt} className="h-64 w-full object-cover transition duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-24 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">Lo que hace único a este formato</h2>
              <div className="mt-8 space-y-5">
                {product.highlights.map((highlight) => (
                  <div key={highlight.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-xl font-semibold text-white">{highlight.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
                <h3 className="text-lg font-semibold text-white">Impacto sustentable</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  {product.sustainability.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="mt-0.5 h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
                  <p>
                    ¿Quieres un piloto personalizado? Nuestro equipo te ayuda a definir consumos, logística y reportes de impacto para este formato.
                  </p>
                  <button
                    onClick={handleContactRedirect}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Agendar workshop
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = productSlugs.map((slug) => ({ params: { slug } }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ProductPageProps> = async ({ params }) => {
  const slug = params?.slug;
  if (typeof slug !== 'string') {
    return { notFound: true };
  }

  const product = findProductBySlug(slug);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductPage;
