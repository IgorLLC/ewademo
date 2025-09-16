export type SessionUser = {
  id: string;
  name?: string;
  email: string;
  role: 'admin' | 'operator' | 'editor' | 'customer';
};

export function readSessionFromCookie(): SessionUser | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )ewa_session=([^;]+)/);
  if (!match) return null;
  try {
    const json = Buffer.from(decodeURIComponent(match[1]), 'base64').toString('utf8');
    const user = JSON.parse(json);
    if (!user || !user.id || !user.email || !user.role) return null;
    return user as SessionUser;
  } catch {
    return null;
  }
}

export function hasAdminAccess(user: SessionUser | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'operator' || user.role === 'editor';
}




