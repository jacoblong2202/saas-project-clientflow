"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Typewriter } from 'react-simple-typewriter';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
        {/* Blurred Gradient Blobs (background, not clickable) */}
        <div aria-hidden className="absolute -top-24 -left-32 w-[32rem] h-[32rem] bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-20 blur-3xl rounded-full pointer-events-none z-0" />
        <div aria-hidden className="absolute top-32 right-0 w-[28rem] h-[28rem] bg-gradient-to-br from-pink-400 via-blue-400 to-purple-400 opacity-20 blur-3xl rounded-full pointer-events-none z-0" />
        {/* Trusted by pill above hero headline */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center bg-white border border-gray-200 rounded-full px-6 py-2 shadow-sm text-gray-700 font-medium text-sm">
            {/* Shield/Check icon */}
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5l7 3v4.5c0 5.25-3.5 9.75-7 11-3.5-1.25-7-5.75-7-11V7.5l7-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
            Trusted by 300+ agencies
          </span>
        </div>
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight text-gray-900">
                <span className="block">Streamline Your</span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block">
                  Client Management
                </span>
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <p className="text-2xl sm:text-3xl text-gray-700 mb-10 max-w-2xl mx-auto tracking-wide font-medium">
                The all-in-one platform to{' '}
                <span className="text-blue-600 font-semibold">
                  <Typewriter
                    words={["manage clients", "track projects", "scale your agency"]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={60}
                    deleteSpeed={40}
                    delaySpeed={1500}
                  />
                </span>
              </p>
            </motion.div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-blue-400/40 hover:shadow-lg transition-all duration-200 ease-in-out">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-gray-300 bg-white/80 hover:scale-105 hover:shadow-blue-400/30 hover:shadow-lg transition-all duration-200 ease-in-out">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curved SVG Section Divider */}
      <div aria-hidden className="-mt-2">
        <svg viewBox="0 0 1440 120" className="w-full h-16 md:h-24 lg:h-32" preserveAspectRatio="none">
          <path fill="#f3f4f6" d="M0,0 C480,120 960,0 1440,120 L1440,120 L0,120 Z" />
        </svg>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Everything you need to succeed
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to help you manage clients efficiently and grow your business.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-lg hover:-translate-y-1 transition-all">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 shadow-blue-300/40 hover:shadow-blue-400/60 shadow transition-all"
                  >
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </motion.div>
                  <CardTitle>Client Management</CardTitle>
                  <CardDescription>
                    Organize and track all your client relationships in one place with detailed profiles and communication history.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-lg hover:-translate-y-1 transition-all">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 shadow-purple-300/40 hover:shadow-purple-400/60 shadow transition-all"
                  >
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </motion.div>
                  <CardTitle>Project Tracking</CardTitle>
                  <CardDescription>
                    Monitor project progress, set milestones, and keep everyone on the same page with real-time updates.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-lg hover:shadow-lg hover:-translate-y-1 transition-all">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 shadow-green-300/40 hover:shadow-green-400/60 shadow transition-all"
                  >
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </motion.div>
                  <CardTitle>Analytics & Insights</CardTitle>
                  <CardDescription>
                    Get powerful insights into your business performance with detailed analytics and reporting.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to transform your client management?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of businesses that trust ClientFlow to manage their client relationships.
              </p>
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">“ClientFlow made onboarding new clients a breeze. The UI is beautiful and intuitive!”</p>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Liam Patel" className="w-14 h-14 rounded-full mb-2" />
                <div className="font-semibold text-gray-900">Liam Patel</div>
              </div>
              {/* Testimonial 2 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">“The automation features save us hours every week. Our team is more productive than ever.”</p>
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sofia Alvarez" className="w-14 h-14 rounded-full mb-2" />
                <div className="font-semibold text-gray-900">Sofia Alvarez</div>
              </div>
              {/* Testimonial 3 */}
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">“We finally have a single source of truth for all our projects. Support is fantastic!”</p>
                <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Mateo Rossi" className="w-14 h-14 rounded-full mb-2" />
                <div className="font-semibold text-gray-900">Mateo Rossi</div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Bottom Banner CTA */}
      <section className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 py-12 px-4 mt-16 overflow-hidden">
        {/* Blurred Gradient Blob behind CTA */}
        <div aria-hidden className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[36rem] h-[20rem] bg-gradient-to-tr from-purple-400 via-blue-400 to-pink-400 opacity-20 blur-3xl rounded-full pointer-events-none z-0" />
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Start managing clients better today with ClientFlow.</h2>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-10 py-6 bg-white text-blue-700 font-bold shadow-lg hover:scale-105 hover:shadow-blue-200/40 transition-all duration-200 ease-in-out">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
