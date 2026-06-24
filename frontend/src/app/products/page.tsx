"use client";

import { useState, useEffect, useCallback } from "react";
import {
  RiShoppingBagLine, RiFilterLine, RiCloseLine,
  RiArrowLeftLine, RiArrowRightLine, RiArrowLeftSLine,
  RiRefreshLine, RiPriceTag3Line, RiCalendarLine,
  RiTimeLine, RiGridFill, RiListCheck, RiCheckLine, RiSettings3Line,
} from "react-icons/ri";
import Link from "next/link";

/* ── Types ── */
interface Product { id: number; name: string; category: string; price: string | number; created_at: string; updated_at: string; }
interface Cursor   { updated_at: string; id: number; }
interface ApiResp  { products: Product[]; nextCursor: Cursor | null; }

/* ── Config ── */
const API_URL = "/api";
const CATS    = ["Electronics", "Books", "Sports", "Clothing", "Furniture", "Toys"];
const LIMITS  = [5, 10, 15, 20, 30, 50, 100];

/* ── Violet colour tokens (inline only — no Tailwind colour classes) ── */
const C = {
  bg:        "#08090d",
  surface:   "rgba(124,58,237,0.05)",
  surfaceMd: "rgba(124,58,237,0.10)",
  surfaceLg: "rgba(124,58,237,0.18)",
  border:    "rgba(124,58,237,0.14)",
  borderMd:  "rgba(124,58,237,0.28)",
  borderHi:  "rgba(124,58,237,0.44)",
  grad:      "linear-gradient(135deg,#8b5cf6 0%,#7c3aed 55%,#5b21b6 100%)",
  gradText:  "linear-gradient(135deg,#c4b5fd 0%,#a78bfa 50%,#7c3aed 100%)",
  v300: "#c4b5fd", v400: "#a78bfa", v600: "#7c3aed",
  white: "#ffffff", muted: "#6b7280", mutedHi: "#9ca3af", mutedLo: "#4b5563",
};

/* ── Helpers ── */
const fDate  = (s: string) => new Date(s).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
const fDT    = (s: string) => new Date(s).toLocaleString("en-US",    { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
const fPrice = (p: string|number) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD" }).format(Number(p));

/* ── Reusable premium button ── */
function PrimaryBtn({ id, onClick, disabled, children, fullWidth }: {
  id?: string; onClick?: () => void; disabled?: boolean; children: React.ReactNode; fullWidth?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <button id={id} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: fullWidth ? "100%" : undefined,
        padding: "10px 22px", borderRadius: 14, border: "none", cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "rgba(124,58,237,0.2)" : C.grad,
        color: disabled ? C.muted : C.white, fontWeight: 600, fontSize: 13,
        boxShadow: !disabled && h ? "0 0 0 1px rgba(139,92,246,0.5),0 10px 30px rgba(124,58,237,0.6)" : !disabled ? "0 0 0 1px rgba(139,92,246,0.35),0 6px 20px rgba(124,58,237,0.4)" : "none",
        transform: h && !disabled ? "scale(1.03)" : "scale(1)",
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.2s ease",
      }}>
      {children}
    </button>
  );
}

function GhostBtn({ id, onClick, disabled, children }: {
  id?: string; onClick?: () => void; disabled?: boolean; children: React.ReactNode;
}) {
  const [h, setH] = useState(false);
  return (
    <button id={id} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "10px 18px", borderRadius: 14, cursor: disabled ? "not-allowed" : "pointer",
        background: h ? C.surfaceMd : C.surface,
        border: `1px solid ${h ? C.borderMd : C.border}`,
        color: h ? C.v300 : C.mutedHi, fontWeight: 500, fontSize: 13,
        opacity: disabled ? 0.35 : 1, transition: "all 0.2s ease",
      }}>
      {children}
    </button>
  );
}

