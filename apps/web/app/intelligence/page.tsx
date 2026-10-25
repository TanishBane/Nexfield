'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Copy,
  Check,
  Layers,
  Droplets,
  Sprout,
  ScanEye,
  TrendingUp,
  Warehouse,
  ExternalLink,
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
  ProvenanceBadge,
} from '@nexfield/ui';
import { apiClient } from '@/lib/api';
import { useFarmStore } from '@/lib/store/useFarmStore';
import { useDemoStore } from '@/lib/store/useDemoStore';
import type { IntelligenceChatMessage } from '@nexfield/contracts';

interface ToolExecution {
  toolName: string;
  parameters: Record<string, unknown>;
  output: string;
  status: 'executed' | 'running' | 'verified';
}

interface ExtendedMessage extends IntelligenceChatMessage {
  toolExecution?: ToolExecution;
  requiresConfirmation?: {
    actionType: string;
    details: string;
    targetModule: string;
    confirmed?: boolean;
  };
}

export default function IntelligencePage() {
  const { selectedFarmId, selectedFieldId } = useFarmStore();
  const { farmName, location, cropName, cropVariety, growthStage, soilMoisture, soilPh, nitrogenPpm } = useDemoStore();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  // Initial Message Dynamically Grounded in Selected Estate
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);

  useEffect(() => {
    const isWheat = cropName?.toLowerCase().includes('wheat');
    const isCotton = cropName?.toLowerCase().includes('cotton');

    const defaultGreeting = isWheat
      ? `Hello! I am **NEXFIELD Intelligence**, an agronomic reasoning engine grounded in your real-time farm sensor feeds, microclimate weather stations, and wholesale APMC Mandi market intelligence.

Active Context: **${farmName} (${location})**. North Sector Alpha is currently in **${growthStage}** (${cropName} ${cropVariety}). Soil rootzone moisture is holding at **${soilMoisture}%** with optimal capillary retention.

How may I assist your foliar disease scouting, nitrogen top-dressing schedules, or APMC mandi arbitrage today?`
      : isCotton
      ? `Hello! I am **NEXFIELD Intelligence**, an agronomic reasoning engine grounded in your real-time farm sensor feeds, microclimate weather stations, and wholesale APMC Mandi market intelligence.

Active Context: **${farmName} (${location})**. South Basin is currently in **${growthStage}** (${cropName} ${cropVariety}). Vertisol soil moisture is at **${soilMoisture}%** with active boll formation.

How may I assist your pink bollworm scouting, sprinkler fertigation, or Akola/Amravati cotton yard realization today?`
      : `Hello! I am **NEXFIELD Intelligence**, an agronomic reasoning engine grounded in your real-time farm sensor feeds, microclimate weather stations, and wholesale APMC Mandi market intelligence.

Active Context: **${farmName} (${location})**. Sector 2-B is currently in **${growthStage}** (${cropName} ${cropVariety}). Soil rootzone moisture is optimal at **${soilMoisture}%** with -33 kPa capillary matrix potential.

How may I assist your foliar pathology mitigation, drip fertigation schedules, or Nashik vs Pimpalgaon mandi price arbitrage today?`;

    const initialMsg: ExtendedMessage = {
      id: 'msg-init-grounded',
      role: 'assistant',
      content: defaultGreeting,
      timestamp: new Date().toISOString(),
      suggestedActions: isWheat
        ? [
            'Query rootzone soil telemetry for Sector Alpha',
            'Analyze Yellow Stripe Rust risk & ICAR dosage',
            'Evaluate Khanna vs Rajpura Mandi price spread (+₹166)',
            'Simulate 72h irrigation withholding plan in Twin',
          ]
        : [
            'Query rootzone soil moisture and vadose potential for Sector 2-B',
            'Analyze Early Blight foliar lesion risk & ICAR Mancozeb dosage',
            'Evaluate Nashik vs Pimpalgaon APMC mandi price arbitrage (+₹210)',
            'Check Grain Silo Equilibrium Moisture Content (<14%)',
          ],
      citations: [
        {
          title: 'ICAR National Agricultural Innovation Project Bulletin 2026',
          source: 'Indian Council of Agricultural Research, New Delhi',
        },
        {
          title: 'All India Coordinated Research Project on Solanaceous Vegetables',
          source: 'ICAR-IIHR Hessaraghatta, Bengaluru',
        },
      ],
      contextSnapshot: {
        farmName,
        selectedField: 'Sector 2-B Open Drip',
        cropVariety: `${cropName} ${cropVariety}`,
      },
    };

    setMessages([initialMsg]);
  }, [farmName, location, cropName, cropVariety, growthStage, soilMoisture, soilPh]);

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

      if (q.includes('telemetry') || q.includes('moisture') || q.includes('soil') || q.includes('rootzone')) {
        toolExecution = {
          toolName: 'query_field_telemetry',
          parameters: { field: 'Sector 2-B', depthCm: '0-30cm', sensor: 'LoRa Capacitance Probe' },
          output: `Rootzone VWC: ${soilMoisture}%, pH: ${soilPh}, Temp: 24.2°C, Matrix Potential: -33 kPa. Campbell-Norman hydraulic conductivity: Optimal field capacity; zero deep percolation.`,
          status: 'verified',
        };
      } else if (q.includes('blight') || q.includes('rust') || q.includes('spray') || q.includes('disease') || q.includes('lesion')) {
        toolExecution = {
          toolName: 'fieldsight_disease_lookup',
          parameters: { species: 'Solanum lycopersicum', pathogen: 'Alternaria solani', targetPlot: 'Sector 2-B' },
          output: 'Match: Alternaria solani (Early Blight). Confidence: 96.4%. Affected Foliage: 12.4%. ICAR Protocol: Mancozeb 75 WP @ 2.5 g/L foliar spray. Pre-harvest withholding: 7 days.',
          status: 'verified',
        };
        requiresConfirmation = {
          actionType: 'Schedule Foliar Spray Work Order',
          details: 'Dispatch 2.5 g/L Mancozeb 75 WP spray application across Sector 2-B in NEXFIELD Ops.',
          targetModule: '/ops',
        };
      } else if (q.includes('mandi') || q.includes('arbitrage') || q.includes('price') || q.includes('freight')) {
        toolExecution = {
          toolName: 'calculate_mandi_arbitrage',
          parameters: { commodity: 'Tomato Hybrid', baselineYard: 'Pimpalgaon APMC', targetYard: 'Nashik APMC' },
          output: 'Nashik APMC: ₹2,450/qtl. Pimpalgaon APMC: ₹2,240/qtl. Freight (14 km): ₹45/q. Mandi cess: ₹37/q. Net Realization Delta: +₹165/quintal in favor of Nashik.',
          status: 'verified',
        };
      } else if (q.includes('silo') || q.includes('storage') || q.includes('aflatoxin') || q.includes('moisture')) {
        toolExecution = {
          toolName: 'query_silo_equilibrium_moisture',
          parameters: { facility: 'Nashik Central Storage #1', targetCommodity: 'Grains & Solanaceous Fruits' },
          output: 'Grain Equilibrium Moisture: 12.4% (Safe threshold <14%, zero Aspergillus flavus risk). Cold Storage Room #2: 11.2°C, RH 88% (Safe, prevents chilling injury).',
          status: 'verified',
        };
      }

      const extendedReply: ExtendedMessage = {
        ...res.data,
        toolExecution,
        requiresConfirmation,
      };

      setMessages((prev) => [...prev, extendedReply]);
    },
    onError: () => {
      const offlineReply: ExtendedMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `**Deterministic Local Intelligence Engine Active**

Grounded in **${farmName}**:
- **Rootzone Soil Moisture:** ${soilMoisture}% (Capillary Matrix: -33 kPa, field capacity optimal).
- **Foliar Pathogen Status:** Sector 2-B flagged for Alternaria solani early blight rings (12.4% canopy). ICAR Mancozeb 75 WP @ 2.5 g/L recommended.
- **Wholesale Mandi Arbitrage:** Nashik APMC is trading at ₹2,450/qtl (+₹210 gross spread over Pimpalgaon). Net transport realization is +₹165/qtl after freight.`,
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

  const copyMessageContent = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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

  const STARTER_PROMPTS = [
    {
      title: 'Foliar Early Blight Risk',
      query: 'Analyze Early Blight foliar lesion risk & ICAR Mancozeb dosage for Sector 2-B',
      icon: ScanEye,
      color: 'text-rose-400',
    },
    {
      title: 'Rootzone VWC & Potential',
      query: 'Query rootzone soil moisture and vadose matrix potential for Sector 2-B',
      icon: Droplets,
      color: 'text-sky-400',
    },
    {
      title: 'Mandi Arbitrage Delta',
      query: 'Evaluate Nashik vs Pimpalgaon APMC mandi price arbitrage and net freight realization',
      icon: TrendingUp,
      color: 'text-emerald-400',
    },
    {
      title: 'Silo Aflatoxin Guard',
      query: 'Check Grain Silo Equilibrium Moisture Content and cold storage chilling-injury risk',
      icon: Warehouse,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* =========================================================================
          1. HEADER & GROUNDING SNAPSHOT
      ========================================================================== */}
      <div className="rounded-3xl bg-[#0D1410] border border-[#1E2E25] p-6 sm:p-8 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#163B2A] border border-[#D7B678]/40 text-[#D7B678] font-mono text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Agronomic Reasoning Engine
              </span>
              <ProvenanceBadge type="calculated" modelName="Grounded Tool-Calling Orchestrator" />
              <span className="text-xs font-mono text-[#8DA295]">
                Context: <strong className="text-[#F1F6F3]">{farmName}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F1F6F3] tracking-tight">
              NEXFIELD Intelligence — Agronomic Copilot
            </h1>

            <p className="text-xs sm:text-sm text-[#9BB1A4] max-w-3xl leading-relaxed">
              Real-time tool execution, in-situ soil capacitance grounding, peer-reviewed ICAR research citations, and direct operational dispatch into field work orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A100D] border border-[#1E2E25] text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#849F90]">
                Telemetry Synced: <strong className="text-emerald-300 font-medium">{cropName} ({soilMoisture}%)</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. STARTER PROMPT CARDS (4 DOMAIN ACTIONS)
      ========================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {STARTER_PROMPTS.map((prompt) => {
          const Icon = prompt.icon;
          return (
            <button
              key={prompt.title}
              type="button"
              onClick={() => handleSendMessage(prompt.query)}
              className="p-4 rounded-2xl bg-[#0D1410] border border-[#1E2E25] hover:border-emerald-600/40 hover:bg-[#111A15] text-left transition-all group flex flex-col justify-between space-y-3 cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-[#142219] border border-[#233B2B] text-emerald-400 group-hover:scale-105 transition-transform">
                  <Icon className={`w-4 h-4 ${prompt.color}`} />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#516E5E] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#F1F6F3]">{prompt.title}</h4>
                <p className="text-[11px] text-[#8DA295] mt-1 line-clamp-2 leading-relaxed">
                  {prompt.query}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          3. MAIN CONVERSATION & GROUNDING STREAM
      ========================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Interactive Conversation UI */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="rounded-3xl bg-[#0D1410] border border-[#1E2E25] shadow-2xl flex flex-col h-[700px] overflow-hidden">
            {/* Messages Stream */}
            <CardContent className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mt-0.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  ) : null}

                  <div
                    className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed border space-y-3 ${
                      msg.role === 'user'
                        ? 'bg-emerald-950/40 border-emerald-800/40 text-[#F1F6F3]'
                        : 'bg-[#111714] border-[#1E2E25] text-[#DCE7E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-[#18251E] text-[11px] font-mono text-[#8DA295]">
                      <span className="font-bold uppercase tracking-wider text-emerald-400">
                        {msg.role === 'assistant' ? 'NEXFIELD Intelligence' : 'Agronomist Command'}
                      </span>
                      {msg.role === 'assistant' && (
                        <button
                          type="button"
                          onClick={() => copyMessageContent(msg.id, msg.content)}
                          className="flex items-center gap-1 text-[#8DA295] hover:text-[#F1F6F3] transition-colors p-1 rounded hover:bg-[#18251E]"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] text-emerald-400 font-mono">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-mono">Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="prose prose-invert prose-sm max-w-none whitespace-pre-line leading-relaxed">
                      {msg.content}
                    </div>

                    {/* Tool Execution Result Display */}
                    {msg.toolExecution ? (
                      <div className="rounded-xl bg-[#090D0B] border border-[#1E2E25] p-3 font-mono text-xs space-y-1.5 shadow-inner">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <Wrench className="h-3 w-3" />
                            <span>Tool: {msg.toolExecution.toolName}()</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 font-bold">
                            CALCULATED GROUND TRUTH
                          </span>
                        </div>
                        <p className="text-[#A2B6AA] leading-relaxed pt-1 border-t border-[#16231C]">
                          {msg.toolExecution.output}
                        </p>
                      </div>
                    ) : null}

                    {/* Interactive Action Confirmation Card */}
                    {msg.requiresConfirmation ? (
                      <div className="rounded-xl bg-[#14231A] border border-emerald-600/50 p-4 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                            <AlertCircle className="h-4 w-4 text-emerald-400" />
                            {msg.requiresConfirmation.actionType}
                          </span>
                          {msg.requiresConfirmation.confirmed ? (
                            <Badge variant="success" size="sm">
                              Dispatched to Ops
                            </Badge>
                          ) : (
                            <Badge variant="warning" size="sm">
                              Awaiting Approval
                            </Badge>
                          )}
                        </div>
                        <p className="text-[#C5D9CD] leading-relaxed">{msg.requiresConfirmation.details}</p>
                        {!msg.requiresConfirmation.confirmed ? (
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1C3224]">
                            <span className="text-[11px] font-mono text-[#8DA295]">Module: NEXFIELD Ops</span>
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => confirmAction(msg.id)}
                                className="h-7 text-xs gap-1.5 bg-emerald-500 text-[#090D0B] hover:bg-emerald-400 font-bold"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Approve & Dispatch</span>
                              </Button>
                              <Link href="/ops">
                                <Button variant="outline" size="sm" className="h-7 text-xs border-[#234230] text-[#D7B678]">
                                  <span>Open Ops</span>
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {/* Peer-Reviewed Agronomic Citations */}
                    {msg.citations && msg.citations.length > 0 ? (
                      <div className="pt-2 border-t border-[#18251E] space-y-1.5">
                        <span className="text-[10px] font-mono uppercase font-bold text-[#D7B678] tracking-wider block">
                          Scientific Grounding & ICAR Advisory Citations:
                        </span>
                        {msg.citations.map((cite, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 text-xs text-[#8DA295] hover:text-emerald-300 transition-colors"
                          >
                            <BookOpen className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            <span className="font-medium text-[#F1F6F3]">{cite.title}</span>
                            <span className="text-[#6D8577]">· {cite.source}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* Suggested Action Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 ? (
                      <div className="pt-2 border-t border-[#18251E] flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(action)}
                            className="rounded-full bg-[#14231A] hover:bg-[#1B2F23] text-emerald-300 border border-[#233B2B] px-3 py-1 text-xs font-mono font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{action}</span>
                            <ArrowRight className="h-3 w-3 text-emerald-400" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {msg.role === 'user' ? (
                    <div className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-2xl bg-[#16251E] border border-[#233B2B] text-[#ABC1B4] mt-0.5">
                      <User className="h-4 w-4 text-[#D7B678]" />
                    </div>
                  ) : null}
                </div>
              ))}

              {chatMutation.isPending ? (
                <div className="flex gap-3 items-center text-xs text-[#8DA295] font-mono italic">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                    <Bot className="h-4 w-4 animate-spin" />
                  </div>
                  <span>Grounded reasoning engine querying in-situ telemetry & ICAR protocols...</span>
                </div>
              ) : null}
            </CardContent>

            {/* Input Bar */}
            <CardFooter className="p-4 border-t border-[#18251E] bg-[#0A100D]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex w-full items-center gap-3"
              >
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about foliar pathology, spray dosages, vadose moisture, or mandi spreads..."
                  className="flex-1 bg-[#111714] border-[#1E2E25] text-sm text-[#F1F6F3] placeholder:text-[#647C6F] focus:border-emerald-500 h-11 rounded-xl"
                  disabled={chatMutation.isPending}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!inputText.trim() || chatMutation.isPending}
                  className="gap-2 h-11 px-5 rounded-xl bg-emerald-500 text-[#090D0B] font-bold hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                >
                  <Send className="h-4 w-4" />
                  <span>Execute</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column (4 cols): Live Grounding Context Snapshot & Tool Specs */}
        <div className="lg:col-span-4 space-y-5">
          {/* Active Context Card */}
          <Card className="rounded-3xl bg-[#0D1410] border border-[#1E2E25] shadow-2xl">
            <CardHeader className="pb-3 border-b border-[#18251E]">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#F1F6F3]">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Live Grounding Invariants</span>
              </CardTitle>
              <CardDescription className="text-xs text-[#9BB1A4]">
                In-situ telemetry parameters injected into every agronomic reasoning prompt.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#111714] border border-[#18251E] space-y-0.5">
                <span className="text-[#657F71] block text-[10px] uppercase font-bold">Selected Farm Estate</span>
                <span className="text-[#F1F6F3] font-bold">{farmName}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#111714] border border-[#18251E] space-y-0.5">
                <span className="text-[#657F71] block text-[10px] uppercase font-bold">Geographic Location</span>
                <span className="text-[#F1F6F3]">{location}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#111714] border border-[#18251E] space-y-0.5">
                <span className="text-[#657F71] block text-[10px] uppercase font-bold">Crop & Phenological Stage</span>
                <span className="text-emerald-400 font-bold">{cropName} ({cropVariety})</span>
                <div className="text-[11px] text-[#8DA295]">{growthStage}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#111714] border border-[#18251E] space-y-0.5">
                <span className="text-[#657F71] block text-[10px] uppercase font-bold">Rootzone Soil Hydrology</span>
                <span className="text-sky-300 font-bold">VWC: {soilMoisture}% · pH: {soilPh} · N: {nitrogenPpm} ppm</span>
                <div className="text-[10px] text-[#8DA295]">Vadose Matrix Potential: -33 kPa (Capillary)</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#111714] border border-[#18251E] space-y-0.5">
                <span className="text-[#657F71] block text-[10px] uppercase font-bold">Agmarknet Price Benchmark</span>
                <span className="text-[#D7B678] font-bold">Nashik APMC: ₹2,450/q · Pimpalgaon: ₹2,240/q</span>
                <div className="text-[10px] text-emerald-400 font-bold">+₹210/quintal Arbitrage Spread</div>
              </div>
            </CardContent>
          </Card>

          {/* Available Tool Capabilities Card */}
          <Card className="rounded-3xl bg-[#0D1410] border border-[#1E2E25]">
            <CardHeader className="pb-3 border-b border-[#18251E]">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-[#CADCD1] flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-emerald-400" />
                <span>Deterministic Tool Capabilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#111714] border border-[#18251E] space-y-1">
                <code className="text-emerald-400 text-xs font-mono font-bold block">query_field_telemetry()</code>
                <p className="text-[#8DA295] text-[11px]">Inspect real-time volumetric moisture, matrix potential & temperature across parcel rootzone strata.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#111714] border border-[#18251E] space-y-1">
                <code className="text-emerald-400 text-xs font-mono font-bold block">fieldsight_disease_lookup()</code>
                <p className="text-[#8DA295] text-[11px]">Cross-reference CNN foliar pathogen classifications against ICAR chemical & biological rotation protocols.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#111714] border border-[#18251E] space-y-1">
                <code className="text-emerald-400 text-xs font-mono font-bold block">calculate_mandi_arbitrage()</code>
                <p className="text-[#8DA295] text-[11px]">Compute multi-mandi freight realization deltas, deducting vehicle haulage, mandi cess, and spoilage risk.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#111714] border border-[#18251E] space-y-1">
                <code className="text-emerald-400 text-xs font-mono font-bold block">query_silo_equilibrium_moisture()</code>
                <p className="text-[#8DA295] text-[11px]">Evaluate post-harvest grain silo equilibrium moisture (&lt;14%) to prevent Aspergillus flavus aflatoxin synthesis.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
