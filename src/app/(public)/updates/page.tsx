import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpdatesPage() {
  const updates = [
    {
      version: "v2.1.0",
      date: "March 15, 2024",
      title: "Enhanced Client Communication",
      type: "feature",
      description: "New messaging system with real-time notifications and file sharing capabilities.",
      changes: [
        "Real-time messaging between team members and clients",
        "File sharing with drag-and-drop support",
        "Message threading and organization",
        "Email notifications for important messages",
        "Mobile app notifications"
      ]
    },
    {
      version: "v2.0.5",
      date: "March 10, 2024",
      title: "Performance Improvements",
      type: "improvement",
      description: "Significant performance improvements and bug fixes across the platform.",
      changes: [
        "50% faster page load times",
        "Improved search functionality",
        "Fixed calendar sync issues",
        "Enhanced mobile responsiveness",
        "Better error handling and user feedback"
      ]
    },
    {
      version: "v2.0.0",
      date: "March 1, 2024",
      title: "Major Platform Update",
      type: "major",
      description: "Complete redesign with new features and improved user experience.",
      changes: [
        "New modern interface design",
        "Advanced project management tools",
        "Enhanced reporting and analytics",
        "Improved client portal",
        "New API endpoints for integrations",
        "Better team collaboration features"
      ]
    },
    {
      version: "v1.8.2",
      date: "February 20, 2024",
      title: "Security Enhancements",
      type: "security",
      description: "Important security updates and authentication improvements.",
      changes: [
        "Two-factor authentication (2FA) support",
        "Enhanced password requirements",
        "Improved session management",
        "Security audit and vulnerability fixes",
        "GDPR compliance improvements"
      ]
    },
    {
      version: "v1.8.0",
      date: "February 10, 2024",
      title: "Invoice Management",
      type: "feature",
      description: "New comprehensive invoice management system with payment tracking.",
      changes: [
        "Create and send professional invoices",
        "Multiple payment gateway integrations",
        "Automatic payment reminders",
        "Invoice templates and customization",
        "Payment tracking and reporting"
      ]
    },
    {
      version: "v1.7.5",
      date: "January 25, 2024",
      title: "Bug Fixes and Improvements",
      type: "fix",
      description: "Various bug fixes and minor improvements based on user feedback.",
      changes: [
        "Fixed time tracking accuracy issues",
        "Improved data export functionality",
        "Better error messages",
        "Enhanced keyboard shortcuts",
        "Fixed mobile app crashes"
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-purple-100 text-purple-800';
      case 'feature':
        return 'bg-blue-100 text-blue-800';
      case 'improvement':
        return 'bg-green-100 text-green-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'fix':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'major':
        return 'Major Release';
      case 'feature':
        return 'New Feature';
      case 'improvement':
        return 'Improvement';
      case 'security':
        return 'Security';
      case 'fix':
        return 'Bug Fix';
      default:
        return 'Update';
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Updates
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay up to date with the latest features, improvements, and fixes in ClientFlow. 
            We're constantly working to make your client management experience better.
          </p>
        </div>

        {/* RSS Feed Link */}
        <div className="text-center mb-12">
          <Link href="/updates/rss" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M6.18 4A12.18 12.18 0 0 1 18.36 16.18c0 .67-.08 1.33-.24 1.96a14.18 14.18 0 0 0-16.2-16.2C2.85 2.08 3.51 2 4.18 2A12.18 12.18 0 0 1 16.36 14.18c0 .67-.08 1.33-.24 1.96a14.18 14.18 0 0 0-16.2-16.2C2.85 2.08 3.51 2 4.18 2"/>
            </svg>
            Subscribe to RSS Feed
          </Link>
        </div>

        {/* Updates Timeline */}
        <div className="max-w-4xl mx-auto">
          {updates.map((update, index) => (
            <Card key={index} className="mb-8 border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(update.type)}`}>
                        {getTypeLabel(update.type)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {update.date}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {update.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {update.version}
                      </span>
                    </div>
                    <CardDescription className="text-base">
                      {update.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {update.changes.map((change, changeIndex) => (
                    <li key={changeIndex} className="flex items-start">
                      <svg 
                        className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                      <span className="text-gray-700">{change}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Version History */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Version History
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {updates.slice(0, 6).map((update, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <span className="font-mono text-sm font-medium">{update.version}</span>
                    <p className="text-xs text-gray-500">{update.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(update.type)}`}>
                    {getTypeLabel(update.type)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Have feedback or feature requests?
            </h2>
            <p className="text-gray-600 mb-8">
              We'd love to hear from you! Your feedback helps us make ClientFlow better for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Send Feedback
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  Read Our Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Subscribe to Updates */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Never Miss an Update
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get notified about new features, improvements, and important announcements 
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
      </div>
    </div>
  );
} 