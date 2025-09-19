import rawPosts from './blog.json';

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
  content: string;
};

export const blogPosts = rawPosts as BlogPost[];

export const findPostBySlug = (slug: string) => blogPosts.find((post) => post.slug === slug);
