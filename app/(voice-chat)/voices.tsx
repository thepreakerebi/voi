"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MicOff, Mic, X, ArrowLeftRight } from "lucide-react";
import AiOrb from "./ai-orb";

type Props = {
  onClose?: () => void;
  onToggleMic?: () => void;
  micOn?: boolean;
};

export default function Voices({ onClose, onToggleMic, micOn }: Props) {
  return (
    <section className="md:static border-secondary border-2 md:border-none fixed inset-x-0 bottom-0 z-20 flex flex-col px-2 py-4 md:p-4 items-center justify-center gap-6 h-auto md:h-full w-full md:w-full bg-card md:bg-transparent rounded-t-[20px] md:rounded-[20px]">
      <section className="flex items-center gap-3">
        <AiOrb speaking={false} size={96} />
        <ArrowLeftRight className="size-4 text-muted-foreground" />
        <Image src="/user.png" alt="You" width={88} height={88} className="rounded-full" />
      </section>

      <p className="text-sm text-muted-foreground">Your mic is {micOn ? "on" : "off"} {micOn && (<span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-600 text-xs">You can speak now</span>)}</p>

      <section className="flex flex-row items-center justify-center gap-3 w-full">
        <Button type="button" variant="outline" className="rounded-full gap-2 px-6 flex-1 md:flex-none" onClick={onToggleMic}>
          {micOn ? <Mic className="size-4" /> : <MicOff className="size-4" />}
          {micOn ? "Turn off mic" : "Turn on mic"}
        </Button>
        <Button type="button" variant="outline" className="rounded-full gap-2 px-6 flex-1 md:flex-none" onClick={onClose}>
          <X className="size-4" />
          Close voice mode
        </Button>
      </section>
    </section>
  );
}


