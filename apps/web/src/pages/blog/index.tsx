import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import LandingLayout from '../../components/landing/LandingLayout';
import { Button } from '@ewa/ui';

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  content: string;
  imageUrl?: string;
};

interface BlogIndexProps {
  posts: BlogPost[];
}

const BlogIndex: React.FC<BlogIndexProps> = ({ posts }) => {
  const formattedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const [featured, ...rest] = formattedPosts;

  return (
    <LandingLayout title="Blog EWA" onAccessRedirect={() => {}}>
      <Head>
        <meta
          name="description"
          content="Historias, casos de éxito y guías de hidratación circular directamente desde el equipo de EWA."
        />
      </Head>

      {featured && (
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0">
            <div className="absolute -right-24 top-12 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
          </div>
          <div className="relative container mx-auto flex flex-col gap-12 px-4 py-24 lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Destacado</p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">{featured.title}</h1>
              <p className="mt-6 max-w-xl text-lg text-white/70 sm:text-xl">{featured.excerpt}</p>
              <div className="mt-6 text-sm text-white/60">
                {new Date(featured.date).toLocaleDateString('es-PR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                • {featured.author}
              </div>
              <Link
                href={`/blog/${featured.slug}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-400"
              >
                Leer artículo completo
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_40px_80px_-32px_rgba(59,130,246,0.35)]">
                <div className="aspect-[4/5] overflow-hidden rounded-[24px]">
                  <img
                    src={featured.imageUrl || '/images/blog-placeholder.jpg'}
                    alt={featured.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Últimos artículos</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_60px_-40px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-24px_rgba(56,189,248,0.35)]"
              >
                <div className="overflow-hidden">
                  <img
                    src={post.imageUrl || '/images/blog-placeholder.jpg'}
                    alt={post.title}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {new Date(post.date).toLocaleDateString('es-PR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{post.title}</h3>
                  <p className="text-sm text-slate-600">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between text-sm text-slate-500">
                    <span>{post.author}</span>
                    <Link href={`/blog/${post.slug}`} className="text-sky-600 font-semibold hover:text-sky-500">
                      Leer más →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Recibe nuevas historias</h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Consejos de hidratación, casos de éxito y lanzamientos directo en tu bandeja de entrada.
          </p>
          <div className="mt-8 mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="tu@empresa.com"
              className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
            <Button className="rounded-full bg-sky-500 text-slate-900 hover:bg-sky-400">Suscribirme</Button>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export const getServerSideProps: GetServerSideProps<BlogIndexProps> = async () => {
  const {
    PARSE_APP_ID,
    PARSE_REST_KEY,
    PARSE_SERVER_URL,
    NEXT_PUBLIC_BACK4APP_APPLICATION_ID,
    NEXT_PUBLIC_BACK4APP_REST_API_KEY,
    BACK4APP_SERVER_URL,
  } = process.env as Record<string, string | undefined>;

  const appId = PARSE_APP_ID || NEXT_PUBLIC_BACK4APP_APPLICATION_ID;
  const restKey = PARSE_REST_KEY || NEXT_PUBLIC_BACK4APP_REST_API_KEY;
  const serverUrl = (PARSE_SERVER_URL || BACK4APP_SERVER_URL || '').replace(/\/$/, '');

  if (!appId || !restKey || !serverUrl) {
    return { props: { posts: [] } };
  }

  const res = await fetch(`${serverUrl}/classes/BlogPost?order=-date&limit=50`, {
    headers: {
      'X-Parse-Application-Id': appId,
      'X-Parse-REST-API-Key': restKey,
      'Content-Type': 'application/json',
    },
  });

  const json = await res.json().catch(() => ({ results: [] }));
  const posts: BlogPost[] = (json.results || []).map((p: any) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    author: p.author,
    date: p.date,
    content: p.content,
    imageUrl: p.image?.url || p.imageUrl || undefined,
  }));

  return { props: { posts } };
};

export default BlogIndex;
