import type { NextApiRequest, NextApiResponse } from 'next';

function serializeCookie(name: string, value: string, options: {
  httpOnly?: boolean;
  secure?: boolean;
  maxAge?: number; // seconds
  path?: string;
  sameSite?: 'lax' | 'strict' | 'none';
} = {}) {
  const pairs = [`${name}=${value}`];
  if (options.maxAge !== undefined) pairs.push(`Max-Age=${options.maxAge}`);
  pairs.push(`Path=${options.path || '/'}`);
  if (options.httpOnly) pairs.push('HttpOnly');
  if (options.secure) pairs.push('Secure');
  pairs.push(`SameSite=${options.sameSite || 'Lax'}`);
  return pairs.join('; ');
}

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const expired = serializeCookie('ewa_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  res.setHeader('Set-Cookie', expired);
  res.status(200).json({ ok: true });
}


