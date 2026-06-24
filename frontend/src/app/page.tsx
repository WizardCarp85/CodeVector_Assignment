"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { RiShoppingBagLine, RiArrowRightLine, RiDatabase2Line, RiFilterLine, RiPagesLine, RiZoomInLine } from "react-icons/ri";

const features = [
  { icon: <RiDatabase2Line className="w-6 h-6" />, title: "Live Product Data",     desc: "Real-time data from a PostgreSQL-backed REST API with cursor-based pagination." },
  { icon: <RiFilterLine className="w-6 h-6" />,     title: "Category Filtering",   desc: "Filter by category instantly. Filters persist as you paginate through results." },
  { icon: <RiPagesLine className="w-6 h-6" />,      title: "Smart Pagination",     desc: "Cursor-based pagination keeps browsing smooth across 200,000+ products." },
  { icon: <RiZoomInLine className="w-6 h-6" />,     title: "Detailed Pop-ups",     desc: "Click any product card for a popup with full details including timestamps." },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const show = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  });

  return (
    <div className="relative min-h-screen bg-[#08090d]">

      {/* ── Ambient orbs — NO overflow:hidden on parent ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div className="absolute rounded-full"
          style={{ width: 480, height: 480, left: "5%", top: "5%", background: "#7c3aed", opacity: 0.15, filter: "blur(120px)" }} />
        <div className="absolute rounded-full"
          style={{ width: 320, height: 320, right: "5%", bottom: "10%", background: "#6d28d9", opacity: 0.10, filter: "blur(100px)" }} />
        <div className="absolute rounded-full"
          style={{ width: 240, height: 240, right: "25%", top: "3%", background: "#8b5cf6", opacity: 0.08, filter: "blur(90px)" }} />
      </div>

      {/* Subtle grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.022, backgroundImage: "linear-gradient(rgba(139,92,246,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.8) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

      {/* ── Hero section ── */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center" style={{ zIndex: 1 }}>

        {/* Floating icon */}
        <div className="animate-float mb-8" style={show(0.1)}>
          <div className="animate-pulse-glow w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#7c3aed,#5b21b6)", boxShadow: "0 0 40px rgba(124,58,237,0.5)" }}>
            <RiShoppingBagLine className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-extrabold tracking-tight leading-tight mb-4 text-center" style={{ fontSize: "clamp(2.4rem,7vw,4.5rem)", ...show(0.2) }}>
          <span className="gradient-text">ProductScope</span>
          <br />
          <span className="text-white/90" style={{ fontSize: "clamp(1.5rem,4vw,2.8rem)", fontWeight: 700 }}>
            Product Browser API
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg max-w-md leading-relaxed mb-6" style={{ color: "#9ca3af", ...show(0.3) }}>
          A sleek interface to explore, filter, and inspect products via a high-performance cursor-based REST API.
        </p>

        {/* Badge — below heading */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-10"
          style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.35)", color: "#c4b5fd", ...show(0.4) }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#a78bfa" }} />
          REST API — Product Browser UI
        </div>

        {/* CTA — premium gradient button */}
        <div style={show(0.5)}>
          <Link
            href="/products"
            id="browse-products-btn"
            className="inline-flex items-center gap-3 font-bold text-white relative overflow-hidden"
            style={{
              padding: "14px 36px", borderRadius: 16, fontSize: "1.05rem",
              background: "linear-gradient(135deg,#8b5cf6 0%,#7c3aed 55%,#5b21b6 100%)",
              boxShadow: "0 0 0 1px rgba(139,92,246,0.4),0 8px 32px rgba(124,58,237,0.5),0 2px 8px rgba(0,0,0,0.4)",
              textDecoration: "none", transition: "transform 0.2s,box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(139,92,246,0.5),0 12px 40px rgba(124,58,237,0.65),0 4px 12px rgba(0,0,0,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "0 0 0 1px rgba(139,92,246,0.4),0 8px 32px rgba(124,58,237,0.5),0 2px 8px rgba(0,0,0,0.4)"; }}
          >
            <span className="relative z-10">Browse Products</span>
            <RiArrowRightLine className="relative z-10 w-5 h-5" />
            <span className="animate-shimmer absolute inset-0" style={{ borderRadius: 16 }} />
          </Link>
        </div>

        <p className="mt-14 text-xs flex items-center gap-2"
          style={{ color: "#4b5563", opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 1s" }}>
          Scroll to explore features <span style={{ color: "#7c3aed" }}>↓</span>
        </p>
      </main>

      {/* ── Features section ── */}
      <section className="relative pb-24 px-6" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest font-semibold mb-8"
            style={{ color: "#6b7280", opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 1.1s", letterSpacing: "0.2em" }}>
            What you get
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i}
                className="rounded-2xl p-5 group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(124,58,237,0.05)",
                  border: "1px solid rgba(124,58,237,0.14)",
                  opacity: mounted ? 1 : 0,
                  transition: `opacity 0.5s ease ${1.1 + i * 0.1}s, transform 0.3s ease, background 0.25s, border-color 0.25s`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.1)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.05)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.14)"; }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)", boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "#fff" }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-xs text-center" style={{ color: "#374151" }}>
            Powered by PostgreSQL + Express · 200,000 products · Cursor-based pagination
          </p>
        </div>
      </section>
    </div>
  );
}
