import { FarmTools, GetStarted } from "@/components/marketing/FarmTools";
export default function PlatformPage() {
  return (
    <>
      <div className="intro-band">
        <div className="page-intro">
          <span className="section-kicker">The NEXFIELD platform</span>
          <h1>Tools for your farm.</h1>
          <p>
            From checking a leaf to planning a sale, keep your daily decisions
            in one workspace.
          </p>
        </div>
      </div>
      <section className="section-wrap">
        <FarmTools />
      </section>
      <GetStarted />
    </>
  );
}
