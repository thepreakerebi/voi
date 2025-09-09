"use client";

import Image from "next/image";

type Props = {
  userText?: string;
  aiText?: string;
};

export default function Captions({ userText, aiText }: Props) {
  return (
    <section className="h-full w-full flex items-center justify-center">
      <section
        aria-live="polite"
        aria-atomic="false"
        className="text-center space-y-6 w-full h-[42vh] md:h-full max-w-2xl"
      >
        {!userText && !aiText ? (
          <section className="h-full w-full flex items-center justify-center">
            <figure className="flex flex-col items-center gap-3">
              <Image src="/caption-unscreen.gif" alt="" width={48} height={48} />
              <figcaption className="text-muted-foreground text-base md:text-lg">
                Conversation captions will show here
              </figcaption>
            </figure>
          </section>
        ) : (
          <section className="h-full w-full overflow-y-auto space-y-6 px-2">
            {userText && (
              <article>
                <h3 className="text-base md:text-xl font-medium">You</h3>
                <p className="text-lg md:text-2xl leading-relaxed text-pretty">{userText}</p>
              </article>
            )}
            {aiText && (
              <article>
                <h3 className="text-base md:text-xl font-medium">Assistant</h3>
                <p className="text-lg md:text-2xl leading-relaxed text-pretty">{aiText}</p>
              </article>
            )}
          </section>
        )}
      </section>
    </section>
  );
}


