import * as React from "react";

import { cn, tailwind } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const commonStyles = tailwind`rounded-md text-sm placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50`;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    if (type === "file")
      return (
        <input
          type="file"
          className={cn(
            commonStyles,
            "text-muted-foreground/70",
            "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0",
            "file:text-sm file:font-semibold file:bg-primary/10 file:text-primary/60 hover:file:bg-primary/[15%]"
          )}
          ref={ref}
          {...props}
        />
      );

    return (
      <input
        type={type}
        className={cn(
          commonStyles,
          "h-10",
          "flex w-full bg-background px-3 py-1",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "border border-input",
          "transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