/* ── Product Card ── */
function ProductCard({ product, index, onClick }: { product: Product; index: number; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button id={`product-card-${product.id}`} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="card-in text-left w-full"
      style={{
        animationDelay: `${index * 0.04}s`, cursor: "pointer",
        padding: "1.2rem", borderRadius: 16,
        background: h ? C.surfaceMd : C.surface,
        border: `1px solid ${h ? C.borderMd : C.border}`,
        boxShadow: h ? "0 8px 32px rgba(124,58,237,0.2)" : "none",
        transform: h ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease", position: "relative", overflow: "hidden",
      }}>
      {/* Category + ID */}
      <div className="flex items-center justify-between mb-3">
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 600,
          background: C.surfaceLg, border: `1px solid ${C.borderMd}`, color: C.v300,
        }}>
          <RiPriceTag3Line className="w-2.5 h-2.5" />
          {product.category}
        </span>
        <span style={{ fontSize: 10, color: C.mutedLo, fontFamily: "monospace" }}>#{product.id}</span>
      </div>
      {/* Name */}
      <h3 className="text-sm font-semibold leading-snug mb-3 line-clamp-2"
        style={{ color: h ? C.v300 : "#e8eaf0", transition: "color 0.2s" }}>
        {product.name}
      </h3>
      {/* Price + Date */}
      <div className="flex items-end justify-between pt-2.5"
        style={{ borderTop: `1px solid rgba(124,58,237,0.1)` }}>
        <span style={{ fontSize: 19, fontWeight: 800, background: C.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          {fPrice(product.price)}
        </span>
        <span className="flex items-center gap-1" style={{ fontSize: 10, color: C.mutedLo }}>
          <RiCalendarLine className="w-2.5 h-2.5" />
          {fDate(product.updated_at)}
        </span>
      </div>
      {h && <div style={{ position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%,rgba(124,58,237,0.08) 0%,transparent 65%)" }} />}
    </button>
  );
}

/* ── Product Modal ── */
function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div id="product-modal-overlay" className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(14px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div id="product-modal" className="animate-modal-in w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(160deg,#0e0e1c,#090910)", border: `1px solid ${C.borderMd}`, boxShadow: "0 0 80px rgba(124,58,237,0.25),0 40px 60px rgba(0,0,0,0.65)" }}>
        <div style={{ height: 5, background: C.grad }} />
        {/* Header */}
        <div className="px-6 pt-6 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                style={{ background: C.surfaceLg, border: `1px solid ${C.borderMd}`, color: C.v300 }}>
                <RiPriceTag3Line className="w-3 h-3" />{product.category}
              </span>
              <h2 className="text-white font-bold text-lg leading-tight">{product.name}</h2>
              <p className="text-xs mt-1" style={{ color: C.muted, fontFamily: "monospace" }}>Product ID #{product.id}</p>
            </div>
            <button id="close-modal-btn" onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.mutedHi, cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.surfaceMd; e.currentTarget.style.color = C.white; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.surface;   e.currentTarget.style.color = C.mutedHi; }}>
              <RiCloseLine className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-3">
          <div className="flex items-center justify-between px-5 py-4 rounded-2xl"
            style={{ background: C.surfaceMd, border: `1px solid ${C.borderMd}` }}>
            <span className="text-sm font-medium" style={{ color: C.mutedHi }}>Price</span>
            <span style={{ fontSize: 24, fontWeight: 800, background: C.gradText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {fPrice(product.price)}
            </span>
          </div>
          {[
            { label: "Last Updated", value: fDT(product.updated_at), Icon: RiTimeLine },
            { label: "Created At",   value: fDT(product.created_at),  Icon: RiCalendarLine },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: C.surfaceLg }}>
                <r.Icon className="w-4 h-4" style={{ color: C.v400 }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: C.muted, letterSpacing: "0.1em" }}>{r.label}</p>
                <p className="text-sm font-medium text-white truncate">{r.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <PrimaryBtn id="modal-close-footer-btn" onClick={onClose} fullWidth>Close</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton ── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 animate-pulse"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 w-24 rounded-full" style={{ background: C.surfaceMd }} />
        <div className="h-3 w-8 rounded" style={{ background: C.surface }} />
      </div>
      <div className="h-4 w-full rounded mb-2" style={{ background: C.surfaceMd }} />
      <div className="h-4 w-3/4 rounded mb-4" style={{ background: C.surface }} />
      <div className="flex items-end justify-between pt-2.5" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="h-6 w-20 rounded" style={{ background: C.surfaceMd }} />
        <div className="h-3 w-14 rounded" style={{ background: C.surface }} />
      </div>
    </div>
  );
}

