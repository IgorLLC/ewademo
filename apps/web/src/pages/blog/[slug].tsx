import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../components/Layout';
import { LoadingSpinner, ErrorMessage } from '@ewa/ui';
import Link from 'next/link';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
}

const BlogPostDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlogPost = async () => {
      try {
        const response = await axios.get(`/api/blogPosts?slug=${slug}`);
        const posts = response.data;
        const foundPost = posts.find((p: BlogPost) => p.slug === slug);
        
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Blog post not found');
        }
      } catch (err) {
        setError('Failed to load blog post. Please try again later.');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to convert markdown-like content to HTML
  const formatContent = (content: string) => {
    // Replace **bold** with <strong>bold</strong>
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace paragraphs (double newlines) with proper <p> tags
    formattedContent = formattedContent
      .split('\n\n')
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
    
    return formattedContent;
  };

  return (
    <Layout title={post ? `${post.title} - EWA Box Water Blog` : 'Blog Post - EWA Box Water'}>
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-20">
          <ErrorMessage message={error} className="max-w-md mx-auto" />
          <div className="text-center mt-8">
            <Link href="/blog" className="text-ewa-blue font-medium hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </div>
      ) : post ? (
        <>
          <div className="bg-ewa-light-blue py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <Link href="/blog" className="text-ewa-blue font-medium hover:underline mb-4 inline-block">
                  ← Back to Blog
                </Link>
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="text-gray-600 mb-6">
                  {formatDate(post.date)} • By {post.author}
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <img
                  src={post.imageUrl || '/images/blog-placeholder.jpg'}
                  alt={post.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              <div className="prose prose-lg max-w-none" 
                   dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold mb-4">Share this article</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-ewa-blue">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-ewa-blue">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-ewa-blue">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Hardcoded related articles for the prototype */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold mb-2">The Environmental Benefits of Boxed Water</h3>
                  <p className="text-gray-600 mb-4">Learn how switching to boxed water can reduce your carbon footprint.</p>
                  <Link href="/blog/benefits-of-boxed-water" className="text-ewa-blue font-medium hover:underline">
                    Read More →
                  </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold mb-2">5 Essential Hydration Tips for Summer</h3>
                  <p className="text-gray-600 mb-4">Stay cool and hydrated during the hot summer months.</p>
                  <Link href="/blog/hydration-tips-summer" className="text-ewa-blue font-medium hover:underline">
                    Read More →
                  </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold mb-2">The Convenience of Water Delivery Services</h3>
                  <p className="text-gray-600 mb-4">Discover how water delivery services can save you time and money.</p>
                  <Link href="/blog/water-delivery-convenience" className="text-ewa-blue font-medium hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </Layout>
  );
};

export default BlogPostDetail;
