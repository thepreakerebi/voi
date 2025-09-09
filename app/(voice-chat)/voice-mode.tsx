"use client";

import * as React from "react";
import Captions from "./captions";
import Voices from "./voices";

export default function VoiceMode({ onClose }: { onClose?: () => void }) {
  const [userCaption, setUserCaption] = React.useState("");
  const [aiCaption, setAiCaption] = React.useState("");

  return (
    <section className="w-full h-[calc(100vh-56px)] px-4 py-4 md:py-8">
      <section className="grid w-full h-full mt-20 grid-cols-1 md:grid-cols-2 gap-6">
        <section className="rounded-[1.5rem] w-full bg-card h-full md:p-8">
          <Captions userText={userCaption} aiText={aiCaption} />
        </section>
        <section className="rounded-[1.5rem] w-full bg-card h-full md:p-8">
          <Voices onCaptionUpdate={(u, a) => { setUserCaption(u ?? userCaption); setAiCaption(a ?? aiCaption); }} onClose={onClose} />
        </section>
      </section>
    </section>
  );
}


