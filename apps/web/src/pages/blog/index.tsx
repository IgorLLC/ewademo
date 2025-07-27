import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Card, LoadingSpinner, ErrorMessage } from '@ewa/ui';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get('/api/blogPosts');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Layout title="EWA Box Water - Blog">
      <section className="bg-ewa-light-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Our Blog</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Stay up to date with the latest news, tips, and insights about sustainable water consumption and delivery.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} className="max-w-md mx-auto" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="h-full flex flex-col">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={post.imageUrl || '/images/blog-placeholder.jpg'}
                      alt={post.title}
                      className="object-cover rounded-lg w-full h-48"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="text-gray-500 text-sm mb-2">
                      {formatDate(post.date)} • By {post.author}
                    </div>
                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="text-ewa-blue font-medium hover:underline mt-auto inline-block">
                      Read More →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get the latest updates, tips, and exclusive offers delivered directly to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 border border-gray-300 rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-ewa-blue"
              />
              <button className="bg-ewa-blue text-white px-6 py-2 rounded-md hover:bg-ewa-dark-blue transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
