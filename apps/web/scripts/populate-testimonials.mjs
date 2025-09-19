import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  PARSE_APP_ID: ENV_PARSE_APP_ID,
  PARSE_REST_KEY: ENV_PARSE_REST_KEY,
  PARSE_MASTER_KEY: ENV_PARSE_MASTER_KEY,
  PARSE_SERVER_URL: ENV_PARSE_SERVER_URL,
  NEXT_PUBLIC_BACK4APP_APPLICATION_ID,
  NEXT_PUBLIC_BACK4APP_REST_API_KEY,
  BACK4APP_MASTER_KEY,
  BACK4APP_SERVER_URL,
} = process.env;

const PARSE_APP_ID = ENV_PARSE_APP_ID || NEXT_PUBLIC_BACK4APP_APPLICATION_ID;
const PARSE_REST_KEY = ENV_PARSE_REST_KEY || NEXT_PUBLIC_BACK4APP_REST_API_KEY;
const PARSE_MASTER_KEY = ENV_PARSE_MASTER_KEY || BACK4APP_MASTER_KEY;
const PARSE_SERVER_URL = (ENV_PARSE_SERVER_URL || BACK4APP_SERVER_URL || '').replace(/\/$/, '');

if (!PARSE_APP_ID || !PARSE_REST_KEY || !PARSE_SERVER_URL) {
  console.error('Missing Parse env. Need PARSE_APP_ID, PARSE_REST_KEY, PARSE_SERVER_URL');
  process.exit(1);
}

const fetchFn = globalThis.fetch ?? (await import('node-fetch')).default;

const headers = {
  'X-Parse-Application-Id': PARSE_APP_ID,
  'X-Parse-REST-API-Key': PARSE_REST_KEY,
};
if (PARSE_MASTER_KEY) headers['X-Parse-Master-Key'] = PARSE_MASTER_KEY;

async function ensureBlogSchema() {
  if (!PARSE_MASTER_KEY) return;
  const payload = {
    className: 'BlogPost',
    fields: {
      slug: { type: 'String' },
      title: { type: 'String' },
      excerpt: { type: 'String' },
      author: { type: 'String' },
      date: { type: 'String' },
      content: { type: 'String' },
      imageUrl: { type: 'String' },
      category: { type: 'String' },
    },
  };
  const res = await fetchFn(`${PARSE_SERVER_URL}/schemas/BlogPost`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (body.code === 103) {
      // class exists, ensure fields
      await fetchFn(`${PARSE_SERVER_URL}/schemas/BlogPost`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
      return;
    }
  }
}

async function findBySlug(slug) {
  const where = encodeURIComponent(JSON.stringify({ slug }));
  const res = await fetchFn(`${PARSE_SERVER_URL}/classes/BlogPost?limit=1&where=${where}` , { headers });
  if (!res.ok) return null;
  const json = await res.json().catch(() => ({}));
  return json.results?.[0] ?? null;
}

async function upsert(post) {
  const existing = await findBySlug(post.slug);
  const url = existing
    ? `${PARSE_SERVER_URL}/classes/BlogPost/${existing.objectId}`
    : `${PARSE_SERVER_URL}/classes/BlogPost`;
  const method = existing ? 'PUT' : 'POST';
  const res = await fetchFn(url, {
    method,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`${method} ${post.slug} failed: ${res.status} ${t}`);
  }
}

async function main() {
  await ensureBlogSchema();
  const today = new Date().toISOString().slice(0,10);
  const posts = [
    {
      slug: 'testimonio-hotel-isla-azul',
      title: 'Hotel Isla Azul: experiencia premium sin plástico',
      excerpt: 'Sustituyeron botellas PET por cápsulas personalizadas y reportes ESG mensuales.',
      author: 'Equipo EWA',
      date: today,
      content: 'Caso real: Hotel Isla Azul integró EWA con cápsulas de 250 ml y reportes ESG. **Resultados**: menos plástico y mejor experiencia huésped.',
      imageUrl: '/images/landing/products/product-1.jpeg',
      category: 'client-testimonials',
    },
    {
      slug: 'testimonio-synapse-labs',
      title: 'Synapse Labs: reposiciones automáticas y 64% menos plástico',
      excerpt: 'Automatizaron reposiciones usando cajas inteligentes y alertas.',
      author: 'Equipo EWA',
      date: today,
      content: 'Caso real: Synapse Labs conectó lockers y alertas de consumo. **Impacto**: 64% de reducción en PET y cero quiebres de stock.',
      imageUrl: '/images/products/500ml/5.png',
      category: 'client-testimonials',
    },
    {
      slug: 'testimonio-colab-hub',
      title: 'CoLab Hub: hidratación 24/7 con lockers inteligentes',
      excerpt: 'Coworking con lockers y métricas de consumo por equipo.',
      author: 'Equipo EWA',
      date: today,
      content: 'Caso real: CoLab Hub implementó lockers 24/7 y métricas por área. **Beneficio**: reposiciones precisas y menos residuos.',
      imageUrl: '/images/products/250ml/4.png',
      category: 'client-testimonials',
    },
    {
      slug: 'testimonio-verde-logistics',
      title: 'Verde Logistics: rutas sin plástico y datos en tiempo real',
      excerpt: 'Rutas de campo equipadas con botellas y dashboards predictivos.',
      author: 'Equipo EWA',
      date: today,
      content: 'Caso real: Verde Logistics abasteció flotas con EWA y dashboards. **Resultado**: hidratación constante y menos paradas.',
      imageUrl: '/images/products/1000ml/6.png',
      category: 'client-testimonials',
    },
    {
      slug: 'testimonio-isla-detox-spa',
      title: 'Isla Detox Spa: wellness con envases reutilizables',
      excerpt: 'Plan Growth con botellas alcalinas de 1000 ml y experiencias wellness.',
      author: 'Equipo EWA',
      date: today,
      content: 'Caso real: Isla Detox Spa combinó EWA y experiencias wellness. **Efecto**: imagen de marca y reducción de residuos.',
      imageUrl: '/images/products/1000ml/5.png',
      category: 'client-testimonials',
    },
    {
      slug: 'testimonio-gimnasio-prisma',
      title: 'Gimnasio Prisma: hidratación post-workout sin PET',
      excerpt: 'Plan Lite con envases reutilizables y análisis de consumo.',
      author: 'Equipo EWA',
      date: today,
      content: 'Caso real: Gimnasio Prisma adoptó Plan Lite y analítica. **Logro**: adherencia y menos residuos.',
      imageUrl: '/images/products/500ml/6.png',
      category: 'client-testimonials',
    },
  ];

  for (const p of posts) {
    console.log(`Upserting ${p.slug}...`);
    await upsert(p);
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


