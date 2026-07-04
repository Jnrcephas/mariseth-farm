import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, value, ...props }: React.ComponentProps<"input">) {
  // A large number of forms in this app create react-hook-form instances with
  // `defaultValues: {}`, so `field.value` (spread in via `{...field}`) starts
  // out as `undefined` and only becomes a string once the user types or the
  // browser autofills it. That undefined -> string transition is exactly
  // what triggers React's "a component is changing an uncontrolled input to
  // be controlled" warning. Rather than edit defaultValues in every one of
  // those forms individually, default to an empty string here whenever this
  // is clearly meant to be a controlled input (i.e. an onChange handler was
  // passed) - checkboxes/radios/files use `checked`/browser-managed state
  // instead of `value`, so they're excluded.
  const isControllable = type !== "checkbox" && type !== "radio" && type !== "file";
  const resolvedValue =
    isControllable && value === undefined && props.onChange ? "" : value;

  return (
    <input
      type={type}
      data-slot="input"
      value={resolvedValue}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-[38px] w-full min-w-0 rounded-md border bg-slate-50 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-green-600 focus-visible:ring-green-600/50 focus-visible:ring-[2px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
