"use client";

import ErrorComponent from "@/components/error-component";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center h-full">
      <ErrorComponent error={error} />
    </div>
  );
}
