import { User as ClerkUser } from '@clerk/nextjs/server';

export interface FormData {
  channelName: string;
  email: string;
}

export interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: string | null;
  imageUrl?: string | null;
  username?: string | null;
  primaryEmailAddress?: {
    emailAddress: string;
  } | null;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}