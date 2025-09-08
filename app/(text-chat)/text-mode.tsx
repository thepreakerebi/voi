"use client";

import * as React from "react";
import TextModeTop from "./text-mode-top";
import TextModeCard from "./text-mode-card";
import ChatTextarea, { ChatTextareaHandle } from "./textarea";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import Message from "./message";
import { Skeleton } from "@/components/ui/skeleton";

export default function TextMode() {
  const composerRef = React.useRef<ChatTextareaHandle>(null);
  function handlePromptInsert(text: string) {
    composerRef.current?.insertText(text);
  }

  const [messages, setMessages] = React.useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isAssistantLoading, setIsAssistantLoading] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement | null>(null);

  function scrollToBottom(smooth = true) {
    endRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }

  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length, isAssistantLoading]);

  return (
    <section aria-labelledby="text-mode-heading" className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      {messages.length === 0 && (
        <>
          <TextModeTop />

          <section className="mt-6 w-full space-y-4">
            <TextModeCard
              src="/animated-luggage-unscreen.gif"
              alt="Travel"
              onClick={() => handlePromptInsert("Plan a 3-day Lagos itinerary on a moderate budget")}
            >
              Plan a 3-day Lagos itinerary on a moderate budget
            </TextModeCard>
            <TextModeCard
              src="/mail-unscreen.gif"
              alt="Email"
              onClick={() =>
                handlePromptInsert(
                  "Write a polite 70-words email to my manager requesting remote work, state the reason."
                )
              }
            >
              Write a polite 70-words email to my manager requesting remote work, state the reason.
            </TextModeCard>
            <section className="flex justify-center">
              <Button type="button" variant="outline" className="rounded-full px-5">
                <Layers className="size-4" />
                See more example prompts
              </Button>
            </section>
          </section>
        </>
      )}

      <section aria-live="polite" className="mt-6 mb-36 space-y-4">
        {messages.map((m, i) => (
          <Message key={i} role={m.role} content={m.content} />
        ))}
        {isAssistantLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <article aria-hidden className="w-full">
            <section className="flex justify-start">
              <section className="bg-secondary/50 dark:bg-secondary/20 rounded-2xl px-4 py-3 max-w-[80%]">
                <section className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-52" />
                </section>
              </section>
            </section>
          </article>
        )}
        <section ref={endRef} />  
      </section>

      <ChatTextarea
        ref={composerRef}
        onSend={(text) => {
          setMessages((prev) => [...prev, { role: "user", content: text }]);
          setIsAssistantLoading(true);
          scrollToBottom(false);
        }}
        onAssistantDelta={(delta) =>
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== "assistant") return [...prev, { role: "assistant", content: delta }];
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: last.content + delta };
            return updated;
          })
        }
        onAssistantDone={(full) =>
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== "assistant") return [...prev, { role: "assistant", content: full }];
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: full };
            setIsAssistantLoading(false);
            return updated;
          })
        }
        getSessionMessages={() => messages}
      />
    </section>
  );
}


