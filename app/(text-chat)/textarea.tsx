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
  onAssistantDelta?: (delta: string) => void;
  onAssistantDone?: (full: string) => void;
  getSessionMessages?: () => Array<{ role: "system" | "user" | "assistant"; content: string }>;
  onOpenVoice?: () => void;
};

const ChatTextarea = React.forwardRef<ChatTextareaHandle, Props>(
  ({ label = "Ask anything", onSend, onAssistantDelta, onAssistantDone, getSessionMessages, onOpenVoice }, ref) => {
    const [value, setValue] = React.useState("");

    React.useImperativeHandle(ref, () => ({
      insertText: (text: string) => setValue((v) => (v ? v + "\n\n" + text : text)),
    }));

    async function submitCurrent() {
      const trimmed = value.trim();
      if (!trimmed) return;
      onSend?.(trimmed);

      const messages = (getSessionMessages?.() ?? []).concat([{ role: "user" as const, content: trimmed }]);
      setValue("");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });
        if (!res.ok || !res.body) return;
        // Stream plain text chunks; show skeleton until first chunk arrives.
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";
        let sawFirst = false;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          full += chunk;
          onAssistantDelta?.(chunk);
          if (!sawFirst) {
            sawFirst = true;
          }
        }
        onAssistantDone?.(full);
      } catch {
        // swallow error for now; could add toast
      }
    }

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      await submitCurrent();
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void submitCurrent();
                }
              }}
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
              <Button type="button" variant="secondary" className="rounded-full gap-2 px-6" aria-label="Use voice mode" onClick={() => { onOpenVoice?.(); }}
              >
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
              <Button type="button" variant="secondary" className="rounded-full gap-2 px-5" aria-label="Voice mode" onClick={() => { onOpenVoice?.(); }}
              >
                <AudioLines className="size-5" />
                <span>Voice</span>
              </Button>
            </section>
          </section>
          <section className="pt-1 md:hidden">
            <Button type="submit" className="w-full rounded-full justify-center gap-2 h-12 text-base" aria-label="Send message">
              <ArrowUp className="size-5" />
              <span>Send</span>
            </Button>
          </section>
        </form>
      </footer>
    );
  }
);

ChatTextarea.displayName = "ChatTextarea";

export default ChatTextarea;


