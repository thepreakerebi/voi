"use client";

import * as React from "react";
import Captions from "./captions";
import Voices from "./voices";

export default function VoiceMode({ onClose }: { onClose?: () => void }) {
  const [userCaption, setUserCaption] = React.useState("");
  const [aiCaption, setAiCaption] = React.useState("");

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <section className="rounded-2xl border bg-card p-4 md:p-6">
          <Captions userText={userCaption} aiText={aiCaption} />
        </section>
        <section className="rounded-2xl border bg-card p-4 md:p-6">
          <Voices onCaptionUpdate={(u, a) => { setUserCaption(u ?? userCaption); setAiCaption(a ?? aiCaption); }} onClose={onClose} />
        </section>
      </section>
    </section>
  );
}


