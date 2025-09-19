import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import LandingLayout from '../../components/landing/LandingLayout';
import Link from 'next/link';

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  content: string;
  imageUrl?: string;
};

interface BlogPostDetailProps {
  post: BlogPost;
}

const formatContent = (content: string) => {
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted
    .split('\n\n')
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join('');
  return formatted;
};

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({ post }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('es-PR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Related posts will be loaded client-side or omitted for now
  const related: BlogPost[] = [];

  return (
    <LandingLayout title={`${post.title} - Blog EWA`} onAccessRedirect={() => {}}>
      <Head>
        <meta name="description" content={post.excerpt} />
      </Head>

      <section className="bg-slate-950 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Link href="/blog" className="text-sky-400 hover:text-sky-300">
              ← Volver al blog
            </Link>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-lg text-white/70">{post.excerpt}</p>
            <div className="mt-6 text-sm text-white/60">
              {formattedDate} • {post.author}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            <img
              src={post.imageUrl || '/images/blog-placeholder.jpg'}
              alt={post.title}
              className="w-full rounded-3xl object-cover"
            />
            <article
              className="prose prose-lg max-w-none text-slate-700"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
            <div className="flex flex-wrap gap-4 border-t border-slate-200 pt-8 text-sm text-slate-500">
              <span>Comparte:</span>
              <a href="#" className="hover:text-sky-500">Twitter</a>
              <a href="#" className="hover:text-sky-500">LinkedIn</a>
              <a href="#" className="hover:text-sky-500">Facebook</a>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl text-center">Quizá también te interese</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {related.map((item) => (
                <article key={item.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <img
                    src={item.imageUrl || '/images/blog-placeholder.jpg'}
                    alt={item.title}
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-500">
                    {new Date(item.date).toLocaleDateString('es-PR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.excerpt}</p>
                  <Link href={`/blog/${item.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-500">
                    Leer más
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </LandingLayout>
  );
};

export const getServerSideProps: GetServerSideProps<BlogPostDetailProps> = async ({ params }) => {
  const slug = params?.slug;
  if (typeof slug !== 'string') return { notFound: true };

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
  if (!appId || !restKey || !serverUrl) return { notFound: true };

  const where = encodeURIComponent(JSON.stringify({ slug }));
  const res = await fetch(`${serverUrl}/classes/BlogPost?limit=1&where=${where}`, {
    headers: {
      'X-Parse-Application-Id': appId,
      'X-Parse-REST-API-Key': restKey,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) return { notFound: true };
  const json = await res.json();
  const p = json.results?.[0];
  if (!p) return { notFound: true };

  const post: BlogPost = {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    author: p.author,
    date: p.date,
    content: p.content,
    imageUrl: p.image?.url || p.imageUrl || undefined,
  };

  return { props: { post } };
};

export default BlogPostDetail;
