"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, LogOut, History, Settings, ChevronDown } from "lucide-react";
import { User as UserType } from "@/lib/types";

interface UserProfileProps {
  user: UserType;
  onSignOut: () => void;
}

const UserProfile = ({ user, onSignOut }: UserProfileProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = () => {
    onSignOut();
    setIsDropdownOpen(false);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
      },
    },
  };

  const profileVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2,
      },
    },
  };

  const menuItems = [
    {
      icon: History,
      label: "Analysis History",
      action: () => console.log("History clicked"),
      color: "text-blue-600",
    },
    {
      icon: Settings,
      label: "Settings",
      action: () => console.log("Settings clicked"),
      color: "text-gray-600",
    },
    {
      icon: LogOut,
      label: "Sign Out",
      action: handleSignOut,
      color: "text-red-600",
    },
  ];

  return (
    <div className="relative">
      {/* Profile Button */}
      <motion.div
        variants={profileVariants}
        whileHover="hover"
        className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100 cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {/* User Avatar */}
        <div className="relative">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl || ''}
              alt={user.firstName || user.username || "User"}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-red-600 rounded-full flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* User Info */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-900 truncate max-w-32">
            {user.firstName || user.username || "User"}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-32">
            {user.primaryEmailAddress?.emailAddress || user.emailAddress || ""}
          </p>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </motion.div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />

          {/* Dropdown Content */}
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center space-x-3">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl || ''}
                    alt={user.firstName || user.username || "User"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-red-600 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.firstName || user.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {user.primaryEmailAddress?.emailAddress || user.emailAddress || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      item.action();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg bg-gray-50 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                Signed in with Google • Session expires in 7 days
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default UserProfile;