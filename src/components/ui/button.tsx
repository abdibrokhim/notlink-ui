import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#44403C] text-[#FFFFFF] shadow hover:bg-[#44403C]/90",
        destructive: "bg-[#FFFFFF] text-[#131418] hover:bg-[#f9fafb]/90",
        outline: "bg-white hover:text-white px-2 py-1 sm:px-2 sm:py-2 rounded-md sm:rounded-lg bg-opacity-50 mr-2 border border-[#44403C]/90 text-xs sm:text-sm w-auto whitespace-nowrap cursor-pointer hover:bg-opacity-90 hover:bg-[#44403C]/90 hover:border-[#44403C]/90 active:bg-opacity-70 transition-all duration-100 select-none",
        secondary: "rounded-md text-[#FFFFFF] shadow bg-[#44403C]/90 hover:bg-[#44403C]",
        ghost: "bg-transparent",
        link: "text-[#131418] bg-[#f9fafb]/90",
      },
      size: {
        default: "h-9 p-3",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
