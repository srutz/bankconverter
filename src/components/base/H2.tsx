import { ReactNode } from "react";

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-primary leading-tighter max-w-2xl text-2xl font-semibold text-balance ">
        {children}
    </h2>
  );
}
