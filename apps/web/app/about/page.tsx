import { ArrowUpRight } from "lucide-react";
import { GetStarted } from "@/components/marketing/FarmTools";
export default function AboutPage() {
  return (
    <>
      <div className="intro-band pink">
        <div className="page-intro">
          <h1>Built around farming.</h1>
          <p>
            NEXFIELD brings crop care, water planning, farm work, and market
            information into one accessible workspace.
          </p>
        </div>
      </div>
      <section className="section-wrap">
        <div className="section-heading">
          <h2>Our project.</h2>
          <p>
            Created for ADAPPT 5.0, Round 2, in AI in Food Technology. Our focus
            is helping people understand the information behind their farm
            decisions.
          </p>
        </div>
        <div className="team-grid">
          {[
            {
              name: "Tanish Bane",
              initials: "TB",
              role: "Frontend & product",
              description:
                "Builds the interfaces, visual design, and interactive farm experiences.",
              url: "https://github.com/TanishBane",
            },
            {
              name: "Rohan Panchal",
              initials: "RP",
              role: "Backend & machine learning",
              description:
                "Builds the farm data services, authentication, and machine learning systems.",
              url: "https://github.com/panchalrohan44",
            },
          ].map((member) => (
            <article className="team-card" key={member.name}>
              <span className="team-initial">{member.initials}</span>
              <h3>{member.name}</h3>
              <strong>{member.role}</strong>
              <p className="mt-4">{member.description}</p>
              <a
                href={member.url}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                GitHub profile <ArrowUpRight size={18} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <GetStarted />
    </>
  );
}
