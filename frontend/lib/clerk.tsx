import { ClerkProvider } from '@clerk/nextjs';

interface ClerkLayoutProps {
  children: React.ReactNode;
}

export function ClerkLayout({ children }: ClerkLayoutProps) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-red-500 hover:bg-red-600 text-white",
          card: "shadow-xl",
          footerAction: "hidden"
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}