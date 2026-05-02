export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`skeleton-gradient animate-shimmer rounded ${className}`}
    />
  );
}
