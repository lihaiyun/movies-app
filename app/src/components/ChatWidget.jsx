import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const WELCOME_MESSAGE = {
  role: "assistant",
  content: "Hi! Ask me about the movies in our catalogue - genres, release dates, recommendations and more.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, sending]);

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const history = messages
      .filter((m) => m !== WELCOME_MESSAGE)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setSending(true);
    setError("");

    try {
      const { data } = await api.post("/chat", { message: trimmed, history });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <Card className="w-80 gap-0 py-0 shadow-lg sm:w-96">
          <CardHeader className="flex-row items-center justify-between gap-2 border-b py-3">
            <CardTitle className="text-sm">Movie Assistant</CardTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="size-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div ref={scrollRef} className="flex h-80 flex-col gap-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
                    m.role === "user"
                      ? "self-end bg-primary text-primary-foreground"
                      : "self-start bg-muted text-foreground"
                  )}
                >
                  {m.content}
                </div>
              ))}
              {sending && (
                <div className="self-start rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Thinking...
                </div>
              )}
            </div>

            {error && <p className="px-4 pb-2 text-xs text-destructive">{error}</p>}

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t p-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a movie..."
                disabled={sending}
              />
              <Button type="submit" size="icon" disabled={sending || !input.trim()}>
                <Send className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Button
        size="icon-lg"
        className="rounded-full shadow-lg"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chat" : "Open movie chat"}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </Button>
    </div>
  );
}
