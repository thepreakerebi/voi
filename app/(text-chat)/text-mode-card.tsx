"use client";

import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export default function TextModeCard({ src, alt, children, onClick }: Props) {
  return (
    <article className="w-full flex justify-center items-center" aria-label={typeof children === "string" ? children : "Prompt"}>
      <Button
        type="button"
        variant="ghost"
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          "w-full max-w-xl h-auto min-h-14 bg-secondary20 border-1 dark:border-0 dark:bg-secondary/20 justify-start gap-3 rounded-xl px-4 py-5 whitespace-normal text-left"
        )}
        onClick={onClick}
      >
        <figure className="flex items-center gap-3 w-full min-w-0">
          <Image src={src} alt={alt} width={36} height={36} className="rounded shrink-0" />
          <figcaption className="font-normal leading-snug text-sm md:text-base break-words text-pretty">
            {children}
          </figcaption>
        </figure>
      </Button>
    </article>
  );
}


