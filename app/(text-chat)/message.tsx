"use client";

type Props = {
  role: "user" | "assistant";
  content: string;
};

export default function Message({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <article aria-label={isUser ? "You" : "Zig AI"} className="w-full">
      <div className={isUser ? "flex justify-end" : "flex justify-start"}>
        <div
          className={
            (isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary/70 dark:bg-secondary/20 text-foreground") +
            " max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap leading-relaxed"
          }
        >
          {content}
        </div>
      </div>
    </article>
  );
}


