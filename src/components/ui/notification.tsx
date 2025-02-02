"use client"

import React, { useEffect } from "react"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const notificationVariants = cva("fixed top-4 right-4 w-full max-w-sm overflow-hidden rounded-lg shadow-lg", {
  variants: {
    variant: {
      default: "bg-white",
      error: "bg-red-50",
      success: "bg-green-50",
      info: "bg-blue-50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

const iconVariants = cva("h-5 w-5", {
  variants: {
    variant: {
      default: "text-gray-400",
      error: "text-red-400",
      success: "text-green-400",
      info: "text-blue-400",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  message: string
  onClose: () => void
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ className, variant, message, onClose, ...props }, ref) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto-close after 5 seconds
      return () => clearTimeout(timer)
    }, [onClose])

    const Icon = variant === "error" ? AlertCircle : variant === "success" ? CheckCircle : Info

    return (
      <div
        ref={ref}
        className={cn(
          notificationVariants({ variant }),
          "animate-in slide-in-from-top-full fade-in duration-300",
          className,
        )}
        {...props}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={cn(iconVariants({ variant }))} aria-hidden="true" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-xs md:text-sm font-medium text-gray-900">{message}</p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
             <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-stone-600 focus:outline-none flex items-center justify-center"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  },
)
Notification.displayName = "Notification"

export { Notification }
