import { ClerkProvider } from '@clerk/nextjs';

interface ClerkLayoutProps {
  children: React.ReactNode;
}

export function ClerkLayout({ children }: ClerkLayoutProps): JSX.Element {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.warn('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set');
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey || ''}
      appearance={{
        elements: {
          formButtonPrimary: "bg-secondary hover:bg-red-600 text-white",
          card: "glass-card"
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}