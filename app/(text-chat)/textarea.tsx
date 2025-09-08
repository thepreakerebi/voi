"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export default function ChatTextarea({ className, label = "Ask anything", ...props }: Props) {
  return (
    <section className="space-y-2" aria-label="Message composer">
      <label className="sr-only" htmlFor="chat-textarea">
        {label}
      </label>
      <textarea
        id="chat-textarea"
        rows={3}
        placeholder={label}
        className={cn(
          "w-full resize-none rounded-2xl border bg-background p-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          className
        )}
        {...props}
      />
    </section>
  );
}


