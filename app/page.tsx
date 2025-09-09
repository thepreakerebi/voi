"use client";

import * as React from "react";
import Header from "./_components/header";
import TextMode from "./(text-chat)/text-mode";
import VoiceMode from "./(voice-chat)/voice-mode";

export default function Home() {
  const [mode, setMode] = React.useState<"text" | "voice">("text");
  return (
    <section className="h-full">
      <Header />
      <section className="w-full px-3 md:px-64 py-16 bg-secondary">
        {mode === "text" ? (
          <TextMode onOpenVoice={() => setMode("voice")} />
        ) : (
          <VoiceMode onClose={() => setMode("text")} />
        )}
      </section>
    </section>
  );
}
