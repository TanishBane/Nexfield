"use client";
import Link from "next/link";
import { RotateCcw, Sprout, ArrowUpRight } from "lucide-react";
import { useDemoStore } from "@/lib/store/useDemoStore";
export function DemoBanner() {
  const { resetDemo } = useDemoStore();
  return (
    <div className="demo-banner">
      <div>
        <Sprout size={18} />
        <strong>Demo · Sample farm data</strong>
        <span>Explore the tools with a sample tomato farm.</span>
      </div>
      <div>
        <button onClick={resetDemo}>
          <RotateCcw size={14} />
          Reset demo
        </button>
        <Link href="/demo">
          Farm guide <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
