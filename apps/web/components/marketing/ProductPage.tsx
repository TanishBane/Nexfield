import Link from "next/link";
import { ArrowUpRight, ArrowLeft, Check } from "lucide-react";
import { farmTools, GetStarted } from "./FarmTools";
export function ProductPage({ id }: { id: string }) {
  const tool = farmTools.find((t) => t.id === id)!;
  const demoId = id === "operations" ? "ops" : id;
  const Icon = tool.icon;
  return (
    <>
      <div className={`intro-band ${tool.color}`}>
        <div className="page-intro">
          <Link href="/platform" className="text-link mb-7">
            <ArrowLeft size={17} /> All farm tools
          </Link>
          <h1>{tool.name}</h1>
          <p>{tool.detail}</p>
          <div className="hero-actions">
            <Link className="farm-button green" href={`/demo/${demoId}`}>
              Try with sample data <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" href="/control">
              Open workspace
            </Link>
          </div>
        </div>
      </div>
      <section className="section-wrap product-layout">
        <div>
          <h2>How to use it</h2>
          <ol className="farm-steps">
            {tool.steps.map((step, i) => (
              <li key={step}>
                <span>{i + 1}</span>
                <div>
                  <p>{step}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-base leading-relaxed text-[#46604D]">
            The public workspace starts with sample farm records. Missing
            readings and disconnected sources are clearly marked.
          </p>
        </div>
        <div className="product-preview">
          <Icon strokeWidth={1.4} />
          <h3>Take a look around</h3>
          <p>
            Explore this tool with a sample tomato farm. The demo is labelled
            throughout, so you can tell sample observations from your own farm
            data.
          </p>
          <Link href={`/demo/${demoId}`} className="farm-button green">
            Explore {tool.name.toLowerCase()} <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <GetStarted />
    </>
  );
}
