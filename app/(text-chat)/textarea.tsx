"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Mic, ArrowUp, AudioLines } from "lucide-react";

export type ChatTextareaHandle = {
  insertText: (text: string) => void;
};

type Props = {
  label?: string;
  onSend?: (text: string) => void;
};

const ChatTextarea = React.forwardRef<ChatTextareaHandle, Props>(
  ({ label = "Ask anything", onSend }, ref) => {
    const [value, setValue] = React.useState("");

    React.useImperativeHandle(ref, () => ({
      insertText: (text: string) => setValue((v) => (v ? v + "\n\n" + text : text)),
    }));

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed) return;
      onSend?.(trimmed);
      setValue("");
    }

    return (
      <footer className="fixed inset-x-0 bottom-0 z-40 md:py-2">
        <form
          aria-label="Text chat form"
          onSubmit={handleSubmit}
          className="mx-auto bg-background grid max-w-3xl gap-3 px-4 py-4 rounded-[1.5rem]"
        >
          <section className="space-y-2" aria-label="Message composer">
            <label className="sr-only" htmlFor="chat-textarea">
              {label}
            </label>
            <textarea
              id="chat-textarea"
              rows={3}
              placeholder={label}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={cn(
                "w-full resize-none rounded-2xl border bg-background p-4 text-base outline-none border-none focus-visible:border-none",
              )}
            />
          </section>
          <section className="flex items-center justify-between gap-3">
            <section className="flex items-center gap-3">
              <Button type="button" variant="ghost" aria-label="Add attachment">
                <Plus className="size-5" />
              </Button>
            </section>
            <section className="hidden md:flex items-center gap-3">
              <Button type="button" variant="ghost" aria-label="Start dictation" className="gap-2">
                <Mic className="size-5" />
                <span>Dictate</span>
              </Button>
              <Button type="button" variant="secondary" className="rounded-full gap-2 px-6" aria-label="Use voice mode">
                <AudioLines className="size-5" />
                <span>Use voice mode</span>
              </Button>
              <Button type="submit" className="rounded-full gap-2 px-6">
                <ArrowUp className="size-5" />
                <span>Send</span>
              </Button>
            </section>
            <section className="md:hidden flex items-center gap-3">
              <Button type="button" variant="ghost" aria-label="Start dictation" className="gap-2">
                <Mic className="size-5" />
                <span>Dictate</span>
              </Button>
              <Button type="submit" className="rounded-full gap-2 px-6">
                <ArrowUp className="size-5" />
                <span>Send</span>
              </Button>
            </section>
          </section>
          <section className="pt-1 md:hidden">
            <Button type="button" variant="secondary" className="w-full rounded-full justify-center gap-2" aria-label="Use voice mode">
              <AudioLines className="size-5" />
              <span>Use voice mode</span>
            </Button>
          </section>
        </form>
      </footer>
    );
  }
);

ChatTextarea.displayName = "ChatTextarea";

export default ChatTextarea;


