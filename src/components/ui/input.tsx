import * as React from "react"
import { cn } from "@/lib/utils"
import { useLandingPageSettings } from "@/lib/hooks/useLandingPageSettings"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    const { settings } = useLandingPageSettings()

    return (
      <div className="relative">
        {icon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full"
            style={{
              backgroundColor: `${settings?.primaryColor || "#3B82F6"}33`,
            }}
          >
            <div
              style={{ color: settings?.primaryColor || "#3B82F6" }}
              className="w-3.5 h-3.5 flex items-center justify-center"
            >
              {icon}
            </div>
          </div>
        )}
        <input
          type={type}
          className={cn(
            "w-full py-3 transition-all duration-300 rounded-xl shadow-sm bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50",
            icon ? "pl-12 pr-4" : "px-4",
            error && "border-red-500 focus:ring-red-200",
            className
          )}
          style={
            !error
              ? ({
                  borderWidth: "1px",
                  borderColor: settings?.primaryColor
                    ? `${settings.primaryColor}40`
                    : "#3B82F640",
                  "--tw-ring-color": settings?.primaryColor
                    ? `${settings.primaryColor}80`
                    : "#3B82F680",
                } as React.CSSProperties)
              : ({
                  borderWidth: "1px",
                  "--tw-ring-color": "#ef444480",
                } as React.CSSProperties)
          }
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
