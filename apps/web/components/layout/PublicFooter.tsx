import Link from "next/link";
import { NexfieldLogo } from "@/components/branding/NexfieldLogo";
import { ArrowUpRight } from "lucide-react";
export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="footer-main">
        <div>
          <NexfieldLogo href="/" size="lg" />
          <p>
            Good information.
            <br />
            Better days on the farm.
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/platform">Platform</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/solutions">Solutions</Link>
        </div>
        <div>
          <h3>Get started</h3>
          <Link href="/demo">Sample farm</Link>
          <Link href="/control">Open workspace</Link>
          <Link href="/about">Our team</Link>
        </div>
        <div className="footer-note">
          <span>Built for a growing world.</span>
          <p>An agricultural intelligence project for ADAPPT 5.0.</p>
          <a
            href="https://github.com/TanishBane/Nexfield"
            target="_blank"
            rel="noreferrer"
          >
            View the project <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} NEXFIELD</span>
        <span>
          Photography:{" "}
          <a
            href="https://unsplash.com/@etiennegirardet"
            target="_blank"
            rel="noreferrer"
          >
            Etienne Girardet
          </a>{" "}
          &{" "}
          <a
            href="https://unsplash.com/@shayanghiasvand"
            target="_blank"
            rel="noreferrer"
          >
            Shayan Ghiasvand
          </a>{" "}
          / Unsplash
        </span>
      </div>
    </footer>
  );
}
