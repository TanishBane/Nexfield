'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Input,
  Badge,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useFarmStore } from '@/lib/store/useFarmStore';
import type { IntelligenceChatMessage } from '@nexfield/contracts';

const INITIAL_MESSAGES: IntelligenceChatMessage[] = [
  {
    id: 'msg-init-1',
    role: 'assistant',
    content: `Hello! I am **NEXFIELD Intelligence**, your agronomic copilot. I am continuously grounded in your active farm telemetry, weather microclimate, and Mandi price signals.

Currently monitoring **GreenValley Bio-Research Agrohub (Punjab)**. North Sector Alpha is in flowering/panicle stage (Wheat HD-3086). How can I assist you with crop management, disease mitigation, or market dispatch today?`,
    timestamp: '2026-10-23T14:30:00Z',
    suggestedActions: [
      'Assess Stripe Rust remediation options',
      'Evaluate Khanna vs Rajpura Mandi arbitrage',
      'Check irrigation withholding window',
    ],
    citations: [
      {
        title: 'ICAR Wheat Advisory Bulletin 2026',
        source: 'Indian Council of Agricultural Research',
      },
    ],
    contextSnapshot: {
      farmName: 'GreenValley Agrohub',
      selectedField: 'North Sector Alpha (FLD-N01)',
      cropVariety: 'Wheat HD-3086',
    },
  },
];

export default function IntelligencePage() {
  const { selectedFarmId, selectedFieldId } = useFarmStore();
  const [messages, setMessages] = useState<IntelligenceChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const chatMutation = useMutation({
    mutationFn: (userQuery: string) =>
      apiClient.sendIntelligenceChat({
        farmId: selectedFarmId,
        fieldId: selectedFieldId || undefined,
        userQuery,
        conversationHistory: messages,
      }),
    onSuccess: (res) => {
      setMessages((prev) => [...prev, res.data]);
    },
  });

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || chatMutation.isPending) return;

    const userMessage: IntelligenceChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    chatMutation.mutate(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3] flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              NEXFIELD Intelligence — Context-Aware Agronomic Assistant
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-0.5">
            Grounded LLM agronomy engine linking real-time soil telemetry, vision diagnoses, and market intelligence with peer-reviewed research.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm" className="font-mono text-emerald-400 border-emerald-800/50">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            ICAR / Agmarknet Grounded
          </Badge>
        </div>
      </div>

      {/* Main Chat Interface */}
      <Card className="flex flex-col h-[calc(100vh-210px)] min-h-[500px] border-[#203126]">
        {/* Messages Stream */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' ? (
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                  <Bot className="h-4 w-4" />
                </div>
              ) : null}

              <div
                className={`max-w-2xl rounded-xl p-4 text-xs md:text-sm leading-relaxed border space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-emerald-950/40 border-emerald-800/40 text-[#F1F6F3]'
                    : 'bg-[#101713] border-[#1F2F25] text-[#D8E6DE]'
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-line">
                  {msg.content}
                </div>

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 ? (
                  <div className="mt-3 pt-2.5 border-t border-[#1C2A22] space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-[#668273] tracking-wider block">
                      Agronomic References
                    </span>
                    {msg.citations.map((cite, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 text-[11px] text-[#869E90] hover:text-emerald-400 cursor-pointer"
                      >
                        <BookOpen className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span>{cite.title}</span>
                        <span className="text-[#597263]">({cite.source})</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 ? (
                  <div className="mt-3 pt-2 border-t border-[#1C2A22] flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action)}
                        className="rounded-full bg-[#16231C] hover:bg-[#1D2E25] text-emerald-300 border border-[#273B2F] px-2.5 py-1 text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                      >
                        {action}
                        <ArrowRight className="h-2.5 w-2.5" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {msg.role === 'user' ? (
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg bg-[#18261F] border border-[#273B2F] text-[#ABC1B4]">
                  <User className="h-4 w-4" />
                </div>
              ) : null}
            </div>
          ))}

          {chatMutation.isPending ? (
            <div className="flex gap-3 items-center text-xs text-[#7B9586] italic">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <span>Synthesizing farm context and agricultural advisory models...</span>
            </div>
          ) : null}
        </CardContent>

        {/* Input Bar */}
        <CardFooter className="p-3 border-t border-[#1C2B22] bg-[#0C120F]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex w-full items-center gap-2"
          >
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about crop health, spray schedules, irrigation, or Mandi arbitrage..."
              className="flex-1 bg-[#101713]"
              disabled={chatMutation.isPending}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!inputText.trim() || chatMutation.isPending}
              className="gap-1.5"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
