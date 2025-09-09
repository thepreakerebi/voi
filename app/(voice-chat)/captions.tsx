"use client";

import Image from "next/image";
import Message from "../(text-chat)/message";

type Props = {
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
};

export default function Captions({ messages = [] }: Props) {
  return (
    <section className="h-full w-full flex items-center justify-center">
      <section
        aria-live="polite"
        aria-atomic="false"
        className="text-center space-y-6 w-full h-[42vh] md:h-full max-w-2xl"
      >
        {messages.length === 0 ? (
          <section className="h-full w-full flex items-center justify-center">
            <figure className="flex flex-col items-center gap-3">
              <Image src="/caption-unscreen.gif" alt="" width={48} height={48} />
              <figcaption className="text-muted-foreground text-base md:text-lg">
                Conversation captions will show here
              </figcaption>
            </figure>
          </section>
        ) : (
          <section className="h-full w-full overflow-y-auto space-y-4 text-left px-2">
            {messages.map((m, i) => (
              <Message key={i} role={m.role} content={m.content} />
            ))}
          </section>
        )}
      </section>
    </section>
  );
}


