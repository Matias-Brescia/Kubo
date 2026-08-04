import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-kubo-sm border bg-surface-hover text-sm text-foreground transition-all duration-200 placeholder:text-muted focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      inputSize: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-3.5",
        lg: "h-11 px-4",
      },
      error: {
        true: "border-negative focus-visible:ring-2 focus-visible:ring-negative/50 focus-visible:border-negative",
        false:
          "border-border focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring",
      },
    },
    defaultVariants: {
      inputSize: "md",
      error: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize, error, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(inputVariants({ inputSize, error }), className)}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input, inputVariants };
