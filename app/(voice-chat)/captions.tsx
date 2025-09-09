"use client";

import Image from "next/image";

type Props = {
  userText?: string;
  aiText?: string;
};

export default function Captions({ userText, aiText }: Props) {
  return (
    <section className="h-[50vh] md:h-[70vh] flex items-center justify-center">
      <section aria-live="polite" aria-atomic="false" className="text-center space-y-6 w-full max-w-2xl">
        {!userText && !aiText ? (
          <figure className="mx-auto flex flex-col items-center gap-3">
            <Image src="/caption-unscreen.gif" alt="" width={48} height={48} />
            <figcaption className="text-muted-foreground text-base md:text-lg">
              Conversation captions will show here
            </figcaption>
          </figure>
        ) : (
          <>
            {userText && (
              <article>
                <h3 className="text-base md:text-xl font-medium">You</h3>
                <p className="text-lg md:text-2xl leading-relaxed">{userText}</p>
              </article>
            )}
            {aiText && (
              <article>
                <h3 className="text-base md:text-xl font-medium">Assistant</h3>
                <p className="text-lg md:text-2xl leading-relaxed">{aiText}</p>
              </article>
            )}
          </>
        )}
      </section>
    </section>
  );
}


