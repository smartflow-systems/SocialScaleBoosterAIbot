import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("glass-panel", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";

export { GlassPanel };
