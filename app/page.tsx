"use client";

import * as React from "react";
import Header from "./_components/header";
import TextMode from "./(text-chat)/text-mode";
import VoiceMode from "./(voice-chat)/voice-mode";

export default function Home() {
  const [mode, setMode] = React.useState<"text" | "voice">("text");
  const micControlRef = React.useRef<{ toggleMic?: () => Promise<void> }>({});
  const pendingAutoMic = React.useRef(false);
  
  return (
    <section className="h-full">
      <Header />
      {mode === "text" ? (
        <section className="w-full px-3 md:px-64 py-16 bg-secondary transition-all duration-500 ease-in-out">
          <TextMode onOpenVoice={async () => { 
            pendingAutoMic.current = true;
            setMode("voice");
          }} />
        </section>
      ) : (
        <section className="w-full h-[calc(100vh-56px)] md:px-4 bg-secondary overflow-hidden transition-all duration-500 ease-in-out">
          <VoiceMode onClose={() => setMode("text")} onMicControlReady={(ref) => { micControlRef.current = ref; }} />
        </section>
      )}
    </section>
  );
}
