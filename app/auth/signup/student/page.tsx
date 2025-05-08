import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner";
import StudentSignUp from "./StudentSignUp";

export const dynamic = "force-dynamic";

// Server component to wrap the client component in Suspense
export default function InstructorSignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
          <Spinner />
        </div>
      }
    >
      <StudentSignUp />
    </Suspense>
  );
}