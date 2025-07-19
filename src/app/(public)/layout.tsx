'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm transition-shadow border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 w-full">
            {/* Logo (left) */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CF</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">ClientFlow</span>
              </Link>
            </div>

            {/* Center nav (desktop only) */}
            <nav className="hidden md:flex flex-1 justify-center">
              <div className="flex gap-x-10">
                <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
                <Link href="/pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Pricing</Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</Link>
                <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Blog</Link>
              </div>
            </nav>

            {/* Right side auth (desktop only) */}
            <div className="hidden md:flex items-center gap-x-4 ml-auto">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100 font-medium">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-semibold shadow-md">Start Free Trial</Button>
              </Link>
            </div>

            {/* Hamburger menu (mobile only) */}
            <div className="flex md:hidden ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-2">
                  <DropdownMenuItem asChild>
                    <Link href="/">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pricing">Pricing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about">About</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/blog">Blog</Link>
                  </DropdownMenuItem>
                  <div className="border-t my-2" />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="w-full">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="w-full">
                      <span className="text-blue-600 font-medium">Start Free Trial</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CF</span>
                </div>
                <span className="font-bold text-xl">ClientFlow</span>
              </div>
              <p className="text-gray-600 max-w-md">
                Streamline your client management with our powerful SaaS platform. 
                Built for modern businesses that value efficiency and growth.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/updates" className="text-gray-600 hover:text-gray-900">Updates</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link></li>
                <li><Link href="/signup" className="text-gray-600 hover:text-gray-900">Sign Up</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 ClientFlow. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 