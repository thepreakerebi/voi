"use client";

type Props = {
  userText?: string;
  aiText?: string;
};

export default function Captions({ userText, aiText }: Props) {
  return (
    <section className="h-[50vh] md:h-[70vh] flex items-center justify-center">
      <section className="text-center space-y-4 w-full max-w-2xl">
        <div aria-live="polite" className="min-h-10 text-muted-foreground">
          {(!userText && !aiText) && <span>Conversation captions will show here</span>}
        </div>
        {userText && (
          <div>
            <p className="text-base md:text-xl font-medium">You</p>
            <p className="text-lg md:text-2xl leading-relaxed">{userText}</p>
          </div>
        )}
        {aiText && (
          <div>
            <p className="text-base md:text-xl font-medium">Assistant</p>
            <p className="text-lg md:text-2xl leading-relaxed">{aiText}</p>
          </div>
        )}
      </section>
    </section>
  );
}


