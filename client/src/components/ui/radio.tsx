import * as React from "react"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const Radio = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <div className="relative h-5 w-5">
      <input
        type="radio"
        className={cn(
          "peer absolute inset-0 cursor-pointer opacity-0",
          className
        )}
        ref={ref}
        {...props}
      />
      <div className="flex h-full w-full items-center justify-center rounded-full border border-input ring-offset-background transition-colors peer-checked:border-primary peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
        <Circle className="h-3 w-3 text-primary opacity-0 transition-opacity peer-checked:opacity-100" />
      </div>
    </div>
  )
})
Radio.displayName = "Radio"

export { Radio }