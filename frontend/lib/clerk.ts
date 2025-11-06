import { ClerkProvider } from '@clerk/nextjs';

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkLayout({ children }: ClerkProviderProps) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      {children}
    </ClerkProvider>
  );
}