import type { ReactNode } from "react";

interface EyebrowPillProps {
  text: string;
  icon?: ReactNode;
  className?: string;
}

export default function EyebrowPill({ text, icon, className = "" }: EyebrowPillProps) {
  return (
    <span
      className={`iso-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${className}`}
      style={{
        borderColor: "var(--border-hi)",
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        color: "var(--accent)",
      }}
    >
      {icon ? <span className="inline-flex items-center" aria-hidden>{icon}</span> : null}
      <span>{text}</span>
    </span>
  );
}
