import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export default function Card({
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}