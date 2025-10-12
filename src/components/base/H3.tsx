import { ReactNode } from "react";

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-primary leading-tighter text-lg font-semibold text-balance ">
        {children}
    </h3>
  );
}
