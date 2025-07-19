import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Client Management Tips for Freelancers",
      excerpt: "Learn the fundamental strategies that successful freelancers use to manage their client relationships and grow their business effectively.",
      author: "Jacob Long",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Freelancing",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "How to Scale Your Agency Without Losing Personal Touch",
      excerpt: "Discover proven methods for maintaining quality client relationships as your agency grows from a small team to a larger organization.",
      author: "Jacob Long",
      date: "March 10, 2024",
      readTime: "8 min read",
      category: "Agency Growth",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "The Future of Client Management: AI and Automation",
      excerpt: "Explore how artificial intelligence and automation are transforming the way businesses manage client relationships and deliver services.",
      author: "Jacob Long",
      date: "March 5, 2024",
      readTime: "6 min read",
      category: "Technology",
      image: "/api/placeholder/400/250"
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ClientFlow Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, tips, and strategies to help you build better client relationships 
            and grow your business.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-lg opacity-90">Featured Article</p>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Featured
                  </span>
                </div>
                <CardTitle className="text-2xl mb-4">
                  10 Essential Client Management Tips for Freelancers
                </CardTitle>
                <CardDescription className="text-base mb-4">
                  Learn the fundamental strategies that successful freelancers use to manage their 
                  client relationships and grow their business effectively. From communication best 
                  practices to project management techniques.
                </CardDescription>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>By Jacob Long</span>
                    <span>•</span>
                    <span>March 15, 2024</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                  <Link href="/blog/10-essential-client-management-tips">
                    <Button variant="outline">
                      Read More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post) => (
            <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <CardHeader>
                <div className="mb-2">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-xl">
                  <Link href={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-base">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get the latest insights on client management, business growth, and productivity tips 
            delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button>
              Subscribe
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            {["All", "Freelancing", "Agency Growth", "Technology", "Productivity", "Client Relations"].map((category) => (
              <Link key={category} href={`/blog/category/${category.toLowerCase().replace(' ', '-')}`}>
                <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200">
                  {category}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 