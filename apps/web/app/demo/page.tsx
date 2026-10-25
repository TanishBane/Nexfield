"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, RotateCcw, Sprout } from "lucide-react";
import { farmTools } from "@/components/marketing/FarmTools";
import { useDemoStore } from "@/lib/store/useDemoStore";
export default function DemoPage() {
  const [active, setActive] = useState(0);
  const demo = useDemoStore();
  const tool = farmTools[active];
  const Icon = tool.icon;
  return (
    <>
      <div className="intro-band blue">
        <div className="page-intro">
          <span className="sample-label">
            Sample farm data · No account needed
          </span>
          <h1 className="mt-6">A day on the farm.</h1>
          <p>
            Explore a sample tomato farm in Nashik, Maharashtra. Pick a tool
            below and see how the workspace fits together.
          </p>
        </div>
      </div>
      <section className="section-wrap demo-tour">
        <div>
          <h2 className="font-serif text-3xl font-bold mb-6">
            Choose a starting point.
          </h2>
          <div className="demo-options">
            {farmTools.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                aria-controls="demo-detail"
              >
                <t.icon size={22} />
                <span>{t.name}</span>
                <ArrowUpRight className="ml-auto" size={18} />
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              demo.resetDemo();
              setActive(0);
            }}
            className="text-link mt-6"
          >
            <RotateCcw size={16} /> Reset sample farm
          </button>
        </div>
        <div className="demo-spotlight" id="demo-detail" aria-live="polite">
          <Icon size={40} strokeWidth={1.5} />
          <h2>{tool.name}</h2>
          <p>{tool.detail}</p>
          <div className="flex items-center gap-3 mb-7 text-sm">
            <Sprout size={20} />
            <span>
              {demo.farmName}
              <br />
              {demo.areaHectares} ha · {demo.cropName}
            </span>
          </div>
          <Link
            className="farm-button green"
            href={`/demo/${tool.id === "operations" ? "ops" : tool.id}`}
          >
            Open {tool.name.toLowerCase()} <ArrowUpRight size={18} />
          </Link>
          <p className="!text-sm !mb-0 mt-5">
            All readings and results in this demo are sample data.
          </p>
        </div>
      </section>
    </>
  );
}
