// Script para sincronizar los productos del sitio con un backend Parse.
// Requiere variables de entorno: PARSE_APP_ID, PARSE_REST_KEY, PARSE_SERVER_URL (y opcionalmente PARSE_MASTER_KEY).
// Si tu versión de Node.js no tiene fetch nativo, instala node-fetch (`npm install node-fetch`) antes de ejecutar.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');
const publicDir = path.join(webRoot, 'public');

const productsPath = path.join(webRoot, 'src', 'data', 'products.json');
const products = JSON.parse(await readFile(productsPath, 'utf-8'));

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
const PARSE_SERVER_URL = ENV_PARSE_SERVER_URL || BACK4APP_SERVER_URL;

if (!PARSE_APP_ID || !PARSE_REST_KEY || !PARSE_SERVER_URL) {
  console.error('Missing Parse environment variables. Please set PARSE_APP_ID, PARSE_REST_KEY and PARSE_SERVER_URL.');
  process.exit(1);
}

const fetchFn = globalThis.fetch ?? (await import('node-fetch')).default;

const serverUrl = PARSE_SERVER_URL.replace(/\/$/, '');
const headers = {
  'X-Parse-Application-Id': PARSE_APP_ID,
  'X-Parse-REST-API-Key': PARSE_REST_KEY,
};

if (PARSE_MASTER_KEY) {
  headers['X-Parse-Master-Key'] = PARSE_MASTER_KEY;
}

async function uploadFile(localPath) {
  let absolute;
  if (typeof localPath === 'string' && localPath.startsWith('/')) {
    absolute = path.join(publicDir, localPath.slice(1));
  } else if (path.isAbsolute(localPath)) {
    absolute = localPath;
  } else {
    absolute = path.join(publicDir, localPath);
  }

  const data = await readFile(absolute);
  const fileName = path.basename(localPath);
  const response = await fetchFn(`${serverUrl}/files/${encodeURIComponent(fileName)}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/octet-stream',
    },
    body: data,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to upload file ${fileName}: ${response.status} ${text}`);
  }

  const uploaded = await response.json();
  return {
    filePointer: { __type: 'File', name: uploaded.name, url: uploaded.url },
    simple: { name: uploaded.name, url: uploaded.url },
  };
}

async function ensureSchema() {
  if (!PARSE_MASTER_KEY) {
    console.warn('Skipping schema creation because PARSE_MASTER_KEY is not set.');
    return;
  }

  // Try to create class with desired fields
  const createPayload = {
    className: 'Product',
    fields: {
      slug: { type: 'String' },
      name: { type: 'String' },
      shortDescription: { type: 'String' },
      description: { type: 'String' },
      volumeLabel: { type: 'String' },
      servings: { type: 'String' },
      heroImage: { type: 'File' },
      heroImageFile: { type: 'File' },
      gallery: { type: 'Array' },
      galleryFiles: { type: 'Array' },
      highlights: { type: 'Array' },
      sustainability: { type: 'Array' },
    },
  };

  const createRes = await fetchFn(`${serverUrl}/schemas/Product`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (createRes.ok) return;

  const errorBody = await createRes.json().catch(() => ({}));
  if (errorBody.code !== 103) {
    if (createRes.status === 403) {
      console.warn('Skipping schema creation due to insufficient permissions (master key required). Proceeding...');
      return;
    }
    throw new Error(`Failed to ensure Product schema: ${createRes.status} ${JSON.stringify(errorBody)}`);
  }

  // Class exists. Ensure heroImage is File
  const getRes = await fetchFn(`${serverUrl}/schemas/Product`, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
  if (!getRes.ok) {
    const t = await getRes.text().catch(() => '');
    console.warn(`Could not fetch Product schema (non-fatal): ${getRes.status} ${t}`);
    return;
  }
  const current = await getRes.json();
  const currentType = current?.fields?.heroImage?.type;
  if (currentType === 'File') return;

  // Delete existing heroImage field (requires master key), then recreate as File
  const deleteRes = await fetchFn(`${serverUrl}/schemas/Product`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      className: 'Product',
      fields: {
        heroImage: { __op: 'Delete' },
      },
    }),
  });
  if (!deleteRes.ok) {
    const t = await deleteRes.text().catch(() => '');
    console.warn(`Could not delete Product.heroImage (non-fatal): ${deleteRes.status} ${t}`);
    return;
  }

  const addRes = await fetchFn(`${serverUrl}/schemas/Product`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      className: 'Product',
      fields: {
        heroImage: { type: 'File' },
        heroImageFile: { type: 'File' },
        galleryFiles: { type: 'Array' },
      },
    }),
  });
  if (!addRes.ok) {
    const t = await addRes.text().catch(() => '');
    console.warn(`Could not add Product.heroImage as File (non-fatal): ${addRes.status} ${t}`);
  }
}

async function findExistingProduct(slug) {
  const where = encodeURIComponent(JSON.stringify({ slug }));
  const response = await fetchFn(`${serverUrl}/classes/Product?limit=1&where=${where}`, {
    headers,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to query product ${slug}: ${response.status} ${text}`);
  }
  const result = await response.json();
  return result.results?.[0] ?? null;
}

async function saveProduct(product, assets) {
  const bodyFile = {
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    volumeLabel: product.volumeLabel,
    servings: product.servings,
    heroImage: assets.hero.filePointer,
    gallery: assets.gallery.map((g) => g.filePointer),
    highlights: product.highlights,
    sustainability: product.sustainability,
  };

  const bodyObject = {
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    volumeLabel: product.volumeLabel,
    servings: product.servings,
    heroImage: assets.hero.simple,
    gallery: assets.gallery.map((g) => g.simple),
    highlights: product.highlights,
    sustainability: product.sustainability,
  };

  async function performSave(body) {
    const existing = await findExistingProduct(product.slug);
    if (existing) {
      const response = await fetchFn(`${serverUrl}/classes/Product/${existing.objectId}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return { response, isUpdate: true };
    }
    const response = await fetchFn(`${serverUrl}/classes/Product`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return { response, isUpdate: false };
  }

  // Try with File first
  let { response } = await performSave(bodyFile);
  if (!response.ok) {
    const text = await response.text();
    // Schema mismatch fallback
    if (response.status === 400 && /schema mismatch.*expected Object but got File/i.test(text)) {
      ({ response } = await performSave(bodyObject));
    } else if (response.status === 400 && /schema mismatch.*expected File but got Object/i.test(text)) {
      ({ response } = await performSave(bodyFile));
    }
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to ${response.url?.includes('/classes/Product/') ? 'update' : 'create'} product ${product.slug}: ${response.status} ${text}`);
  }
  return response.json();
}

async function main() {
  await ensureSchema();

  const uploadCache = new Map();

  for (const product of products) {
    console.log(`\nProcessing ${product.slug}...`);

    const heroKey = product.heroImage.src;
    if (!uploadCache.has(heroKey)) {
      uploadCache.set(heroKey, await uploadFile(heroKey));
    }
    const heroAsset = uploadCache.get(heroKey);

    const galleryUploads = [];
    for (const image of product.gallery) {
      if (!uploadCache.has(image.src)) {
        uploadCache.set(image.src, await uploadFile(image.src));
      }
      galleryUploads.push(uploadCache.get(image.src));
    }

    await saveProduct(product, { hero: heroAsset, gallery: galleryUploads });
    console.log(`✔ Producto ${product.slug} sincronizado.`);
  }

  console.log('\nFinalizado.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
