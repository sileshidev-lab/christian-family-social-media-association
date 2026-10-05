import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-transparent px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        outline: "text-foreground border-border",
        success: "bg-earth-greenlight/30 text-foreground border-earth-greenlight/50",
        warning: "bg-secondary/25 text-foreground border-secondary/40",
        destructive: "bg-destructive/25 text-foreground border-destructive/40"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
