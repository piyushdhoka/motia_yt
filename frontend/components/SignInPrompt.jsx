"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Chrome, Lock, Shield, Clock } from "lucide-react";
import { signInWithGoogle } from "@/lib/auth-client";

const SignInPrompt = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(66, 133, 244, 0.3)",
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-md mx-auto"
    >
      <div className="glass-card p-8 text-center">
        {/* Sign In Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to Continue
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Connect your Google account to access the YouTube title optimizer and start improving your video performance.
          </p>
        </motion.div>

        {/* Google Sign In Button */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                <span>Continue with Google</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-message mb-4"
          >
            {error}
          </motion.div>
        )}

        {/* Security Indicators */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secure OAuth authentication</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Stay signed in for 7 days</span>
          </div>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          variants={itemVariants}
          className="mt-6 pt-6 border-t border-gray-100"
        >
          <p className="text-xs text-gray-400 leading-relaxed">
            By signing in, you agree to our terms of service and privacy policy.
            We never share your data with third parties and only access basic profile information.
          </p>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          variants={itemVariants}
          className="mt-4 flex items-center justify-center space-x-2"
        >
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">Trusted by 1000+ creators</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignInPrompt;