import { SignupForm } from "@/components/signup-form";

export default function Page() {
  return (
    <div className="flex items-center justify-center my-auto mx-auto h-[calc(100vh-3.8rem)]">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
