import { SignIn } from "@clerk/nextjs";

export default function DemoSignIn() {
  return (
    <div className="flex flex-col items-center pt-20 space-y-4">
      {/* Information for the recruiter */}
      <p className="text-gray-300 text-sm text-center">
        Use the email: <strong>recruiter+clerk_test@example.com</strong> <br />
        Password: <strong>recruiterdemo123</strong>
      </p>

      {/* SignIn Component */}
      <SignIn
        path="/demo"
        routing="path"
        initialValues={{ emailAddress: "recruiter+clerk_test@example.com" }}
        appearance={{
          elements: {
            card: "bg-gray-100 shadow-lg", // Add shadow for better visibility
          },
        }}
      />
    </div>
  );
}
