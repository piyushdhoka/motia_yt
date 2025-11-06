import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: "bg-secondary hover:bg-red-600 text-white",
            card: "shadow-2xl"
          }
        }}
        routing="path"
        path="/sign-in"
      />
    </div>
  );
}
