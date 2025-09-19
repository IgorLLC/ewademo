import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');
const publicDir = path.join(webRoot, 'public');

const postsPath = path.join(webRoot, 'src', 'data', 'blog.json');
const posts = JSON.parse(await readFile(postsPath, 'utf-8'));

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

const baseHeaders = {
  'X-Parse-Application-Id': PARSE_APP_ID,
  'X-Parse-REST-API-Key': PARSE_REST_KEY,
};

if (PARSE_MASTER_KEY) {
  baseHeaders['X-Parse-Master-Key'] = PARSE_MASTER_KEY;
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
      ...baseHeaders,
      'Content-Type': 'application/octet-stream',
    },
    body: data,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to upload file ${fileName}: ${response.status} ${text}`);
  }

  const uploaded = await response.json();
  return { __type: 'File', name: uploaded.name, url: uploaded.url };
}

async function ensureBlogSchema() {
  if (!PARSE_MASTER_KEY) {
    console.warn('Skipping BlogPost schema creation because PARSE_MASTER_KEY is not set.');
    return;
  }

  const response = await fetchFn(`${serverUrl}/schemas/BlogPost`, {
    method: 'POST',
    headers: {
      ...baseHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      className: 'BlogPost',
      fields: {
        slug: { type: 'String' },
        title: { type: 'String' },
        excerpt: { type: 'String' },
        author: { type: 'String' },
        date: { type: 'String' },
        content: { type: 'String' },
        image: { type: 'File' },
        category: { type: 'String' },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    if (body.code === 103) {
      // Try to add category field if missing
      try {
        const putRes = await fetchFn(`${serverUrl}/schemas/BlogPost`, {
          method: 'PUT',
          headers: {
            ...baseHeaders,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            className: 'BlogPost',
            fields: {
              category: { type: 'String' },
            },
          }),
        });
        if (!putRes.ok) {
          const t = await putRes.text().catch(() => '');
          console.warn(`Could not update BlogPost schema (non-fatal): ${putRes.status} ${t}`);
        }
      } catch (e) {
        console.warn('Could not update BlogPost schema (non-fatal):', e?.message || e);
      }
      return;
    }
    if (response.status === 403) {
      console.warn('Skipping BlogPost schema creation due to insufficient permissions (master key required). Proceeding...');
      return;
    }
    throw new Error(`Failed to ensure BlogPost schema: ${response.status} ${JSON.stringify(body)}`);
  }
}

async function findExisting(slug) {
  const where = encodeURIComponent(JSON.stringify({ slug }));
  const response = await fetchFn(`${serverUrl}/classes/BlogPost?limit=1&where=${where}`, {
    headers: baseHeaders,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to query blog post ${slug}: ${response.status} ${text}`);
  }
  const result = await response.json();
  return result.results?.[0] ?? null;
}

async function savePost(post, imageFile) {
  const payload = {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    date: post.date,
    content: post.content,
    image: imageFile,
    category: post.category ?? 'historias-reales',
  };

  const existing = await findExisting(post.slug);
  const url = existing
    ? `${serverUrl}/classes/BlogPost/${existing.objectId}`
    : `${serverUrl}/classes/BlogPost`;
  const method = existing ? 'PUT' : 'POST';

  const response = await fetchFn(url, {
    method,
    headers: {
      ...baseHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    // Fallback if schema expects Object instead of File
    if (response.status === 400 && /schema mismatch.*expected Object but got File/i.test(text)) {
      const objectPayload = { ...payload, image: { name: imageFile.name, url: imageFile.url } };
      const retry = await fetchFn(url, {
        method,
        headers: {
          ...baseHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objectPayload),
      });
      if (!retry.ok) {
        const rt = await retry.text();
        throw new Error(`Failed to ${existing ? 'update' : 'create'} blog post ${post.slug}: ${retry.status} ${rt}`);
      }
      return;
    }
    throw new Error(`Failed to ${existing ? 'update' : 'create'} blog post ${post.slug}: ${response.status} ${text}`);
  }
}

async function main() {
  await ensureBlogSchema();

  const uploadCache = new Map();

  for (const post of posts) {
    console.log(`\nSincronizando ${post.slug}...`);

    if (!uploadCache.has(post.imageUrl)) {
      uploadCache.set(post.imageUrl, await uploadFile(post.imageUrl));
    }

    await savePost(post, uploadCache.get(post.imageUrl));
    console.log(`✔ Post ${post.slug} sincronizado.`);
  }

  console.log('\nBlog sincronizado con Parse.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
