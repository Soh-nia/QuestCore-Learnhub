import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner";
import SignInClient from "./SignIn";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
          <Spinner />
        </div>
      }
    >
      <SignInClient />
    </Suspense>
  );
}