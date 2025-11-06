"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Youtube, Mail, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { FormData, ApiResponse } from "@/lib/types";

const ChannelForm = () => {
  const [formData, setFormData] = useState<FormData>({
    channelName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!formData.channelName.trim()) {
      setError("Please enter your channel name");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      if (!backendUrl) {
        throw new Error("Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL in .env.local");
      }

      // Clean up URL and construct endpoint
      const cleanUrl = backendUrl.replace(/\/$/, '');
      const endpoint = `${cleanUrl}/api/submit`;
      
      console.log('Submitting to:', endpoint);
      
      // Backend expects 'channel' not 'channelName'
      const payload = {
        channel: formData.channelName,
        email: formData.email
      };
      
      console.log('Payload:', payload);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Backend error: ${response.status} - ${errorText || 'Please check if the backend is running'}`);
      }

      const result: ApiResponse = await response.json();
      console.log('Response data:', result);

      if (result.success) {
        setIsSuccess(true);
        setFormData({ channelName: "", email: "" });

        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit. Please try again.";
      setError(errorMessage);
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(255, 0, 0, 0.1)",
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(255, 0, 0, 0.3)",
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  if (isSuccess) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="max-w-lg mx-auto"
      >
        <div className="glass-card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Analysis Started!
          </h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            We've received your channel information and will analyze your YouTube titles.
            You'll receive an email with your personalized recommendations soon.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Next steps:</strong> Check your email for the analysis results within 24 hours.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="max-w-lg mx-auto"
    >
      <div className="glass-card p-8">
        {/* Form Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Youtube className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Start Your Analysis
          </h2>
          <p className="text-gray-600">
            Enter your channel details to get personalized title optimization
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-message mb-6 flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Channel Name Input */}
          <motion.div variants={inputVariants} whileFocus="focus">
            <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 mb-2">
              Channel Name
            </label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="channelName"
                name="channelName"
                value={formData.channelName}
                onChange={handleInputChange}
                placeholder="Enter your YouTube channel name"
                className="form-input pl-12"
                disabled={isLoading}
                required
              />
            </div>
          </motion.div>

          {/* Email Input */}
          <motion.div variants={inputVariants} whileFocus="focus">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="form-input pl-12"
                disabled={isLoading}
                required
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            type="submit"
            disabled={isLoading}
            className="btn-youtube w-full text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Channel...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Start Analysis
              </>
            )}
          </motion.button>
        </form>

        {/* Trust Indicators */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-secondary mb-1">24h</div>
              <div className="text-xs text-gray-500">Avg. Analysis Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary mb-1">95%</div>
              <div className="text-xs text-gray-500">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary mb-1">Free</div>
              <div className="text-xs text-gray-500">No Cost Analysis</div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Your data is secure and will only be used for analysis purposes.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelForm;