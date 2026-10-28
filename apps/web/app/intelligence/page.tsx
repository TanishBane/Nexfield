"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
} from "lucide-react";
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
} from "@nexfield/ui";
import { apiClient } from "@/lib/api";
import { useFarmStore } from "@/lib/store/useFarmStore";
import { useDemoStore } from "@/lib/store/useDemoStore";
import type { IntelligenceChatMessage } from "@nexfield/contracts";

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
    id: "msg-init-1",
    role: "assistant",
    content: `Hello! I am **NEXFIELD Intelligence**, an agronomic reasoning engine grounded in your real-time farm sensor feeds, weather microclimate forecasts, and APMC Mandi market intelligence.

Active Context: **GreenValley Bio-Research Agrohub (Punjab)**. North Sector Alpha (FLD-N01) is currently in anthesis flowering stage (Wheat HD-3086). How may I assist your cultivation, spray schedules, or market timing today?`,
    timestamp: "2026-10-24T00:30:00Z",
    suggestedActions: [
      "Query rootzone soil telemetry for Sector Alpha",
      "Analyze Yellow Rust foliar risk & dosage",
      "Evaluate Khanna vs Rajpura Mandi arbitrage",
      "Simulate 72h irrigation withholding plan",
    ],
    citations: [
      {
        title: "ICAR-IIWBR Wheat Crop Protection Advisory Bulletin 2026",
        source: "Indian Institute of Wheat & Barley Research, Karnal",
      },
    ],
    contextSnapshot: {
      farmName: "GreenValley Agrohub",
      selectedField: "North Sector Alpha (FLD-N01)",
      cropVariety: "Wheat HD-3086",
    },
  },
];

