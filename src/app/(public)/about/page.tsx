import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InViewFade } from "@/components/ui/in-view-fade";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* About + Mission Unified Section */}
        <section className="relative overflow-hidden py-28 bg-gradient-to-br from-white via-violet-50 to-white">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-purple-100 opacity-20 blur-3xl -z-10" />
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-12 px-4 sm:px-6 lg:px-8">
            {/* About ClientFlow Heading */}
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">ClientFlow</span>
            </h2>
            {/* Subheading */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
              We’re on a mission to simplify client management for businesses of all sizes,
              helping you focus on what matters most — growing your business and serving your clients.
            </p>
            {/* Divider */}
            <div className="h-px w-24 bg-gradient-to-r from-indigo-400 via-purple-400 to-transparent mx-auto my-12 opacity-60"></div>
            {/* Our Mission Section */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Mission</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                ClientFlow was born from a simple observation: managing client relationships shouldn't be complicated.
                Too many businesses struggle with scattered information, missed deadlines, and inefficient communication.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that every business deserves powerful, intuitive tools that help them build stronger relationships
                with their clients. Our platform combines modern technology with thoughtful design to create an experience that just works.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you're a solo consultant or a growing agency, ClientFlow gives you the tools you need to deliver exceptional
                service and grow your business.
              </p>
            </div>
          </div>
        </section>

        {/* Who it's for Section */}
        <section className="pt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Who it's for
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ClientFlow is designed for businesses that value efficiency, growth, and exceptional client service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle>Freelancers & Consultants</CardTitle>
                <CardDescription>
                  Manage multiple clients, track projects, and maintain professional relationships 
                  with tools that scale with your business.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <CardTitle>Small Agencies</CardTitle>
                <CardDescription>
                  Coordinate team efforts, manage client expectations, and deliver projects 
                  on time with collaborative tools and clear communication.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <CardTitle>Growing Businesses</CardTitle>
                <CardDescription>
                  Scale your operations, maintain quality service, and build lasting 
                  client relationships as your business grows.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Built by Jacob Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Built by Jacob
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Hi, I'm Jacob! I'm a passionate developer and entrepreneur who believes that 
                  great software should solve real problems and make people's lives easier.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  After working with countless businesses and seeing the same challenges 
                  repeated across different industries, I decided to build ClientFlow - 
                  a solution that actually works for real people doing real work.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Every feature in ClientFlow is designed with one goal: to help you 
                  build better relationships with your clients and grow your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact">
                    <Button size="lg">
                      Get in Touch
                    </Button>
                  </Link>
                  <Link href="/blog">
                    <Button variant="outline" size="lg">
                      Read Our Blog
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">J</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Jacob Long</h3>
                <p className="text-gray-600">Founder & CEO</p>
                <div className="flex justify-center space-x-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to join us?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start your free trial today and see how ClientFlow can transform your client management.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 