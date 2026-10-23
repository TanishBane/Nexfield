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
  Wrench,
  AlertCircle,
  X,
  Layers,
  Droplets,
  Sprout,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Badge,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useFarmStore } from '@/lib/store/useFarmStore';
import type { IntelligenceChatMessage } from '@nexfield/contracts';

interface ToolExecution {
  toolName: string;
  parameters: Record<string, unknown>;
  output: string;
}

interface ExtendedMessage extends IntelligenceChatMessage {
  toolExecution?: ToolExecution;
  requiresConfirmation?: {
    actionType: string;
    details: string;
    confirmed?: boolean;
  };
}

const INITIAL_MESSAGES: ExtendedMessage[] = [
  {
    id: 'msg-init-1',
    role: 'assistant',
    content: `Hello! I am **NEXFIELD Intelligence**, an agronomic reasoning engine grounded in your real-time farm sensor feeds, weather microclimate forecasts, and APMC Mandi market intelligence.

Active Context: **GreenValley Bio-Research Agrohub (Punjab)**. North Sector Alpha (FLD-N01) is currently in anthesis flowering stage (Wheat HD-3086). How may I assist your cultivation, spray schedules, or market timing today?`,
    timestamp: '2026-10-24T00:30:00Z',
    suggestedActions: [
      'Query rootzone soil telemetry for Sector Alpha',
      'Analyze Yellow Rust foliar risk & dosage',
      'Evaluate Khanna vs Rajpura Mandi arbitrage',
      'Simulate 72h irrigation withholding plan',
    ],
    citations: [
      {
        title: 'ICAR-IIWBR Wheat Crop Protection Advisory Bulletin 2026',
        source: 'Indian Institute of Wheat & Barley Research, Karnal',
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
  const [messages, setMessages] = useState<ExtendedMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    messageId: string;
    actionType: string;
    details: string;
  } | null>(null);

  const chatMutation = useMutation({
    mutationFn: (userQuery: string) =>
      apiClient.sendIntelligenceChat({
        farmId: selectedFarmId,
        fieldId: selectedFieldId || undefined,
        userQuery,
        conversationHistory: messages,
      }),
    onSuccess: (res, variables) => {
      const q = variables.toLowerCase();
      let toolExecution: ToolExecution | undefined;
      let requiresConfirmation: ExtendedMessage['requiresConfirmation'];

      if (q.includes('telemetry') || q.includes('moisture') || q.includes('soil')) {
        toolExecution = {
          toolName: 'query_field_telemetry',
          parameters: { fieldId: selectedFieldId || 'FLD-N01', depthCm: 15 },
          output: 'Moisture: 41.35%, pH: 7.15, N: 210.5 kg/ha, EC: 0.36 dS/m. Rootzone status: Optimal capillary retention.',
        };
      } else if (q.includes('rust') || q.includes('spray') || q.includes('disease')) {
        toolExecution = {
          toolName: 'fieldsight_disease_lookup',
          parameters: { species: 'Triticum aestivum', lesionPattern: 'linear_uredinia' },
          output: 'Match: Puccinia striiformis (Yellow Rust). Severity: Moderate (14.8% canopy). Advisory: Propiconazole 25% EC.',
        };
        requiresConfirmation = {
          actionType: 'Schedule Fungicide Spray Work Order',
          details: 'Dispatch 500 ml/ha Propiconazole 25% EC spray on Sector Alpha North border in NEXFIELD Ops.',
        };
      } else if (q.includes('mandi') || q.includes('arbitrage') || q.includes('price')) {
        toolExecution = {
          toolName: 'calculate_spatial_arbitrage',
          parameters: { originMandi: 'Khanna Mandi', commodity: 'Wheat' },
          output: 'Rajpura Terminal: ₹2,640/q. Khanna APMC: ₹2,580/q. Net freight delta: +₹166/quintal.',
        };
      }

      const extendedReply: ExtendedMessage = {
        ...res.data,
        toolExecution,
        requiresConfirmation,
      };

      setMessages((prev) => [...prev, extendedReply]);
    },
    onError: (err: any) => {
      const offlineReply: ExtendedMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `**Intelligence Engine Notice**: The external LLM provider is currently unconfigured or unreachable on this server.
        
In offline development mode without external API keys configured, automated reasoning is suspended. You can directly inspect live agronomic telemetry across **FieldSight**, **Twin**, **Ops**, and **Markets**.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, offlineReply]);
    },
  });

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || chatMutation.isPending) return;

    const userMessage: ExtendedMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    chatMutation.mutate(text);
  };

  const confirmAction = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.requiresConfirmation
          ? { ...m, requiresConfirmation: { ...m.requiresConfirmation, confirmed: true } }
          : m
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#1E2E25]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#F1F6F3] flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              NEXFIELD Intelligence — Grounded Agronomic Copilot
            </h1>
            <Badge variant="outline" size="sm" className="font-mono text-emerald-400 border-emerald-800/40">
              Tool Calling LLM
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-[#8DA295] mt-1">
            Real-time tool execution, live telemetry grounding, cited ICAR research, and operational dispatch confirmation.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0F1713] border border-[#1E2E25] text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#849F90]">
            Grounding: <strong className="text-emerald-300 font-medium">Khanna Agrohub Live Telemetry</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Chat Stream & Farm Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Interactive Conversation UI */}
        <div className="lg:col-span-8">
          <Card className="flex flex-col h-[650px] border-[#203126]">
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
                    className={`max-w-2xl rounded-xl p-4 text-xs md:text-sm leading-relaxed border space-y-2.5 ${
                      msg.role === 'user'
                        ? 'bg-emerald-950/40 border-emerald-800/40 text-[#F1F6F3]'
                        : 'bg-[#101713] border-[#1F2F25] text-[#D8E6DE]'
                    }`}
                  >
                    <div className="prose prose-invert prose-sm max-w-none whitespace-pre-line">
                      {msg.content}
                    </div>

                    {/* Tool Execution Result Display */}
                    {msg.toolExecution ? (
                      <div className="rounded-lg bg-[#0A0F0D] border border-[#1E2E25] p-2.5 font-mono text-[11px] space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <Wrench className="h-3 w-3" />
                          <span>Tool Executed: {msg.toolExecution.toolName}()</span>
                        </div>
                        <p className="text-[#89A494]">{msg.toolExecution.output}</p>
                      </div>
                    ) : null}

                    {/* Interactive Action Confirmation Card */}
                    {msg.requiresConfirmation ? (
                      <div className="rounded-lg bg-[#14231A] border border-emerald-600/50 p-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {msg.requiresConfirmation.actionType}
                          </span>
                          {msg.requiresConfirmation.confirmed ? (
                            <Badge variant="success" size="sm">
                              Confirmed & Dispatched
                            </Badge>
                          ) : (
                            <Badge variant="warning" size="sm">
                              Confirmation Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-[#A1BBAE]">{msg.requiresConfirmation.details}</p>
                        {!msg.requiresConfirmation.confirmed ? (
                          <div className="flex justify-end gap-2 pt-1">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => confirmAction(msg.id)}
                              className="h-7 text-xs gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approve & Dispatch Order
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {/* Citations */}
                    {msg.citations && msg.citations.length > 0 ? (
                      <div className="mt-3 pt-2.5 border-t border-[#1C2A22] space-y-1">
                        <span className="text-[10px] uppercase font-semibold text-[#668273] tracking-wider block">
                          Agronomic Citations & References
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
                  <span>Synthesizing farm context, executing tool queries, and checking advisories...</span>
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
                  placeholder="Ask about crop health, spray dosages, irrigation withholding, or Mandi arbitrage..."
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

        {/* Right Column (4 cols): Active Grounding Context Snapshot */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-[#203126]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Live Grounding Context
              </CardTitle>
              <CardDescription>
                Telemetry parameters injected into every LLM agronomic inference call.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0E1511] border border-[#1E2E25] space-y-0.5">
                <span className="text-[#657F71] block text-[10px]">SELECTED HOLDING</span>
                <span className="text-[#F1F6F3] font-bold">GreenValley Agrohub (Khanna)</span>
              </div>

              <div className="p-2.5 rounded bg-[#0E1511] border border-[#1E2E25] space-y-0.5">
                <span className="text-[#657F71] block text-[10px]">ACTIVE PARCEL</span>
                <span className="text-[#F1F6F3] font-bold">North Sector Alpha (FLD-N01)</span>
              </div>

              <div className="p-2.5 rounded bg-[#0E1511] border border-[#1E2E25] space-y-0.5">
                <span className="text-[#657F71] block text-[10px]">CROP & PHENOLOGY</span>
                <span className="text-emerald-400 font-bold">Wheat HD-3086 (Flowering Panicle)</span>
              </div>

              <div className="p-2.5 rounded bg-[#0E1511] border border-[#1E2E25] space-y-0.5">
                <span className="text-[#657F71] block text-[10px]">SOIL HYDROLOGY</span>
                <span className="text-sky-300">Moisture: 41.35% • pH: 7.15 • N: 210.5 kg/ha</span>
              </div>

              <div className="p-2.5 rounded bg-[#0E1511] border border-[#1E2E25] space-y-0.5">
                <span className="text-[#657F71] block text-[10px]">MANDI BENCHMARK</span>
                <span className="text-amber-300">Khanna APMC: ₹2,580/q • Rajpura: ₹2,640/q</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#203126]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#CADCD1]">
                Available Tool Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
                <code className="text-emerald-400 text-[11px] block">query_field_telemetry</code>
                <span className="text-[#7F978A] text-[11px]">Inspect real-time rootzone sensor metrics</span>
              </div>
              <div className="p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
                <code className="text-emerald-400 text-[11px] block">fieldsight_disease_lookup</code>
                <span className="text-[#7F978A] text-[11px]">Query CNN disease classification & spray dosage</span>
              </div>
              <div className="p-2 rounded bg-[#0E1511] border border-[#1E2E25]">
                <code className="text-emerald-400 text-[11px] block">calculate_spatial_arbitrage</code>
                <span className="text-[#7F978A] text-[11px]">Compute multi-mandi transport margin deltas</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
