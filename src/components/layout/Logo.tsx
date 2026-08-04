export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2 L21 6.5 L21 17.5 L12 22 L3 17.5 L3 6.5 Z"
        className="stroke-border"
        strokeWidth="1"
        fill="hsl(var(--surface-hover))"
      />
      <path d="M12 2 L21 6.5 L12 11 L3 6.5 Z" fill="hsl(var(--accent))" />
      <path
        d="M12 11 L21 6.5 L21 17.5 L12 22 Z"
        fill="hsl(var(--accent))"
        fillOpacity="0.55"
      />
      <path
        d="M12 11 L3 6.5 L3 17.5 L12 22 Z"
        fill="hsl(var(--accent))"
        fillOpacity="0.8"
      />
    </svg>
  );
}
