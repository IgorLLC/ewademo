import type { NextApiRequest, NextApiResponse } from 'next';
import { findPostBySlug } from '../../../data/blog';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;
  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  const post = findPostBySlug(slug);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  return res.status(200).json(post);
}