export default function IntelligencePage() {
  const { selectedFarmId, selectedFieldId } = useFarmStore();
  const demoStore = useDemoStore();
  const [messages, setMessages] = useState<ExtendedMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
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
      let requiresConfirmation: ExtendedMessage["requiresConfirmation"];

      if (
        q.includes("telemetry") ||
        q.includes("moisture") ||
        q.includes("soil")
      ) {
        toolExecution = {
          toolName: "query_field_telemetry",
          parameters: { fieldId: selectedFieldId || "FLD-N01", depthCm: 15 },
          output:
            "Moisture: 41.35%, pH: 7.15, N: 210.5 kg/ha, EC: 0.36 dS/m. Rootzone status: Optimal capillary retention.",
        };
      } else if (
        q.includes("rust") ||
        q.includes("spray") ||
        q.includes("disease")
      ) {
        toolExecution = {
          toolName: "fieldsight_disease_lookup",
          parameters: {
            species: "Triticum aestivum",
            lesionPattern: "linear_uredinia",
          },
          output:
            "Match: Puccinia striiformis (Yellow Rust). Severity: Moderate (14.8% canopy). Advisory: Propiconazole 25% EC.",
        };
        requiresConfirmation = {
          actionType: "Schedule Fungicide Spray Work Order",
          details:
            "Dispatch 500 ml/ha Propiconazole 25% EC spray on Sector Alpha North border in NEXFIELD Ops.",
        };
      } else if (
        q.includes("mandi") ||
        q.includes("arbitrage") ||
        q.includes("price")
      ) {
        toolExecution = {
          toolName: "calculate_spatial_arbitrage",
          parameters: { originMandi: "Khanna Mandi", commodity: "Wheat" },
          output:
            "Rajpura Terminal: ₹2,640/q. Khanna APMC: ₹2,580/q. Net freight delta: +₹166/quintal.",
        };
      }

      const serverTool = (res.data as any)?.toolExecution;
      const finalToolExecution = serverTool && serverTool.toolName
        ? {
            toolName: serverTool.toolName,
            parameters: serverTool.parameters || {},
            output: serverTool.output || "",
          }
        : toolExecution;

      const extendedReply: ExtendedMessage = {
        ...res.data,
        toolExecution: finalToolExecution,
        requiresConfirmation: (res.data as any)?.requiresConfirmation || requiresConfirmation,
      };

      setMessages((prev) => [...prev, extendedReply]);
    },
    onError: (err: any) => {
      const offlineReply: ExtendedMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
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
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    chatMutation.mutate(text);
  };

  const confirmAction = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.requiresConfirmation
          ? {
              ...m,
              requiresConfirmation: {
                ...m.requiresConfirmation,
                confirmed: true,
              },
            }
          : m,
      ),
    );
  };

  return (
    <div className="module-page module-insights space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#D1DDCD]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#09251A] flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-[#048547]" />
              Farm insights
            </h1>
            <Badge
              variant="outline"
              size="sm"
              className="font-mono text-[#005B36] border-[#B8D494] bg-[#E5F2CF]"
            >
              Tool Calling LLM
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-[#46604D] mt-1">
            Real-time tool execution, live telemetry grounding, cited ICAR
            research, and operational dispatch confirmation.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#D1DDCD] text-xs font-mono shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-[#048547] motion-safe:animate-pulse" />
          <span className="text-[#46604D]">
            Grounding:{" "}
            <strong className="text-[#005B36] font-semibold">
              Khanna Agrohub Live Telemetry
            </strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Chat Stream & Farm Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Interactive Conversation UI */}
        <div className="lg:col-span-8">
          <Card className="flex flex-col h-[650px] border-[#D1DDCD] bg-white shadow-xs">
            {/* Messages Stream */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" ? (
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-[#E5F2CF] border border-[#B8D494] text-[#005B36] shadow-2xs">
                      <Bot className="h-4 w-4 text-[#048547]" />
                    </div>
                  ) : null}

                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed border space-y-2.5 shadow-2xs ${
                      msg.role === "user"
                        ? "bg-[#E5F2CF] border-[#B8D494] text-[#09251A] font-medium"
                        : "bg-[#F7FAF2] border-[#D1DDCD] text-[#09251A]"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none whitespace-pre-line text-[#09251A]">
                      {msg.content}
                    </div>

                    {/* Tool Execution Result Display */}
                    {msg.toolExecution ? (
                      <div className="rounded-xl bg-white border border-[#D1DDCD] p-3 font-mono text-[11px] space-y-1 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-[#005B36] font-bold">
                          <Wrench className="h-3.5 w-3.5 text-[#048547]" />
                          <span>
                            Tool Executed: {msg.toolExecution.toolName}()
                          </span>
                        </div>
                        <p className="text-[#46604D] leading-relaxed">
                          {msg.toolExecution.output}
                        </p>
                      </div>
                    ) : null}

                    {/* Interactive Action Confirmation Card */}
                    {msg.requiresConfirmation ? (
                      <div className="rounded-xl bg-white border border-[#B8D494] p-3.5 space-y-2 text-xs shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#005B36] flex items-center gap-1.5">
                            <AlertCircle className="h-3.5 w-3.5 text-[#048547]" />
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
                        <p className="text-[#46604D] leading-relaxed">
                          {msg.requiresConfirmation.details}
                        </p>
                        {!msg.requiresConfirmation.confirmed ? (
                          <div className="flex justify-end gap-2 pt-1">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => confirmAction(msg.id)}
                              className="h-8 text-xs gap-1.5 bg-[#048547] text-white hover:bg-[#005B36] font-semibold cursor-pointer shadow-xs"
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
                      <div className="mt-3 pt-2.5 border-t border-[#D1DDCD] space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#46604D] tracking-wider block">
                          Agronomic Citations & References
                        </span>
                        {msg.citations.map((cite, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 text-[11px] text-[#46604D] hover:text-[#005B36] cursor-pointer"
                          >
                            <BookOpen className="h-3 w-3 text-[#048547] shrink-0" />
                            <span className="font-medium">{cite.title}</span>
                            <span className="text-[#46604D]">
                              ({cite.source})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* Suggested Action Chips */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 ? (
                      <div className="mt-3 pt-2 border-t border-[#D1DDCD] flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(action)}
                            className="rounded-full bg-white hover:bg-[#EAF1E7] text-[#005B36] border border-[#B8D494] px-3 py-1.5 text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <span>{action}</span>
                            <ArrowRight className="h-3 w-3 text-[#048547]" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {msg.role === "user" ? (
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-white border border-[#D1DDCD] text-[#09251A] shadow-2xs">
                      <User className="h-4 w-4" />
                    </div>
                  ) : null}
                </div>
              ))}

              {chatMutation.isPending ? (
                <div className="flex gap-3 items-center text-xs text-[#46604D] italic">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E5F2CF] border border-[#B8D494] text-[#005B36]">
                    <Bot className="h-4 w-4 motion-safe:animate-spin text-[#048547]" />
                  </div>
                  <span>
                    Synthesizing farm context, executing tool queries, and
                    checking advisories...
                  </span>
                </div>
              ) : null}
            </CardContent>

            {/* Input Bar */}
            <CardFooter className="p-3 border-t border-[#D1DDCD] bg-[#F7FAF2]">
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
                  className="flex-1 bg-white border-[#D1DDCD]"
                  disabled={chatMutation.isPending}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!inputText.trim() || chatMutation.isPending}
                  className="gap-1.5 bg-[#048547] text-white hover:bg-[#005B36] font-semibold min-h-[44px] cursor-pointer shadow-xs"
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
          <Card className="border-[#D1DDCD] bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#048547]" />
                Live Grounding Context
              </CardTitle>
              <CardDescription>
                Telemetry parameters injected into every LLM agronomic inference
                call.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-0.5">
                <span className="text-[#46604D] block text-[10px] font-semibold">
                  SELECTED ESTATE
                </span>
                <span className="text-[#09251A] font-bold text-sm">
                  {demoStore.farmName}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-0.5">
                <span className="text-[#46604D] block text-[10px] font-semibold">
                  ESTATE LOCATION
                </span>
                <span className="text-[#09251A] font-bold">
                  {demoStore.location}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-0.5">
                <span className="text-[#46604D] block text-[10px] font-semibold">
                  CROP & PHENOLOGY
                </span>
                <span className="text-[#005B36] font-bold">
                  {demoStore.cropName} ({demoStore.cropVariety}) •{" "}
                  {demoStore.growthStage}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-0.5">
                <span className="text-[#46604D] block text-[10px] font-semibold">
                  SOIL HYDROLOGY
                </span>
                <span className="text-[#0284C7] font-semibold tabular-nums">
                  Moisture: {demoStore.soilMoisture}% • pH: {demoStore.soilPh} •
                  N: {demoStore.nitrogenPpm} ppm
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] space-y-0.5">
                <span className="text-[#46604D] block text-[10px] font-semibold">
                  MANDI BENCHMARK
                </span>
                <span className="text-[#92400E] font-semibold tabular-nums">
                  Khanna APMC: ₹2,580/q • Rajpura: ₹2,640/q
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D1DDCD] bg-white shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#46604D]">
                Available Tool Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
                <code className="text-[#005B36] font-bold text-[11px] block">
                  query_field_telemetry
                </code>
                <span className="text-[#46604D] text-[11px]">
                  Inspect real-time rootzone sensor metrics
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
                <code className="text-[#005B36] font-bold text-[11px] block">
                  fieldsight_disease_lookup
                </code>
                <span className="text-[#46604D] text-[11px]">
                  Query CNN disease classification & spray dosage
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD]">
                <code className="text-[#005B36] font-bold text-[11px] block">
                  calculate_spatial_arbitrage
                </code>
                <span className="text-[#46604D] text-[11px]">
                  Compute multi-mandi transport margin deltas
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
