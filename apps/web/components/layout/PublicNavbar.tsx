"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { NexfieldLogo } from "@/components/branding/NexfieldLogo";
export function PublicNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const lastPathname = useRef(pathname);
  useEffect(() => {
    if (lastPathname.current !== pathname) {
      setOpen(false);
      lastPathname.current = pathname;
    }
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="public-header">
      <div className="public-nav">
        <NexfieldLogo href="/" size="lg" />
        <nav
          id="public-navigation"
          aria-label="Main navigation"
          className={`public-links ${open ? "is-open" : ""}`}
        >
          {[
            ["Platform", "/platform"],
            ["How it works", "/how-it-works"],
            ["Solutions", "/solutions"],
            ["About", "/about"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link href="/control" className="mobile-signin">
            Open workspace
          </Link>
        </nav>
        <div className="nav-actions">
          <Link href="/control" className="desktop-signin">
            Open workspace
          </Link>
          <Link className="farm-button green" href="/demo">
            Explore demo <ArrowUpRight size={17} />
          </Link>
          <button
            ref={toggle}
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="public-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
