"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MicOff, X, ArrowLeftRight } from "lucide-react";

type Props = {
  onCaptionUpdate?: (user?: string, ai?: string) => void;
  onClose?: () => void;
};

export default function Voices({ onCaptionUpdate, onClose }: Props) {
  return (
    <section className="md:static fixed inset-x-0 bottom-0 z-20 flex flex-col px-2 py-4 md:p-4 items-center justify-center gap-6 h-auto md:h-full w-full md:w-full bg-card md:bg-transparent rounded-t-[20px] md:rounded-[20px]">
      <section className="flex items-center gap-3">
        <Image src="/orb.png" alt="AI" width={96} height={96} className="rounded-full" />
        <ArrowLeftRight className="size-4 text-muted-foreground" />
        <Image src="/user.png" alt="You" width={88} height={88} className="rounded-full" />
      </section>

      <p className="text-sm text-muted-foreground">Your mic is on <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-600 text-xs">You can speak now</span></p>

      <section className="flex flex-row items-center justify-center gap-3 w-full">
        <Button type="button" variant="outline" className="rounded-full gap-2 px-6 flex-1 md:flex-none">
          <MicOff className="size-4" />
          Turn off mic
        </Button>
        <Button type="button" variant="outline" className="rounded-full gap-2 px-6 flex-1 md:flex-none" onClick={onClose}>
          <X className="size-4" />
          Close voice mode
        </Button>
      </section>
    </section>
  );
}


