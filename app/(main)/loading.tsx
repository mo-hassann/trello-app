import Spinner from "@/components/spinner";
import React from "react";

export default function loadingPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner />
    </div>
  );
}
