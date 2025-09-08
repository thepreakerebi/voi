"use client";

import * as React from "react";
import TextModeTop from "./text-mode-top";
import TextModeCard from "./text-mode-card";
import ChatTextarea from "./textarea";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

export default function TextMode() {
  const [value, setValue] = React.useState("");

  function handlePromptInsert(text: string) {
    setValue((v) => (v ? v + "\n\n" + text : text));
  }

  return (
    <section aria-labelledby="text-mode-heading" className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      <TextModeTop />

      <section className="mt-6 space-y-4">
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

      <form className="mt-10 grid gap-3" aria-label="Text chat form" onSubmit={(e) => e.preventDefault()}>
        <ChatTextarea value={value} onChange={(e) => setValue(e.target.value)} />
        <section className="flex items-center justify-between gap-3">
          <section className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={() => handlePromptInsert("+")}
              aria-label="Add attachment">
              +
            </Button>
            <Button type="button" variant="ghost" onClick={() => handlePromptInsert("[Dictate]")}
              aria-label="Start dictation">
              Dictate
            </Button>
          </section>
          <Button type="submit" className="rounded-full px-6">Send</Button>
        </section>
        <section className="pt-1">
          <Button type="button" variant="outline" className="w-full rounded-full justify-center" aria-label="Use voice mode">
            Use voice mode
          </Button>
        </section>
      </form>
    </section>
  );
}