/* ── Filter Modal — centered landscape ── */
function FilterModal({ pendingCat, setPendingCat, pendingLim, setPendingLim, onApply, onClear, onClose }: {
  pendingCat: string; setPendingCat: (v: string) => void;
  pendingLim: number; setPendingLim: (v: number) => void;
  onApply: () => void; onClear: () => void; onClose: () => void;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div id="filter-modal-overlay" className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(14px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div id="filter-modal" className="animate-modal-in w-full max-w-2xl rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(160deg,#0e0e1c,#090910)", border: `1px solid ${C.borderMd}`, boxShadow: "0 0 80px rgba(124,58,237,0.22),0 40px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height: 4, background: C.grad }} />
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: C.surfaceLg, border: `1px solid ${C.borderMd}` }}>
              <RiSettings3Line className="w-3.5 h-3.5" style={{ color: C.v400 }} />
            </div>
            <span className="text-white font-semibold text-sm">Filter Products</span>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surfaceMd; e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.surface;   e.currentTarget.style.color = C.muted; }}>
            <RiCloseLine className="w-3.5 h-3.5" />
          </button>
        </div>
        {/* Two-column body */}
        <div className="grid grid-cols-2 gap-6 p-6">
          {/* LEFT — Category */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase" style={{ color: C.mutedHi, letterSpacing: "0.12em" }}>Category</label>
              {pendingCat && (
                <button onClick={() => setPendingCat("")} style={{ fontSize: 11, color: C.v400, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Clear</button>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <CatRow label="All Categories" selected={!pendingCat} onClick={() => setPendingCat("")} />
              {CATS.map(cat => (
                <CatRow key={cat} label={cat} selected={pendingCat === cat} onClick={() => setPendingCat(pendingCat === cat ? "" : cat)} />
              ))}
            </div>
          </div>
          {/* RIGHT — Limit + Summary + Actions */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase mb-3" style={{ color: C.mutedHi, letterSpacing: "0.12em" }}>Items per page</label>
              <div className="grid grid-cols-4 gap-1.5">
                {LIMITS.map(n => <LimBtn key={n} n={n} sel={pendingLim === n} onClick={() => setPendingLim(n)} />)}
              </div>
              <p className="text-right mt-1.5" style={{ fontSize: 10, color: C.mutedLo }}>Max 100 per API call</p>
            </div>
            {/* Summary */}
            <div className="flex-1 rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-semibold uppercase" style={{ color: C.muted, letterSpacing: "0.12em" }}>Current Selection</p>
              <p className="text-xs" style={{ color: C.mutedHi }}>Category: <span style={{ color: C.v300, fontWeight: 600 }}>{pendingCat || "All"}</span></p>
              <p className="text-xs" style={{ color: C.mutedHi }}>Per page: <span style={{ color: C.v300, fontWeight: 600 }}>{pendingLim} items</span></p>
            </div>
            {/* Actions */}
            <div className="flex gap-2.5">
              <GhostBtn id="clear-filters-btn" onClick={onClear}>Reset</GhostBtn>
              <PrimaryBtn id="apply-filters-btn" onClick={onApply} fullWidth>Apply Filters</PrimaryBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CatRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="flex items-center gap-2.5 text-left w-full"
      style={{
        padding: "8px 12px", borderRadius: 12, cursor: "pointer",
        background: selected ? C.surfaceLg : h ? C.surface : "transparent",
        border: `1px solid ${selected ? C.borderHi : h ? C.border : "transparent"}`,
        transition: "all 0.18s",
      }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
        background: selected ? C.v400 : "#374151",
        boxShadow: selected ? `0 0 8px ${C.v400}99` : "none",
        transform: selected ? "scale(1.3)" : "scale(1)",
        transition: "all 0.18s",
      }} />
      <span className="flex-1 text-sm" style={{ color: selected ? C.v300 : h ? C.mutedHi : C.muted, fontWeight: selected ? 600 : 400 }}>
        {label}
      </span>
      {selected && <RiCheckLine className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.v400 }} />}
    </button>
  );
}

function LimBtn({ n, sel, onClick }: { n: number; sel: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        padding: "8px 4px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600,
        background: sel ? C.grad : h ? C.surfaceMd : C.surface,
        border: `1px solid ${sel ? C.borderHi : C.border}`,
        color: sel ? C.white : h ? C.v300 : C.muted,
        boxShadow: sel ? "0 0 14px rgba(124,58,237,0.45)" : "none",
        transition: "all 0.18s",
      }}>
      {n}
    </button>
  );
}

