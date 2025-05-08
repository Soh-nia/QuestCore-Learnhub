import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center px-4 py-10">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-600 dark:text-neutral-300 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-500 dark:text-neutral-400 mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-lime-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-lime-700 dark:hover:bg-lime-500"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}