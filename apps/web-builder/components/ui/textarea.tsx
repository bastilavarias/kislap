import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground focus-visible:border-primary aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-20 w-full rounded-none border-2 border-black bg-background px-3 py-2 text-base font-semibold text-foreground shadow-none transition-[color,box-shadow] outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
