"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Compass,
  Sprout,
  Droplets,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "@nexfield/ui";
import { useDemoStore } from "@/lib/store/useDemoStore";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  "What fertigation schedule is recommended for flowering tomatoes at our current soil moisture?",
  "How do I treat early blight foliar spots using organic bio-pesticides?",
  "What is the optimal harvest date to capture high modal prices at Nashik APMC?",
  "How does a +4.5°C heatwave shock impact flower abortion and fruit set?",
];

export default function DemoIntelligencePage() {
  const {
    farmName,
    cropName,
    cropVariety,
    sowingDaysAgo,
    growthStage,
    soilMoisture,
    soilPh,
    ambientTemperature,
    canopyNdvi,
  } = useDemoStore();

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: `Greetings from NEXFIELD Intelligence! I am actively monitoring ${farmName}. Your tomato crop (${cropVariety}) is currently at Day ${sowingDaysAgo} (${growthStage}). Soil moisture is ${soilMoisture}% with canopy NDVI at ${canopyNdvi}. How can I assist your crop management today?`,
      timestamp: "Just now",
    },
  ]);

  const handleSend = (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (
        lower.includes("fertigation") ||
        lower.includes("schedule") ||
        lower.includes("fertilizer")
      ) {
        reply = `Based on your current soil moisture (${soilMoisture}%) and Flowering stage (Day ${sowingDaysAgo}), your crop has high Potassium (K) demand for ovule development. We recommend fertigating with soluble Potassium Nitrate (13-0-45) @ 3.5 kg/ha through your drip system, combined with chelated Boron (20% @ 250 g/ha) to maximize pollen viability and prevent blossom-end rot.`;
      } else if (
        lower.includes("blight") ||
        lower.includes("spot") ||
        lower.includes("disease")
      ) {
        reply = `For Alternaria early blight on semi-determinate tomatoes: lower canopy pruning must be conducted first to improve air circulation. Apply Trichoderma viride bio-fungicide (10g/L) during late afternoon. If lesion area exceeds 15% of canopy, rotate with an ICAR-compliant systemic rescue of Azoxystrobin (1 ml/L) with a 7-day pre-harvest interval.`;
      } else if (
        lower.includes("mandi") ||
        lower.includes("harvest") ||
        lower.includes("price")
      ) {
        reply = `Live Agmarknet telemetry indicates Nashik APMC is trading at ₹2,450/quintal (+8.4% above regional modal). Because your fruit set began on Day 42, first flush breaker-stage harvest is anticipated in 14-16 days. Scheduling dispatch on Tuesday or Friday mornings historically yields the lowest transit spoilage and captures peak wholesaler auction volume.`;
      } else if (
        lower.includes("heatwave") ||
        lower.includes("temperature") ||
        lower.includes("heat")
      ) {
        reply = `Under ambient temperatures of ${ambientTemperature}°C or higher, tomato flowers risk style exertion and pollen desiccation. To protect fruit set: pulse drip irrigation for 20 minutes at 11:30 AM to induce evaporative cooling in the boundary layer, and apply Kaolin foliar clay (30g/L) to reflect excessive infrared radiation.`;
      } else {
        reply = `I have cross-referenced your telemetry: Soil Moisture ${soilMoisture}%, pH ${soilPh}, and Canopy NDVI ${canopyNdvi}. For ${cropVariety} in Nashik, all vital biophysical parameters are currently within normal operating thresholds. If you adjust irrigation or weather in the 3D Twin simulator, I will immediately update my recommendations.`;
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "assistant",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="module-page module-insights space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D1DDCD]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09251A]">
              Farm insights
            </h1>
            <Badge
              variant="outline"
              className="text-amber-700 border-amber-500/40 font-mono text-[10px]"
            >
              Context-Aware LLM
            </Badge>
          </div>
          <p className="text-xs text-[#46604D] mt-0.5">
            Real-time telemetry-conditioned agronomic reasoning for {farmName}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setMessages([
              {
                id: "msg-1",
                sender: "assistant",
                text: `Context refreshed. Ready to assist with ${cropName} (${cropVariety}) operations.`,
                timestamp: "Just now",
              },
            ]);
          }}
          className="text-xs gap-1.5 text-[#46604D] border-[#D1DDCD] hover:bg-[#F7FAF2]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Clear Chat</span>
        </Button>
      </div>

      {/* 2. Active Telemetry Grounding Strip */}
      <div className="rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] p-3 text-xs font-mono text-[#46604D] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-700">
          <Sparkles className="h-4 w-4" />
          <span className="font-bold">Active System Context Injected:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span>
            Crop:{" "}
            <strong className="text-[#09251A]">
              {cropName} (Day {sowingDaysAgo})
            </strong>
          </span>
          <span>
            Moisture: <strong className="text-sky-700">{soilMoisture}%</strong>
          </span>
          <span>
            Temp:{" "}
            <strong className="text-amber-700">{ambientTemperature}°C</strong>
          </span>
          <span>
            NDVI: <strong className="text-emerald-700">{canopyNdvi}</strong>
          </span>
          <span>
            Soil pH: <strong className="text-purple-700">{soilPh}</strong>
          </span>
        </div>
      </div>

      {/* 3. Main Chat Interface */}
      <Card className="border-[#D1DDCD] bg-[#F7FAF2] flex flex-col min-h-[500px]">
        {/* Messages Scroll Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[500px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${
                m.sender === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-[#F7FAF2] border border-emerald-600/40 text-emerald-700"
                }`}
              >
                {m.sender === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  m.sender === "user"
                    ? "bg-emerald-50/70 border border-emerald-700/60 text-[#09251A]"
                    : "bg-[#F7FAF2] border border-[#D1DDCD] text-[#09251A]"
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] text-[#46604D] font-mono pb-1">
                  <span>
                    {m.sender === "user"
                      ? "Farm Operator"
                      : "NEXFIELD Agronomist"}
                  </span>
                  <span>{m.timestamp}</span>
                </div>
                <div className="whitespace-pre-line">{m.text}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-xl">
              <div className="h-8 w-8 rounded-xl bg-[#F7FAF2] border border-emerald-600/40 text-emerald-700 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F7FAF2] border border-[#D1DDCD] text-xs text-[#46604D] flex items-center gap-2 font-mono">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  Evaluating agronomic telemetry & formulating response...
                </span>
              </div>
            </div>
          )}
        </CardContent>

        {/* Suggested Queries & Input Footer */}
        <CardFooter className="flex-col gap-3 p-4 border-t border-[#D1DDCD] bg-[#F7FAF2]">
          {/* Quick Query Pills */}
          <div className="w-full flex flex-wrap gap-2">
            {PRESET_QUERIES.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F7FAF2] border border-[#D1DDCD] text-[#46604D] hover:text-emerald-700 hover:border-emerald-600/40 transition-colors text-left"
              >
                💡 {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="w-full flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about crop pathology, irrigation, NPK fertigation, or mandi realization..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#F7FAF2] border border-[#D1DDCD] text-xs text-[#09251A] placeholder-[#46604D] focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <Button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="bg-[#10B981] text-[#070B09] hover:bg-[#34D399] font-bold px-4 py-2.5 rounded-xl text-xs shrink-0 flex items-center gap-1.5"
            >
              <span>Ask Copilot</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
