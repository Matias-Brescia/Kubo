import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-kubo-sm text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80 focus-visible:ring-2 focus-visible:ring-accent/50",
        secondary:
          "bg-surface-hover text-foreground hover:bg-surface-hover/80 border border-border active:bg-surface focus-visible:ring-2 focus-visible:ring-ring/50",
        ghost: "text-foreground hover:bg-surface-hover active:bg-surface focus-visible:ring-2 focus-visible:ring-ring/50",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-surface-hover active:bg-surface focus-visible:ring-2 focus-visible:ring-ring/50",
        link: "text-accent underline-offset-4 hover:underline p-0 h-auto focus-visible:ring-2 focus-visible:ring-accent/50",
        success:
          "bg-success text-white hover:bg-success/90 active:bg-success/80 focus-visible:ring-2 focus-visible:ring-success/50",
        warning:
          "bg-warning text-white hover:bg-warning/90 active:bg-warning/80 focus-visible:ring-2 focus-visible:ring-warning/50",
        danger:
          "bg-negative text-white hover:bg-negative/90 active:bg-negative/80 focus-visible:ring-2 focus-visible:ring-negative/50",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
