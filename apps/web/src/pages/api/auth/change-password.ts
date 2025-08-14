import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { oldPassword, newPassword, confirmPassword } = req.body || {};
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Campos incompletos' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'La nueva contraseña es demasiado corta' });
    }
    if (newPassword === oldPassword) {
      return res.status(400).json({ error: 'La nueva contraseña debe ser diferente' });
    }

    // DEMO: No hay persistencia real ni verificación del hash del usuario.
    // En producción, validar oldPassword contra el hash almacenado y guardar el nuevo hash.

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Error interno' });
  }
}


