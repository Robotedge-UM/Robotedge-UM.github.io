import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary-dark",
        secondary:
          "bg-secondary text-secondary-foreground shadow hover:bg-secondary-dark",
        tertiary:
          "bg-tertiary text-tertiary-foreground shadow hover:bg-tertiary-dark",
        success:
          "bg-success text-success-foreground shadow hover:bg-success-dark",
        warning:
          "bg-warning text-warning-foreground shadow hover:bg-warning-dark",
        info: "bg-info text-info-foreground shadow hover:bg-info-dark",
        destructive:
          "bg-destructive text-destructive-foreground shadow hover:bg-destructive-dark",
        outline:
          "border-2 border-primary bg-transparent text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
        ghost: "text-foreground hover:bg-muted hover:text-accent",
        gradient:
          "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:from-primary-dark hover:to-secondary-dark",
        enticing:
          "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-black/50",
        link: "text-primary hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10 p-0",
      },
      rounded: {
        true: "rounded-full",
        false: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, rounded, isLoading, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {props.children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
