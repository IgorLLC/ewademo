import type { NextApiRequest, NextApiResponse } from 'next';
import { blogPosts } from '../../../data/blog';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json(blogPosts);
}
