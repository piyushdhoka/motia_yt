import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: "bg-secondary hover:bg-red-600 text-white",
            card: "shadow-2xl"
          }
        }}
        routing="path"
        path="/sign-up"
      />
    </div>
  );
}
