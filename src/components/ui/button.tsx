import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Jedna visina i jedan radijus za sve kontrole. Zelena (default) je rezervisana za
// glavnu radnju na ekranu; sve ostalo je tiho.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[0.9375rem] font-semibold cursor-pointer transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:stroke-[1.6]",
  {
    variants: {
      variant: {
        default: "bg-action text-action-foreground hover:bg-action-hover",
        dark: "bg-foreground text-background hover:bg-indigo",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-line-strong bg-transparent text-foreground hover:border-foreground hover:bg-secondary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-paper-3",
        ghost: "font-medium text-foreground hover:bg-secondary",
        link: "h-auto min-h-0 px-0 font-medium text-foreground underline decoration-1 underline-offset-4 hover:text-action-text",
        fashion: "font-medium bg-secondary text-foreground hover:bg-paper-3",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-sm",
        lg: "h-12 px-6",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp data-ui-button="" data-variant={variant} className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
