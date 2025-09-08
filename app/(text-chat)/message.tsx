"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  role: "user" | "assistant";
  content: string;
};

export default function Message({ role, content }: Props) {
  const isUser = role === "user";
  const normalized = React.useMemo(() => {
    // Promote lines like `1. Title` to headings and ensure blank lines around them
    const lines = content.split("\n");
    const out: string[] = [];
    for (const raw of lines) {
      const line = raw.replace(/\s+$/g, "");
      if (/^\d+\.\s+.+$/.test(line)) {
        if (out.length && out[out.length - 1] !== "") out.push("");
        out.push(`### ${line}`);
        out.push("");
      } else {
        out.push(line);
      }
    }
    return out.join("\n");
  }, [content]);
  return (
    <article aria-label={isUser ? "You" : "Zig AI"} className="w-full">
      <section className={isUser ? "flex justify-end" : "flex justify-start"}>
        <section
          className={
            (isUser
              ? "bg-neutral-200 dark:bg-neutral-900 text-foreground"
              : "text-foreground") +
            " max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed"
          }
        >
          {isUser ? (
            <span className="whitespace-pre-wrap">{content}</span>
          ) : (
            <div className="prose prose-base md:prose-lg dark:prose-invert prose-headings:font-semibold prose-h3:mt-5 prose-h3:mb-3 prose-p:my-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-1.5 prose-strong:font-semibold">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{normalized}</ReactMarkdown>
            </div>
          )}
        </section>
      </section>
    </article>
  );
}


