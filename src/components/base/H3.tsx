import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function H3({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-primary leading-tighter text-lg font-semibold text-balance",
        className,
      )}
    >
      {children}
    </h3>
  );
}
