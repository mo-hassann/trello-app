"use client";

export default function ErrorComponent({ error }: { error: Error }) {
  return <div>ErrorComponent: {error.message}</div>;
}
