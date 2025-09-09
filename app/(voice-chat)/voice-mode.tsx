"use client";

import * as React from "react";
import Captions from "./captions";
import Voices from "./voices";
import { useVoiceChat } from "./use-voice-chat";

export default function VoiceMode({ onClose }: { onClose?: () => void }) {
  const { isMicOn, messages, toggleMic } = useVoiceChat();

  return (
    <section className="w-full h-full md:px-2 md:py-8">
      <section className="grid w-full mt-16 md:mt-[24px] h-full grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded-[20px] w-full md:bg-card h-full overflow-hidden md:pb-1 md:pt-6">
          <Captions messages={messages} />
        </section>
        <section className="rounded-[20px] w-full bg-transparent md:bg-card h-full overflow-hidden p-0 md:p-8">
          <Voices onClose={onClose} onToggleMic={toggleMic} micOn={isMicOn} />
        </section>
      </section>
    </section>
  );
}