/* ── Main Page ── */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  const [cursorStack, setCursorStack] = useState<Cursor[]>([]);
  const [nextCursor, setNextCursor]   = useState<Cursor | null>(null);

  const [category, setCategory] = useState("");
  const [limit, setLimit]       = useState(20);
  const [pendingCat, setPendingCat] = useState("");
  const [pendingLim, setPendingLim] = useState(20);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode]     = useState<"grid"|"list">("grid");
  const [totalLoaded, setTotalLoaded] = useState(0);

  const fetchProducts = useCallback(async (cursor: Cursor | null, cat: string, lim: number) => {
    setLoading(true); setError(null);
    try {
      const p = new URLSearchParams();
      p.set("limit", String(lim));
      if (cat) p.set("category", cat);
      if (cursor) { p.set("updated_at", cursor.updated_at); p.set("id", String(cursor.id)); }
      const res = await fetch(`${API_URL}/products?${p}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: ApiResp = await res.json();
      setProducts(data.products); setNextCursor(data.nextCursor); setTotalLoaded(data.products.length);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to fetch."); }
    finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProducts(null, "", 20); }, []);

  const handleNext  = () => { if (!nextCursor) return; setCursorStack(s => [...s, nextCursor]); fetchProducts(nextCursor, category, limit); };
  const handlePrev  = () => { const ns = [...cursorStack]; ns.pop(); setCursorStack(ns); fetchProducts(ns[ns.length-1] ?? null, category, limit); };
  const handleApply = () => { setCategory(pendingCat); setLimit(pendingLim); setCursorStack([]); fetchProducts(null, pendingCat, pendingLim); setFilterOpen(false); };
  const handleClear = () => { setPendingCat(""); setPendingLim(20); setCategory(""); setLimit(20); setCursorStack([]); fetchProducts(null, "", 20); setFilterOpen(false); };
  const handleRefresh = () => { setCursorStack([]); fetchProducts(null, category, limit); };
  const openFilter = () => { setPendingCat(category); setPendingLim(limit); setFilterOpen(true); };

  const page    = cursorStack.length + 1;
  const hasFilt = !!category;
  const gridCls = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4";
  const listCls = "flex flex-col gap-3";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.bg }}>

      {/* Ambient orb — fixed, NOT a flex child in the flow */}
      <div className="fixed pointer-events-none" style={{ zIndex: 0, inset: 0 }}>
        <div className="absolute rounded-full"
          style={{ width: 500, height: 500, left: "50%", top: "35%", transform: "translate(-50%,-50%)", background: "#7c3aed", opacity: 0.07, filter: "blur(130px)" }} />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 w-full" style={{ backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, background: "rgba(8,9,13,0.85)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Link href="/" id="back-home-btn" className="flex items-center gap-1 text-sm transition-colors"
              style={{ color: C.mutedHi, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.white)}
              onMouseLeave={e => (e.currentTarget.style.color = C.mutedHi)}>
              <RiArrowLeftSLine className="w-4 h-4" />Home
            </Link>
            <div className="w-px h-5" style={{ background: C.border }} />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: C.grad, boxShadow: "0 2px 10px rgba(124,58,237,0.4)" }}>
                <RiShoppingBagLine className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white text-sm">Products</span>
              {hasFilt && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: C.surfaceMd, border: `1px solid ${C.borderHi}`, color: C.v300 }}>
                  {category}
                </span>
              )}
            </div>
          </div>
          {/* Right */}
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex gap-0.5 p-1 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              {(["grid","list"] as const).map(m => (
                <button key={m} id={`${m}-view-btn`} onClick={() => setViewMode(m)}
                  className="flex items-center justify-center p-1.5 rounded-lg transition-all"
                  style={{ background: viewMode === m ? C.surfaceLg : "transparent", color: viewMode === m ? C.v300 : C.mutedLo, border: "none", cursor: "pointer" }}>
                  {m === "grid" ? <RiGridFill className="w-4 h-4" /> : <RiListCheck className="w-4 h-4" />}
                </button>
              ))}
            </div>
            {/* Refresh */}
            <button id="refresh-btn" onClick={handleRefresh} disabled={loading}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.mutedHi, cursor: "pointer", opacity: loading ? 0.5 : 1 }}
              onMouseEnter={e => { e.currentTarget.style.background = C.surfaceMd; e.currentTarget.style.color = C.white; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.surface;   e.currentTarget.style.color = C.mutedHi; }}>
              <RiRefreshLine className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            {/* Filter — gradient when active */}
            <button id="filter-toggle-btn" onClick={openFilter}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: hasFilt ? C.grad : C.surface,
                border: `1px solid ${hasFilt ? C.borderHi : C.border}`,
                color: hasFilt ? C.white : C.mutedHi,
                boxShadow: hasFilt ? "0 4px 16px rgba(124,58,237,0.4)" : "none",
                cursor: "pointer",
              }}
              onMouseEnter={e => { if (!hasFilt) { e.currentTarget.style.background = C.surfaceMd; e.currentTarget.style.color = C.v300; } }}
              onMouseLeave={e => { if (!hasFilt) { e.currentTarget.style.background = C.surface;   e.currentTarget.style.color = C.mutedHi; } }}>
              <RiFilterLine className="w-4 h-4" />Filter
              {hasFilt && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.v300 }} />}
            </button>
          </div>
        </div>
      </header>

      {/* Stats bar */}
      <div className="w-full" style={{ borderBottom: `1px solid rgba(124,58,237,0.06)`, background: "rgba(124,58,237,0.015)", zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs" style={{ color: C.mutedLo }}>
          <span>Page {page} · {loading ? "Loading…" : `${totalLoaded} products`}{limit !== 20 ? ` (${limit}/page)` : ""}</span>
          {hasFilt && (
            <button onClick={handleClear} className="flex items-center gap-1 transition-colors"
              style={{ background: "none", border: "none", cursor: "pointer", color: C.mutedLo, fontSize: 11 }}
              onMouseEnter={e => (e.currentTarget.style.color = C.v400)}
              onMouseLeave={e => (e.currentTarget.style.color = C.mutedLo)}>
              <RiCloseLine className="w-3 h-3" />
              Clear: <span style={{ color: C.v400, fontWeight: 600, marginLeft: 2 }}>{category}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6" style={{ zIndex: 1, position: "relative" }}>
        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <RiCloseLine className="w-8 h-8" style={{ color: C.v400 }} />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Failed to load products</h3>
            <p className="text-sm mb-6 max-w-sm" style={{ color: C.muted }}>{error}</p>
            <PrimaryBtn onClick={handleRefresh}>Try Again</PrimaryBtn>
          </div>
        )}
        {/* Skeletons */}
        {loading && (
          <div className={viewMode === "grid" ? gridCls : listCls}>
            {Array.from({ length: Math.min(limit, 20) }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}
        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <div className={viewMode === "grid" ? gridCls : listCls}>
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} onClick={() => setSelected(p)} />)}
          </div>
        )}
        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <RiShoppingBagLine className="w-8 h-8" style={{ color: C.mutedLo }} />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No products found</h3>
            <p className="text-sm" style={{ color: C.muted }}>Try a different category or clear your filters.</p>
          </div>
        )}
      </main>

      {/* ── Pagination footer ── */}
      {!loading && !error && products.length > 0 && (
        <div className="sticky bottom-0 w-full z-20" style={{ backdropFilter: "blur(20px)", borderTop: `1px solid ${C.border}`, background: "rgba(8,9,13,0.92)" }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <GhostBtn id="prev-page-btn" onClick={handlePrev} disabled={cursorStack.length === 0}>
              <RiArrowLeftLine className="w-4 h-4" /><span>Previous</span>
            </GhostBtn>
            {/* Page dots */}
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: C.mutedLo }}>Page</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: page }).map((_, i) => (
                  <div key={i} className="rounded-full transition-all duration-300"
                    style={{ height: 6, width: i === page-1 ? 20 : 6, background: i === page-1 ? C.v600 : C.surfaceMd }} />
                ))}
              </div>
              <span className="text-sm font-bold text-white">{page}</span>
            </div>
            <PrimaryBtn id="next-page-btn" onClick={handleNext} disabled={!nextCursor}>
              <span>Next</span><RiArrowRightLine className="w-4 h-4" />
            </PrimaryBtn>
          </div>
        </div>
      )}

      {/* Modals */}
      {filterOpen && <FilterModal pendingCat={pendingCat} setPendingCat={setPendingCat} pendingLim={pendingLim} setPendingLim={setPendingLim} onApply={handleApply} onClear={handleClear} onClose={() => setFilterOpen(false)} />}
      {selected   && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
