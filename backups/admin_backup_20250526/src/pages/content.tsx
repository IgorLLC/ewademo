import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button, Card } from '@ewa/ui';

// Tipos para el contenido editable
interface ContentBlock {
  id: string;
  title: string;
  content: string;
  type: 'hero' | 'feature' | 'testimonial' | 'about' | 'faq';
  page: string;
  lastUpdated: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  image?: string;
}

const ContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'website' | 'blog'>('website');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentBlock | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    // Simulamos la carga de bloques de contenido
    const mockContentBlocks: ContentBlock[] = [
      {
        id: 'content_1',
        title: 'Hero Section',
        content: 'Pure water, sustainable packaging. EWA Box Water is revolutionizing how you hydrate with our eco-friendly water boxes.',
        type: 'hero',
        page: 'home',
        lastUpdated: '2023-10-10'
      },
      {
        id: 'content_2',
        title: 'About Us Intro',
        content: 'EWA Box Water was founded in Puerto Rico with a mission to reduce plastic waste while providing pure, refreshing water in sustainable packaging.',
        type: 'about',
        page: 'about',
        lastUpdated: '2023-09-28'
      },
      {
        id: 'content_3',
        title: 'Sustainability Feature',
        content: 'Our boxes are made from 74% renewable materials and are 100% recyclable, reducing carbon footprint by over 50% compared to plastic bottles.',
        type: 'feature',
        page: 'home',
        lastUpdated: '2023-10-05'
      },
      {
        id: 'content_4',
        title: 'Customer Testimonial',
        content: '"Switching to EWA Box Water for our restaurant was one of the best decisions we made. Our customers love the eco-friendly approach and the water tastes great!" - Juan Martínez, Restaurante Sobao',
        type: 'testimonial',
        page: 'home',
        lastUpdated: '2023-09-15'
      },
      {
        id: 'content_5',
        title: 'FAQ - Subscription',
        content: 'Our subscription service delivers fresh box water to your door on a schedule that works for you. Choose from weekly, biweekly, or monthly deliveries.',
        type: 'faq',
        page: 'faq',
        lastUpdated: '2023-10-12'
      }
    ];

    // Simulamos la carga de posts del blog
    const mockBlogPosts: BlogPost[] = [
      {
        id: 'post_1',
        title: 'The Environmental Impact of Plastic Water Bottles',
        slug: 'environmental-impact-plastic-bottles',
        excerpt: 'Learn about the devastating effects of plastic bottles on our oceans and environment, and how alternatives like box water can help.',
        content: 'Full blog post content would go here with multiple paragraphs about plastic pollution statistics, environmental impact, and sustainable alternatives.',
        author: 'María López',
        publishDate: '2023-10-15',
        status: 'published',
        featured: true,
        image: '/images/blog/plastic-pollution.jpg'
      },
      {
        id: 'post_2',
        title: 'Why Puerto Rico is Leading the Way in Sustainable Packaging',
        slug: 'puerto-rico-sustainable-packaging',
        excerpt: 'Puerto Rico is becoming a hub for sustainable packaging innovation. Here\'s how local companies are making a difference.',
        content: 'Full blog post content about Puerto Rico\'s initiatives in sustainable packaging, local companies, and government support for eco-friendly businesses.',
        author: 'Carlos Rodríguez',
        publishDate: '2023-10-08',
        status: 'published',
        featured: false,
        image: '/images/blog/pr-sustainability.jpg'
      },
      {
        id: 'post_3',
        title: 'Box Water vs. Plastic Bottles: A Comparison',
        slug: 'box-water-vs-plastic-bottles',
        excerpt: 'We compare the environmental footprint, taste, and convenience of box water against traditional plastic bottles.',
        content: 'Full comparison between box water and plastic bottles, including production process, carbon footprint, recycling rates, and consumer experience.',
        author: 'Ana Morales',
        publishDate: '2023-09-30',
        status: 'published',
        featured: true,
        image: '/images/blog/comparison.jpg'
      },
      {
        id: 'post_4',
        title: 'Upcoming Regulations on Single-Use Plastics in the Caribbean',
        slug: 'regulations-single-use-plastics-caribbean',
        excerpt: 'New regulations are coming to reduce single-use plastics across the Caribbean. Here\'s what to expect.',
        content: 'Draft blog post about upcoming regulations in various Caribbean countries, implementation timelines, and impact on businesses and consumers.',
        author: 'Roberto Díaz',
        publishDate: '',
        status: 'draft',
        featured: false,
        image: '/images/blog/regulations.jpg'
      },
      {
        id: 'post_5',
        title: 'How to Start a Sustainable Business in Puerto Rico',
        slug: 'start-sustainable-business-puerto-rico',
        excerpt: 'A guide for entrepreneurs looking to launch eco-friendly businesses in Puerto Rico, with insights from successful founders.',
        content: 'Step-by-step guide for starting a sustainable business in Puerto Rico, including legal requirements, funding opportunities, and case studies.',
        author: 'Luisa Vega',
        publishDate: '2023-08-22',
        status: 'archived',
        featured: false,
        image: '/images/blog/business-guide.jpg'
      }
    ];

    setContentBlocks(mockContentBlocks);
    setBlogPosts(mockBlogPosts);
  }, []);

  const handleContentSelect = (content: ContentBlock) => {
    setSelectedContent(content);
    setSelectedBlogPost(null);
    setEditTitle(content.title);
    setEditContent(content.content);
    setIsEditing(false);
  };

  const handleBlogPostSelect = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setSelectedContent(null);
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveContent = () => {
    if (selectedContent) {
      const updatedBlocks = contentBlocks.map(block => {
        if (block.id === selectedContent.id) {
          return {
            ...block,
            title: editTitle,
            content: editContent,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return block;
      });
      setContentBlocks(updatedBlocks);
      setSelectedContent({
        ...selectedContent,
        title: editTitle,
        content: editContent,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    } else if (selectedBlogPost) {
      const updatedPosts = blogPosts.map(post => {
        if (post.id === selectedBlogPost.id) {
          return {
            ...post,
            title: editTitle,
            content: editContent
          };
        }
        return post;
      });
      setBlogPosts(updatedPosts);
      setSelectedBlogPost({
        ...selectedBlogPost,
        title: editTitle,
        content: editContent
      });
    }
    setIsEditing(false);
  };

  const handlePublishBlogPost = (postId: string) => {
    const updatedPosts = blogPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          status: 'published',
          publishDate: new Date().toISOString().split('T')[0]
        };
      }
      return post;
    });
    setBlogPosts(updatedPosts);
    if (selectedBlogPost && selectedBlogPost.id === postId) {
      setSelectedBlogPost({
        ...selectedBlogPost,
        status: 'published',
        publishDate: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleArchiveBlogPost = (postId: string) => {
    const updatedPosts = blogPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          status: 'archived'
        };
      }
      return post;
    });
    setBlogPosts(updatedPosts);
    if (selectedBlogPost && selectedBlogPost.id === postId) {
      setSelectedBlogPost({
        ...selectedBlogPost,
        status: 'archived'
      });
    }
  };

  const handleToggleFeatured = (postId: string) => {
    const updatedPosts = blogPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          featured: !post.featured
        };
      }
      return post;
    });
    setBlogPosts(updatedPosts);
    if (selectedBlogPost && selectedBlogPost.id === postId) {
      setSelectedBlogPost({
        ...selectedBlogPost,
        featured: !selectedBlogPost.featured
      });
    }
  };

  const renderWebsiteContentTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {contentBlocks.map((block) => (
              <li key={block.id}>
                <button
                  onClick={() => handleContentSelect(block)}
                  className={`w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none ${
                    selectedContent?.id === block.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{block.title}</p>
                      <p className="text-xs text-gray-500">
                        {block.type.charAt(0).toUpperCase() + block.type.slice(1)} | Page: {block.page}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      Updated: {block.lastUpdated}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 bg-gray-50 text-right">
            <Button
              onClick={() => alert('Add content block functionality would go here')}
              variant="secondary"
              size="small"
            >
              Add Content Block
            </Button>
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedContent ? (
          <Card className="h-full">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isEditing ? 'Edit Content' : selectedContent.title}
                </h3>
                <Button
                  onClick={handleEditToggle}
                  variant={isEditing ? 'secondary' : 'primary'}
                  size="small"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              {isEditing ? (
                <div>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows={6}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveContent}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">Content Type</h4>
                    <p className="mt-1">{selectedContent.type.charAt(0).toUpperCase() + selectedContent.type.slice(1)}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">Page</h4>
                    <p className="mt-1">{selectedContent.page}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                    <p className="mt-1">{selectedContent.lastUpdated}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Content</h4>
                    <div className="mt-1 p-4 bg-gray-50 rounded-md">
                      <p className="whitespace-pre-wrap">{selectedContent.content}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg p-6">
            <p className="text-gray-500">Select a content block to view or edit</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderBlogTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {blogPosts.map((post) => (
              <li key={post.id}>
                <button
                  onClick={() => handleBlogPostSelect(post)}
                  className={`w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none ${
                    selectedBlogPost?.id === post.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.title}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'published' ? 'bg-green-100 text-green-800' :
                          post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                        {post.featured && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {post.publishDate ? post.publishDate : 'Not published'}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 bg-gray-50 text-right">
            <Button
              onClick={() => alert('Add blog post functionality would go here')}
              variant="secondary"
              size="small"
            >
              New Blog Post
            </Button>
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedBlogPost ? (
          <Card className="h-full">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {isEditing ? 'Edit Blog Post' : selectedBlogPost.title}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedBlogPost.status === 'published' ? 'bg-green-100 text-green-800' :
                      selectedBlogPost.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedBlogPost.status.charAt(0).toUpperCase() + selectedBlogPost.status.slice(1)}
                    </span>
                    {selectedBlogPost.featured && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Button
                    onClick={handleEditToggle}
                    variant={isEditing ? 'secondary' : 'primary'}
                    size="small"
                    className="mr-2"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                  {selectedBlogPost.status === 'draft' && (
                    <Button
                      onClick={() => handlePublishBlogPost(selectedBlogPost.id)}
                      variant="secondary"
                      size="small"
                      className="mr-2"
                    >
                      Publish
                    </Button>
                  )}
                  {selectedBlogPost.status !== 'archived' && (
                    <Button
                      onClick={() => handleArchiveBlogPost(selectedBlogPost.id)}
                      variant="danger"
                      size="small"
                      className="mr-2"
                    >
                      Archive
                    </Button>
                  )}
                  <Button
                    onClick={() => handleToggleFeatured(selectedBlogPost.id)}
                    variant="secondary"
                    size="small"
                  >
                    {selectedBlogPost.featured ? 'Unfeature' : 'Feature'}
                  </Button>
                </div>
              </div>

              {isEditing ? (
                <div>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows={10}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveContent}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">Author</h4>
                    <p className="mt-1">{selectedBlogPost.author}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">Slug</h4>
                    <p className="mt-1">{selectedBlogPost.slug}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">Excerpt</h4>
                    <p className="mt-1">{selectedBlogPost.excerpt}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Content</h4>
                    <div className="mt-1 p-4 bg-gray-50 rounded-md">
                      <p className="whitespace-pre-wrap">{selectedBlogPost.content}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg p-6">
            <p className="text-gray-500">Select a blog post to view or edit</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout title="Content Management - EWA Box Water">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage website content and blog posts
          </p>
        </div>

        <div className="mb-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'website' | 'blog')}
            >
              <option value="website">Website Content</option>
              <option value="blog">Blog Posts</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('website')}
                  className={`${
                    activeTab === 'website'
                      ? 'border-ewa-blue text-ewa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Website Content
                </button>
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`${
                    activeTab === 'blog'
                      ? 'border-ewa-blue text-ewa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Blog Posts
                </button>
              </nav>
            </div>
          </div>
        </div>

        {activeTab === 'website' ? renderWebsiteContentTab() : renderBlogTab()}
      </div>
    </Layout>
  );
};

export default ContentPage;
