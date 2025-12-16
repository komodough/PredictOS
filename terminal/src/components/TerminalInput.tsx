"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { Send, Link2 } from "lucide-react";

interface TerminalInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  shouldClear?: boolean;
}

const loadingMessages = [
  "Fetching market data",
  "Analyzing probabilities",
  "Detecting alpha opportunities",
  "Consulting AI agents",
  "Calculating edge",
  "Generating recommendation",
];

const TerminalInput = ({ onSubmit, isLoading, shouldClear }: TerminalInputProps) => {
  const [input, setInput] = useState("");
  const [dots, setDots] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const prevShouldClear = useRef(shouldClear);

  // Clear input when shouldClear changes to true
  useEffect(() => {
    if (shouldClear && !prevShouldClear.current) {
      setInput("");
    }
    prevShouldClear.current = shouldClear;
  }, [shouldClear]);

  // Animate the dots
  useEffect(() => {
    if (!isLoading) {
      setDots("");
      setMessageIndex(0);
      return;
    }

    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(dotsInterval);
  }, [isLoading]);

  // Cycle through loading messages
  useEffect(() => {
    if (!isLoading) return;

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, [isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
    }
  };

  return (
    <div className="border border-border rounded-lg bg-card/80 backdrop-blur-sm border-glow">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
        <Link2 className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground font-display">
          MARKET ANALYSIS INPUT
        </span>
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4">
        <span className="text-primary font-bold">{">"}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste Kalshi or Polymarket URL ..."
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 font-mono"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2 rounded-md bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-primary"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
      
      {isLoading && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 text-xs text-primary font-mono">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="min-w-[200px]">
              {loadingMessages[messageIndex]}<span className="inline-block w-6 text-left">{dots}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalInput;

