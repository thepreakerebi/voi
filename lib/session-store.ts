export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

// In-memory session store keyed by sessionId.
const sessions = new Map<string, ChatMessage[]>();

export function appendMessage(sessionId: string, message: ChatMessage) {
  const arr = sessions.get(sessionId) ?? [];
  arr.push(message);
  sessions.set(sessionId, arr);
}

export function getMessages(sessionId: string): ChatMessage[] {
  return sessions.get(sessionId) ?? [];
}

export function resetSession(sessionId: string) {
  sessions.delete(sessionId);
}


