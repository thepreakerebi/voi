"use client";

import * as React from "react";
import Captions from "./captions";
import Voices from "./voices";
import { useVoiceChat } from "./use-voice-chat";

export default function VoiceMode({ onClose }: { onClose?: () => void }) {
  const { isMicOn, userCaption, aiCaption, toggleMic } = useVoiceChat();

  return (
    <section className="w-full h-[calc(100vh-56px)] flex flex-col items-center md:px-2 md:py-8">
      <section className="grid w-full h-full mt-[60px] grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded-[20px] w-full bg-card h-full md:p-8">
          <Captions userText={userCaption} aiText={aiCaption} />
        </section>
        <section className="rounded-[20px] w-full bg-transparent md:bg-card h-full p-0 md:p-8">
          <Voices onClose={onClose} onToggleMic={toggleMic} micOn={isMicOn} />
        </section>
      </section>
    </section>
  );
}


