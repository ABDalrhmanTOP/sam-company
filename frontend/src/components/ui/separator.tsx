import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export function Separator({ orientation = "horizontal", decorative = true, className, ...props }: SeparatorProps) {
  return (
    <div
      role={decorative ? "presentation" : "separator"}
      aria-orientation={orientation}
      className={
        orientation === "vertical"
          ? `w-px h-full bg-border ${className ?? ""}`
          : `h-px w-full bg-border ${className ?? ""}`
      }
      {...props}
    />
  );
}
