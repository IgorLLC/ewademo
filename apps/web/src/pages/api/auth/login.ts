import type { NextApiRequest, NextApiResponse } from 'next';

type SessionPayload = {
  id: string;
  name?: string;
  email: string;
  role: 'admin' | 'operator' | 'editor' | 'customer';
};

function serializeCookie(name: string, value: string, options: {
  httpOnly?: boolean;
  secure?: boolean;
  maxAge?: number; // seconds
  path?: string;
  sameSite?: 'lax' | 'strict' | 'none';
} = {}) {
  const pairs = [`${name}=${value}`];
  if (options.maxAge) pairs.push(`Max-Age=${options.maxAge}`);
  pairs.push(`Path=${options.path || '/'}`);
  if (options.httpOnly) pairs.push('HttpOnly');
  if (options.secure) pairs.push('Secure');
  pairs.push(`SameSite=${options.sameSite || 'Lax'}`);
  return pairs.join('; ');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = req.body as SessionPayload | undefined;
    if (!user || !user.id || !user.email || !user.role) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    // Nota: Para demo. En producción, validar credenciales en servidor y emitir JWT firmado.
    const payload: SessionPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const base64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
    const cookie = serializeCookie('ewa_session', base64, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Internal error' });
  }
}


