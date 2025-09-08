"use client";

import * as React from "react";
import TextModeTop from "./text-mode-top";
import TextModeCard from "./text-mode-card";
import ChatTextarea, { ChatTextareaHandle } from "./textarea";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

export default function TextMode() {
  const composerRef = React.useRef<ChatTextareaHandle>(null);
  function handlePromptInsert(text: string) {
    composerRef.current?.insertText(text);
  }

  return (
    <section aria-labelledby="text-mode-heading" className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      <TextModeTop />

      <section className="mt-6 w-full mx-auto space-y-4">
        <TextModeCard src="/animated-luggage-unscreen.gif" alt="Travel">
          Plan a 3-day Lagos itinerary on a moderate budget
        </TextModeCard>
        <TextModeCard src="/mail-unscreen.gif" alt="Email">
          Write a polite 70-words email to my manager requesting remote work, state the reason.
        </TextModeCard>
        <section className="flex justify-center">
          <Button type="button" variant="outline" className="rounded-full px-5">
            <Layers className="size-4" />
            See more example prompts
          </Button>
        </section>
      </section>

      <ChatTextarea ref={composerRef} onSend={() => {}} />
    </section>
  );
}


