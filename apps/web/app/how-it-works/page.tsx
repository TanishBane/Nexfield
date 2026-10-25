import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GetStarted } from "@/components/marketing/FarmTools";
export default function HowItWorksPage() {
  return (
    <>
      <div className="intro-band yellow">
        <div className="page-intro">
          <h1>How it works.</h1>
          <p>
            Start with your land. Add your observations. Build a plan for the
            day ahead.
          </p>
          <div className="hero-actions">
            <Link href="/demo" className="farm-button green">
              Walk through a sample farm <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
      <section className="section-wrap">
        {[
          [
            "Choose a sample farm",
            "Choose a sample estate and explore its field area, crop, and soil details. Your changes are saved in this browser.",
          ],
          [
            "Bring in your observations",
            "Review available data, upload a crop photo, and keep track of changes in the field. You can always see when information is missing.",
          ],
          [
            "Explore your options",
            "Compare irrigation scenarios, review crop health results, and check available mandi prices. Use the details to support your own decisions.",
          ],
          [
            "Plan the work",
            "Create tasks, track progress, and organize the supplies and storage your harvest needs. Come back to your overview to plan the next day.",
          ],
        ].map(([title, description], i) => (
          <article key={title} className="story-row">
            <span className="step-number">{i + 1}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>
      <GetStarted />
    </>
  );
}
