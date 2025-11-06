# YouTube Title Optimizer - Frontend Setup

## Overview
This is a Next.js application with Clerk authentication, TypeScript, and Tailwind CSS. The application provides a modern landing page with Google OAuth authentication for YouTube title optimization.

## Prerequisites
- Node.js 18+
- npm or yarn
- Clerk account (https://dashboard.clerk.com/)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Clerk Authentication

1. **Create a Clerk Account:**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application

2. **Configure Google OAuth:**
   - In your Clerk dashboard, go to "User & Authentication" → "Social Connections"
   - Enable Google OAuth
   - Add your Google OAuth credentials

3. **Get Clerk Keys:**
   - Go to "API Keys" in your Clerk dashboard
   - Copy your Publishable Key and Secret Key

4. **Set Environment Variables:**
   Create a `.env.local` file:
   ```env
   # Clerk Authentication Configuration
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_clerk_publishable_key
   CLERK_SECRET_KEY=sk_test_your_actual_clerk_secret_key

   # Backend API Configuration
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
   ```

### 3. Configure Google OAuth (Google Console)

1. **Go to Google Cloud Console:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search and enable "Google+ API"

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Select "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000`
     - `https://your-domain.com` (for production)

4. **Get Google OAuth Credentials:**
   - Copy your Client ID and Client Secret
   - Add them to your Clerk dashboard under "User & Authentication" → "Social Connections"

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## Project Structure

```
frontend/
├── components/           # React components (TypeScript)
│   ├── HeroSection.tsx
│   ├── SignInPrompt.tsx
│   ├── UserProfile.tsx
│   └── ChannelForm.tsx
├── lib/                 # Utilities and configurations
│   ├── clerk.tsx        # Clerk provider setup
│   └── types.ts          # TypeScript type definitions
├── pages/               # Next.js pages (TypeScript)
│   ├── _app.tsx
│   └── index.tsx
├── styles/              # Global styles
│   └── globals.css
├── .env.local           # Environment variables (not committed)
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── next.config.js       # Next.js configuration
```

## Features Implemented

### ✅ Authentication
- **Clerk Integration**: Complete OAuth authentication system
- **Google OAuth**: One-click Google sign-in
- **User Sessions**: Persistent user sessions
- **User Profiles**: Display user information with avatars

### ✅ Landing Page
- **Modern Design**: Clean, professional interface
- **Microinteractions**: Smooth animations and hover effects
- **Responsive Design**: Mobile-first approach
- **YouTube Theme**: Red (#ff0000) secondary color scheme

### ✅ Components
- **HeroSection**: Animated hero with feature cards
- **SignInPrompt**: Authentication modal with Google OAuth
- **UserProfile**: User profile dropdown with sign-out
- **ChannelForm**: Enhanced form with validation and animations

### ✅ TypeScript
- **Full Type Safety**: All files converted to TypeScript
- **Type Definitions**: Custom types for forms, API responses, and user data
- **Strict Configuration**: Strict TypeScript settings for better code quality

## Environment Variables

### Development (.env.local)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### Production (.env.production)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_key
CLERK_SECRET_KEY=sk_live_your_production_clerk_secret_key
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api-domain.com
```

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically

### Docker
```bash
docker build -t youtube-optimizer-frontend .
docker run -p 3000:3000 --env-file .env.production youtube-optimizer-frontend
```

## Troubleshooting

### Common Issues

**Build Errors:**
- Ensure all environment variables are set
- Check that Clerk keys are valid
- Verify Google OAuth is configured in Clerk dashboard

**Authentication Issues:**
- Check Google OAuth redirect URIs match your domain
- Verify Clerk keys are correct
- Ensure Google OAuth is enabled in Clerk dashboard

**TypeScript Errors:**
- All files should be .tsx or .ts extensions
- Check tsconfig.json configuration
- Ensure proper imports are used

## Getting Help

1. Check the [Clerk Documentation](https://clerk.com/docs)
2. Review [Next.js TypeScript Guide](https://nextjs.org/docs/basic-features/typescript)
3. Ensure all environment variables are properly configured

## License

This project is part of the YouTube Title Optimizer application.