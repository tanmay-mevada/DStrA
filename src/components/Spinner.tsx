// components/Spinner.tsx
export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
}