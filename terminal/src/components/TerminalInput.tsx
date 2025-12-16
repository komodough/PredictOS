"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { Send, Link2, ChevronDown } from "lucide-react";

export type GrokModel = 
  | "grok-4-1-fast-reasoning"
  | "grok-4-1-fast-non-reasoning"
  | "grok-4-fast-reasoning"
  | "grok-4-fast-non-reasoning";

export const GROK_MODELS: { value: GrokModel; label: string }[] = [
  { value: "grok-4-1-fast-reasoning", label: "Grok 4.1 Fast (Reasoning)" },
  { value: "grok-4-1-fast-non-reasoning", label: "Grok 4.1 Fast (Non-Reasoning)" },
  { value: "grok-4-fast-reasoning", label: "Grok 4 Fast (Reasoning)" },
  { value: "grok-4-fast-non-reasoning", label: "Grok 4 Fast (Non-Reasoning)" },
];

interface TerminalInputProps {
  onSubmit: (url: string, model: GrokModel) => void;
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
  const [selectedModel, setSelectedModel] = useState<GrokModel>("grok-4-1-fast-reasoning");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const prevShouldClear = useRef(shouldClear);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      onSubmit(input.trim(), selectedModel);
    }
  };

  const getModelLabel = (model: GrokModel) => {
    return GROK_MODELS.find(m => m.value === model)?.label || model;
  };

  return (
    <div className="relative z-20 border border-border rounded-lg bg-card/80 backdrop-blur-sm border-glow">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground font-display">
            MARKET ANALYSIS INPUT
          </span>
        </div>
        
        {/* Model Dropdown in Header */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 border border-border text-[10px] text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono whitespace-nowrap"
          >
            <span className="hidden sm:inline">{getModelLabel(selectedModel)}</span>
            <span className="sm:hidden">Model</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isModelDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-card border border-border rounded-lg shadow-xl z-[100] overflow-hidden">
              <div className="py-1">
                {GROK_MODELS.map((model) => (
                  <button
                    key={model.value}
                    type="button"
                    onClick={() => {
                      setSelectedModel(model.value);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm font-mono transition-colors ${
                      selectedModel === model.value
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <span className="block">{model.label}</span>
                    <span className="block text-[10px] opacity-60 mt-0.5">{model.value}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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

