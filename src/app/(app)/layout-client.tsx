'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart2, Shuffle, Calendar, Bot, Settings, Contact2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface AppLayoutClientProps {
  children: React.ReactNode;
  user: any;
  userDisplayName: string;
  userEmail: string;
}

export default function AppLayoutClient({ children, user, userDisplayName, userEmail }: AppLayoutClientProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: <BarChart2 className="w-5 h-5" /> },
    { name: "Pipeline", href: "/pipeline", icon: <Shuffle className="w-5 h-5" /> },
    { name: "CRM", href: "/crm", icon: <Contact2 className="w-5 h-5" /> },
    { name: "Planner", href: "/planner", icon: <Calendar className="w-5 h-5" /> },
    { name: "Assistant", href: "/assistant", icon: <Bot className="w-5 h-5" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center px-6 py-4 border-b border-gray-200 ${isCollapsed ? 'justify-center' : ''}`}> 
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <span className={`font-bold text-xl transition-all duration-300 ${
                isCollapsed 
                  ? 'opacity-0 w-0 ml-0 overflow-hidden' 
                  : 'opacity-100 w-auto ml-2'
              }`}>
                ClientFlow
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className={`transition-all duration-300 ${
                    isCollapsed 
                      ? 'opacity-0 w-0 ml-0 overflow-hidden' 
                      : 'opacity-100 w-auto ml-3'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'flex flex-col items-center' : ''}`}> 
            <div className={`flex items-center mb-4 ${isCollapsed ? 'justify-center' : ''}`}> 
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{userDisplayName.charAt(0).toUpperCase()}</span>
              </div>
              <div className={`transition-all duration-300 ${
                isCollapsed 
                  ? 'opacity-0 w-0 ml-0 overflow-hidden' 
                  : 'opacity-100 w-auto ml-3 min-w-0'
              }`}>
                <p className="text-sm font-medium text-gray-700 truncate">{userDisplayName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>
            <form action="/auth/signout" method="post">
              <Button 
                type="submit" 
                variant="outline" 
                size="sm" 
                className={`transition-all duration-300 ${
                  isCollapsed ? 'w-8 h-8 p-0' : 'w-full'
                }`}
                title={isCollapsed ? "Sign Out" : undefined}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className={`transition-all duration-300 ${
                  isCollapsed 
                    ? 'opacity-0 w-0 ml-0 overflow-hidden' 
                    : 'opacity-100 w-auto ml-2'
                }`}>
                  Sign Out
                </span>
              </Button>
            </form>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'pl-16' : 'pl-64'
      }`}>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 