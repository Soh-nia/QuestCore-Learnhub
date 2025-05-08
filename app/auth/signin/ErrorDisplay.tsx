"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  return error ? <p className="text-red-500 text-sm mb-4 text-center">{error}</p> : null;
}

export default function ErrorDisplay() {
  return (
    <Suspense fallback={<div>Loading error...</div>}>
      <ErrorContent />
    </Suspense>
  );
}