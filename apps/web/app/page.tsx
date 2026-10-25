import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Sprout,
  Droplets,
  ScanLine,
  Sun,
  Leaf,
  MoveUpRight,
  Play,
} from "lucide-react";
import { FarmTools, GetStarted } from "@/components/marketing/FarmTools";

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="farm-hero">
        <div className="hero-copy">
          <span className="intro-tag">
            <Sprout size={17} /> A little intelligence. A lot of growth.
          </span>
          <h1>
            Good days
            <br />
            start in
            <br />
            the field.
          </h1>
          <p>
            Get to know your crops, plan your water, and make your next farm
            decision with confidence.
          </p>
          <div className="hero-actions">
            <Link href="/control" className="farm-button yellow">
              Open sample farm <ArrowUpRight size={20} />
            </Link>
            <Link href="/demo" className="text-link">
              <Play size={16} /> Explore the demo
            </Link>
          </div>
          <div className="hero-note">
            <span className="small-sun">
              <Sun size={22} />
            </span>
            <span>
              From the first seed
              <br />
              <strong>to the next harvest.</strong>
            </span>
          </div>
        </div>
        <div className="hero-photo">
          <Image
            src="/images/farming/rice-farmer.webp"
            alt="A farmer tending a lush green rice field in Vietnam"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          <div className="photo-label">
            <Leaf size={16} /> Rooted in real farming
          </div>
          <Link href="/platform/fieldsight" className="photo-feature">
            <span className="feature-icon">
              <ScanLine size={26} />
            </span>
            <span>
              <small>A closer look</small>
              <strong>Know your crop health</strong>
            </span>
            <ArrowUpRight size={23} />
          </Link>
          <span className="photo-credit">
            Photography by Etienne Girardet / Unsplash
          </span>
        </div>
      </section>
      <div className="field-strip" aria-label="Farm tools">
        <span>
          <Sprout /> Healthier crops
        </span>
        <span>
          <Droplets /> Thoughtful watering
        </span>
        <span>
          <Sun /> Better planning
        </span>
        <span>
          <Leaf /> Every season
        </span>
      </div>
      <section className="section-wrap tools-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Your everyday toolkit</span>
            <h2>
              Your whole farm.
              <br />
              One clear view.
            </h2>
          </div>
          <p>
            Spend less time piecing things together. Bring your field
            observations, daily work, and market decisions into one place.
          </p>
        </div>
        <FarmTools />
      </section>
      <section className="grow-section">
        <div className="grow-photo">
          <Image
            src="/images/farming/planting.webp"
            alt="A farmer planting rice by hand in terraced fields in Bali"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          <span>Care begins in the field.</span>
        </div>
        <div className="grow-copy">
          <span className="section-kicker">Made for the growing season</span>
          <h2>
            A better plan
            <br />
            for every day.
          </h2>
          <p>
            Bring what you know about your land together with the information
            you need to care for it.
          </p>
          <ol className="farm-steps">
            <li>
              <span>1</span>
              <div>
                <h3>Choose a sample farm</h3>
                <p>Explore sample fields, crops, and growing conditions.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <h3>See what needs care</h3>
                <p>
                  Review observations, check leaves, and explore irrigation
                  options.
                </p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <h3>Plan your next move</h3>
                <p>Organize tasks and compare markets before you sell.</p>
              </div>
            </li>
          </ol>
          <Link className="text-link" href="/how-it-works">
            See how it works <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section-wrap season-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Start with a look around</span>
            <h2>
              Meet your next
              <br />
              farm workspace.
            </h2>
          </div>
          <p>
            Try a sample tomato farm. Explore crop health, compare watering
            plans, and move a task from planned to complete.
          </p>
        </div>
        <Link className="demo-invite" href="/demo">
          <div>
            <span className="sample-label">Sample farm data</span>
            <h3>A day on the farm</h3>
            <p>Nashik, Maharashtra · Tomato farm</p>
          </div>
          <span className="round-arrow">
            <MoveUpRight />
          </span>
          <div className="invite-tags">
            <span>Crop health</span>
            <span>Water planning</span>
            <span>Daily tasks</span>
          </div>
        </Link>
      </section>
      <section className="section-wrap faq-section">
        <div>
          <span className="section-kicker">A few useful things</span>
          <h2>Questions?</h2>
        </div>
        <div className="faq-list">
          {[
            [
              "Do I need an account?",
              "No. The public workspace uses labelled sample farm data. Your changes are saved in this browser, and you can reset the sample farm at any time.",
            ],
            [
              "Where does my farm data come from?",
              "The public workspace starts with sample farm records. Imported records and changes are saved in this browser. Data sources and unavailable observations are labelled.",
            ],
            [
              "What does the crop health tool do?",
              "Upload a leaf photo to request an analysis. Review the result alongside your own observations and local agricultural advice.",
            ],
            [
              "Can I use NEXFIELD on my phone?",
              "Yes. The pages and farm tools adapt to smaller screens, with direct access to your main tasks from the mobile navigation.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <GetStarted />
    </div>
  );
}
