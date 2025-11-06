import { ClerkProvider } from '@clerk/nextjs';

interface ClerkLayoutProps {
  children: React.ReactNode;
}

export function ClerkLayout({ children }: ClerkLayoutProps) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
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