"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: annual ? "£290" : "£29",
      period: annual ? "/year" : "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Access to 5 clients",
        "CRM (basic view only)",
        "Pipeline board",
        "Task manager",
        "Calendar view with sync",
        "Community support",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false,
      annualNote: "2 months free"
    },
    {
      name: "Professional",
      price: annual ? "£790" : "£79",
      period: annual ? "/year" : "/month",
      description: "Ideal for growing businesses",
      features: [
        "Access to unlimited clients",
        "Full CRM (filters, tags, smart search)",
        "Pipeline with automation",
        "AI Assistant (automates emails, proposals, tasks)",
        "Calendar view with sync",
        "Advanced task manager",
        "Priority support",
        "Access to upcoming features"
      ],
      cta: "Start Free Trial",
      popular: true,
      annualNote: "2 months free"
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Glowing Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-full text-sm font-medium text-green-700 mb-6 shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Start free — no commitment
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Simple,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-transparent bg-clip-text">
              transparent pricing
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Start your 14-day free trial. Cancel anytime.
          </motion.p>
        </motion.div>

        {/* Toggle Switch */}
        <div className="flex justify-center items-center mb-10 gap-4">
          <span className={`font-medium ${!annual ? 'text-blue-600' : 'text-gray-500'}`}>Monthly</span>
          <button
            className={`relative w-14 h-8 flex items-center bg-gray-200 rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            onClick={() => setAnnual((v) => !v)}
            aria-pressed={annual}
            aria-label="Toggle annual pricing"
            type="button"
          >
            <motion.span
              layout
              className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${annual ? 'translate-x-6' : ''}`}
            />
            <span
              className={`absolute left-2 text-xs font-semibold transition-opacity duration-200 ${annual ? 'opacity-0' : 'opacity-100'}`}
            >Mo</span>
            <span
              className={`absolute right-2 text-xs font-semibold transition-opacity duration-200 ${annual ? 'opacity-100' : 'opacity-0'}`}
            >Yr</span>
          </button>
          <span className={`font-medium ${annual ? 'text-blue-600' : 'text-gray-500'}`}>Annual <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full align-middle">2 months free</span></span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4 flex flex-col items-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={plan.price}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl font-bold"
                    >
                      {plan.price}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-gray-600">{plan.period}</span>
                  {annual && (
                    <span className="text-xs text-blue-600 font-semibold mt-1">{plan.annualNote}</span>
                  )}
                </div>
                <CardDescription className="text-base mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg 
                        className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" 
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
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"} className="block">
                  <Button
                    className={`w-full font-bold text-lg py-4 shadow-md transition-all duration-200 ease-in-out
                      ${plan.name === 'Enterprise'
                        ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'}
                      hover:shadow-lg focus-visible:ring-4 focus-visible:ring-blue-300 focus-visible:outline-none`}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </Link>
                <div className="mt-2 text-xs text-gray-400 text-center">Cancel anytime</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">Secure checkout with Stripe</p>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                Can I upgrade later?
              </AccordionTrigger>
              <AccordionContent>
                Yes, you can upgrade your plan at any time. When you upgrade, you'll only pay the difference for the remaining billing period. Your new features will be available immediately.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                Is there a free trial?
              </AccordionTrigger>
              <AccordionContent>
                Yes! All plans include a 14-day free trial. No credit card required to start. You can explore all features and decide which plan works best for your business.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                What if I hit the client limit?
              </AccordionTrigger>
              <AccordionContent>
                If you reach your client limit, you'll receive a notification and can upgrade to the Professional plan for unlimited clients. Your existing data will be preserved during the upgrade.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Do you offer refunds?
              </AccordionTrigger>
              <AccordionContent>
                We offer a 30-day money-back guarantee. If you're not satisfied with our service within the first 30 days, we'll provide a full refund. No questions asked.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Trust Bar */}
        <div className="my-12">
          <div className="border-t border-gray-200 mb-6" />
          <div className="flex flex-col items-center gap-4">
            <span className="text-gray-500 font-medium text-base mb-2">Trusted by 1,200+ agencies</span>
            <div className="flex flex-row flex-wrap justify-center items-center gap-8 grayscale opacity-80">
              {/* Stripe */}
              <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M10.7 7.6c-1.1 0-2.2.2-3.1.7V2.2H3.1v19.2h4.5v-1.1c.9.5 2 .7 3.1.7 3.7 0 6.2-2.1 6.2-5.5v-.1c0-3.3-2.5-5.5-6.2-5.5zm-1.6 8.2c-.7 0-1.4-.1-2-.4v-5.1c.6-.3 1.3-.4 2-.4 1.7 0 2.8 1 2.8 2.7v.1c0 1.7-1.1 2.7-2.8 2.7zm13.2-8.2c-3.2 0-5.3 2.2-5.3 5.5v.1c0 3.3 2.1 5.5 5.3 5.5 1.7 0 3.1-.5 4.2-1.5l-1.7-2.5c-.7.6-1.4 1-2.4 1-1.1 0-1.8-.5-2-1.5h6.4v-.7c0-3.1-2-5.4-5.2-5.4zm-2.1 4.5c.2-1 .9-1.6 2-1.6 1 0 1.7.6 1.9 1.6h-3.9zm13.2-4.5c-1.2 0-2.2.4-2.9 1.2V7.8h-4.4v13.6h4.5v-6.7c.6-.7 1.5-1.1 2.5-1.1 1.7 0 2.7 1 2.7 2.8v5h4.5v-5.7c0-3.2-1.9-5-5.1-5zm13.2 0c-1.2 0-2.2.4-2.9 1.2V7.8h-4.4v13.6h4.5v-6.7c.6-.7 1.5-1.1 2.5-1.1 1.7 0 2.7 1 2.7 2.8v5h4.5v-5.7c0-3.2-1.9-5-5.1-5zm10.2 0c-3.2 0-5.3 2.2-5.3 5.5v.1c0 3.3 2.1 5.5 5.3 5.5 1.7 0 3.1-.5 4.2-1.5l-1.7-2.5c-.7.6-1.4 1-2.4 1-1.1 0-1.8-.5-2-1.5h6.4v-.7c0-3.1-2-5.4-5.2-5.4zm-2.1 4.5c.2-1 .9-1.6 2-1.6 1 0 1.7.6 1.9 1.6h-3.9z" fill="#222"/>
                </g>
              </svg>
              {/* HubSpot */}
              <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <circle cx="12" cy="12" r="10" stroke="#222" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="3" fill="#222"/>
                  <rect x="11" y="2" width="2" height="6" rx="1" fill="#222"/>
                  <rect x="18" y="11" width="6" height="2" rx="1" fill="#222"/>
                  <rect x="11" y="16" width="2" height="6" rx="1" fill="#222"/>
                  <rect x="2" y="11" width="6" height="2" rx="1" fill="#222"/>
                </g>
              </svg>
              {/* Webflow */}
              <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M10 19L14 5l4 14 4-14 4 14" stroke="#222" strokeWidth="2" fill="none"/>
                </g>
              </svg>
              {/* Intercom */}
              <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <rect x="10" y="5" width="60" height="14" rx="7" fill="#222"/>
                  <rect x="20" y="9" width="4" height="6" rx="2" fill="#fff"/>
                  <rect x="28" y="9" width="4" height="6" rx="2" fill="#fff"/>
                  <rect x="36" y="9" width="4" height="6" rx="2" fill="#fff"/>
                  <rect x="44" y="9" width="4" height="6" rx="2" fill="#fff"/>
                  <rect x="52" y="9" width="4" height="6" rx="2" fill="#fff"/>
                </g>
              </svg>
              {/* Zapier */}
              <svg width="80" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <circle cx="40" cy="12" r="10" stroke="#222" strokeWidth="2" fill="none"/>
                  <path d="M40 4v16M32 12h16M34.9 6.9l10.2 10.2M34.9 17.1l10.2-10.2" stroke="#222" strokeWidth="2"/>
                </g>
              </svg>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6" />
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of businesses that trust ClientFlow to manage their client relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 