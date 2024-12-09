import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent border-gray bg-gray-50 text-gray font-medium hover:bg-gray-100",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        danger: "text-xs border font-medium text-red bg-red-50 border-red",
        success: "text-xs border font-medium bg-green-50 border-green text-green",
        warning: "text-xs border font-medium bg-yellow-50 border-orange text-orange",
        info: "text-xs border font-medium bg-blue-50 border-blue text-blue",
        purple: "text-xs border font-medium bg-purple-50 border-purple text-purple",
        orange: "text-xs border font-medium bg-orange-50 border-orange text-orange",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
