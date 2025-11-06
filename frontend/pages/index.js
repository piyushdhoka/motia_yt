"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "../components/HeroSection";
import SignInPrompt from "../components/SignInPrompt";
import UserProfile from "../components/UserProfile";
import ChannelForm from "../components/ChannelForm";
import { AlertCircle, Youtube, Menu, X } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const isPending = status === "loading";
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendError, setBackendError] = useState("");

  // Check backend configuration
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      setBackendError("Backend URL not configured. Set NEXT_PUBLIC_BACKEND_URL in .env.local before running.");
    }
  }, []);

  const handleGetStarted = () => {
    if (session?.user) {
      // User is authenticated, scroll to form
      document.getElementById("channel-form")?.scrollIntoView({ behavior: "smooth" });
    } else {
      // User needs to authenticate
      setShowAuthPrompt(true);
    }
  };

  const handleSignOut = () => {
    // Handle sign out logic
    setShowAuthPrompt(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-secondary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-red-600 rounded-lg flex items-center justify-center">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TitleOptimizer</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-8">
              <nav className="flex space-x-6">
                <a href="#features" className="text-gray-600 hover:text-secondary transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-600 hover:text-secondary transition-colors">
                  How it Works
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-secondary transition-colors">
                  Pricing
                </a>
              </nav>

              {/* User Profile / Sign In */}
              {session?.user ? (
                <UserProfile user={session.user} onSignOut={handleSignOut} />
              ) : (
                <button
                  onClick={() => setShowAuthPrompt(true)}
                  className="btn-primary text-sm"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#features" className="block py-2 text-gray-600 hover:text-secondary">
                  Features
                </a>
                <a href="#how-it-works" className="block py-2 text-gray-600 hover:text-secondary">
                  How it Works
                </a>
                <a href="#pricing" className="block py-2 text-gray-600 hover:text-secondary">
                  Pricing
                </a>
                {session?.user ? (
                  <div className="pt-2 border-t border-gray-100">
                    <UserProfile user={session.user} onSignOut={handleSignOut} />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthPrompt(true)}
                    className="btn-primary w-full text-sm"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-16"
      >
        {/* Hero Section */}
        <div onClick={handleGetStarted}>
          <HeroSection />
        </div>

        {/* Authentication Prompt Modal */}
        <AnimatePresence>
          {showAuthPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAuthPrompt(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                <SignInPrompt />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Channel Form Section - Only show for authenticated users */}
        {session?.user && (
          <section id="channel-form" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-responsive-3xl font-bold text-gray-900 mb-4">
                  Ready to optimize your titles?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Submit your channel information and get personalized title recommendations
                  that will help you grow your audience.
                </p>
              </div>
              <ChannelForm />
            </div>
          </section>
        )}

        {/* Backend Configuration Error */}
        {backendError && (
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Configuration Required
                </h3>
                <p className="text-red-700 mb-4">
                  {backendError}
                </p>
                <code className="bg-red-100 px-3 py-1 rounded text-sm text-red-800">
                  NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
                </code>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-responsive-3xl font-bold text-gray-900 mb-4">
                Why choose TitleOptimizer?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered technology helps you create titles that drive more views and engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Analysis",
                  description: "Advanced machine learning algorithms analyze your niche and audience to suggest optimal titles.",
                  icon: "🤖",
                },
                {
                  title: "SEO Optimization",
                  description: "Improve your search rankings with titles that are optimized for YouTube's algorithm.",
                  icon: "🔍",
                },
                {
                  title: "A/B Testing Insights",
                  description: "Get data-driven recommendations based on what works in your specific category.",
                  icon: "📊",
                },
                {
                  title: "Competitor Analysis",
                  description: "See what's working for successful channels in your niche and learn from their strategies.",
                  icon: "🎯",
                },
                {
                  title: "Trend Detection",
                  description: "Stay ahead of the curve with titles that leverage current trending topics and keywords.",
                  icon: "📈",
                },
                {
                  title: "Click-Through Rate Boost",
                  description: "Craft compelling titles that increase your CTR and drive more organic traffic.",
                  icon: "🚀",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="feature-card"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </motion.main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-red-600 rounded-lg flex items-center justify-center">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TitleOptimizer</span>
            </div>
            <p className="text-gray-400 mb-6">
              Empowering YouTube creators with data-driven title optimization
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>&copy; 2024 TitleOptimizer</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
