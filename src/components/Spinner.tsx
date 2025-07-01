// components/Spinner.tsx
export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
}
