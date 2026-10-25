import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GetStarted } from "@/components/marketing/FarmTools";
export default function SolutionsPage() {
  return (
    <>
      <div className="intro-band orange">
        <div className="page-intro">
          <h1>Everyday farm care.</h1>
          <p>
            Practical tools for the questions that come up throughout the
            growing season.
          </p>
        </div>
      </div>
      <section className="section-wrap">
        {[
          [
            "Crop care",
            "Inspect leaf symptoms and keep crop observations in context. Review the findings before deciding what needs a closer look.",
            "fieldsight",
          ],
          [
            "Water use",
            "Explore how different irrigation inputs could affect your field. Compare scenarios with the crop and soil information you have.",
            "twin",
          ],
          [
            "Field work",
            "Keep daily jobs, resource records, and harvest storage organized. Update tasks as the work gets done.",
            "operations",
          ],
          [
            "Selling your harvest",
            "Compare available mandi prices and account for transport costs when planning where to sell.",
            "markets",
          ],
        ].map(([title, description, id]) => (
          <article className="story-row" key={id}>
            <ArrowUpRight className="text-emerald-700" size={34} />
            <div>
              <h2>{title}</h2>
              <Link className="text-link mt-6" href={`/platform/${id}`}>
                Explore the tool <ArrowUpRight size={16} />
              </Link>
            </div>
            <p>{description}</p>
          </article>
        ))}
      </section>
      <GetStarted />
    </>
  );
}
