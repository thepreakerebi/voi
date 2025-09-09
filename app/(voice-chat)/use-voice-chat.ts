"use client";

import * as React from "react";

type UseVoiceChatReturn = {
  isMicOn: boolean;
  isAiSpeaking: boolean;
  userCaption: string;
  aiCaption: string;
  toggleMic: () => Promise<void>;
};

export function useVoiceChat(): UseVoiceChatReturn {
  const mediaStreamRef = React.useRef<MediaStream | null>(null);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const processingRef = React.useRef<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const sessionIdRef = React.useRef<string>(Math.random().toString(36).slice(2));

  const [isMicOn, setIsMicOn] = React.useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = React.useState(false);
  const [userCaption, setUserCaption] = React.useState("");
  const [aiCaption, setAiCaption] = React.useState("");

  React.useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener("play", () => setIsAiSpeaking(true));
    audioRef.current.addEventListener("ended", () => setIsAiSpeaking(false));
    audioRef.current.addEventListener("pause", () => setIsAiSpeaking(false));
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  function base64ToBlob(base64: string, mediaType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mediaType });
  }

  async function startMic() {
    if (mediaStreamRef.current) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;
    setIsMicOn(true);

    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    recorderRef.current = recorder;
    recorder.addEventListener("dataavailable", async (e) => {
      if (!e.data || e.data.size === 0) return;
      if (processingRef.current) return; // simple backpressure
      processingRef.current = true;
      try {
        const arrayBuffer = await e.data.arrayBuffer();
        const res = await fetch(`/api/voice?sessionId=${encodeURIComponent(sessionIdRef.current)}`, {
          method: "POST",
          headers: { "Content-Type": e.data.type || "audio/webm" },
          body: arrayBuffer,
        });
        if (!res.ok) { processingRef.current = false; return; }
        const json = await res.json();
        if (typeof json.userText === "string") setUserCaption(json.userText);
        if (typeof json.assistantText === "string") setAiCaption(json.assistantText);
        if (json.audio?.base64 && json.audio?.mediaType && audioRef.current) {
          const blob = base64ToBlob(json.audio.base64, json.audio.mediaType);
          const url = URL.createObjectURL(blob);
          audioRef.current.src = url;
          await audioRef.current.play().catch(() => {});
          URL.revokeObjectURL(url);
        }
      } finally {
        processingRef.current = false;
      }
    });
    recorder.start(2000); // 2s chunks
  }

  function stopMic() {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    recorderRef.current = null;
    setIsMicOn(false);
  }

  async function toggleMic() {
    if (isMicOn) stopMic();
    else await startMic();
  }

  return { isMicOn, isAiSpeaking, userCaption, aiCaption, toggleMic };
}


