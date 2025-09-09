"use client";

import Image from "next/image";
import Message from "../(text-chat)/message";

type Props = {
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
};

export default function Captions({ messages = [] }: Props) {
  return (
    <section className="h-full w-full overflow-hidden">
      <section
        aria-live="polite"
        aria-atomic="false"
        className="mx-auto flex h-[42vh] md:h-full min-h-0 w-full max-w-2xl flex-col overflow-hidden text-center"
      >
        {messages.length === 0 ? (
          <section className="flex h-full w-full items-center justify-center">
            <figure className="flex flex-col items-center gap-3">
              <Image src="/caption-unscreen.gif" alt="" width={48} height={48} />
              <figcaption className="text-muted-foreground text-base md:text-lg">
                Conversation captions will show here
              </figcaption>
            </figure>
          </section>
        ) : (
          <section className="min-h-0 overflow-y-auto space-y-4 text-left p-2">
            {messages.map((m, i) => (
              <Message key={i} role={m.role} content={m.content} />
            ))}
          </section>
        )}
      </section>
    </section>
  );
}


