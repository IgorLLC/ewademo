import React from 'react';

export type TestimonialPost = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  brand?: string;
  description?: string;
};

interface TestimonialSectionProps {
  posts: TestimonialPost[];
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ posts }) => {
  return (
    <section className="relative bg-white py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.08),_transparent)]" />
      <div className="relative container mx-auto px-4">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-5 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              historias reales
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Partners que transforman su hidratación con EWA
            </h2>
            <p className="text-sm text-slate-600 sm:text-base">
              De hoteles boutique a centros logísticos, nuestras soluciones circulares se adaptan a cada operación. Explora cómo combinan reportes ESG, lockers inteligentes y cajas reutilizables.
            </p>
          </div>
          <a
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-500"
          >
            Ver todas las historias
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="mt-12 columns-1 gap-6 md:columns-2 xl:columns-3 [column-fill:_balance]">
          {posts.map((item) => (
            <a
              key={item.slug}
              href={`/blog/${item.slug}`}
              className={`group mb-6 block break-inside-avoid rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_60px_-40px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-28px_rgba(56,189,248,0.45)]`}
            >
              <div className="relative overflow-hidden rounded-[28px]">
                <img
                  src={item.imageUrl || '/images/blog-placeholder.jpg'}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">
                    {item.title}
                  </div>
                  {item.excerpt && (
                    <p className="mt-3 text-sm text-white/90 opacity-0 transition group-hover:opacity-100">
                      {item.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
