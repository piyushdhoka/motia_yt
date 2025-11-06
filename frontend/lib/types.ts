export interface FormData {
  channelName: string;
  email: string;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  emailAddress: string;
  imageUrl?: string;
  username?: string;
}

export interface Session {
  user: User;
  expiresAt: number;
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