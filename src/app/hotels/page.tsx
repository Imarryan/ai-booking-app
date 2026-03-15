"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CITIES = ["All", "Mumbai", "Delhi", "Goa", "Jaipur", "Chennai", "Hyderabad", "Shimla", "Kochi"];
const gold = "#d4af37";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [city, setCity] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const url = city === "All" ? "/api/hotels" : `/api/hotels?city=${city}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setHotels(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  const parseAmenities = (amenities: unknown): string[] => {
    if (Array.isArray(amenities)) return amenities;
    if (typeof amenities === "string") {
      try { return JSON.parse(amenities); } catch { return []; }
    }
    return [];
  };

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#fff", fontFamily: "Georgia, serif" }}>
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: "3rem 2rem 2rem", textAlign: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center top, rgba(212,175,55,0.08), transparent 70%)" }} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ color: gold, letterSpacing: "6px", fontSize: "11px", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          Curated Collection
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 300, margin: "0 0 1rem", letterSpacing: "-1px" }}>
          Luxury Hotels
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif", fontSize: "15px" }}>
          India&apos;s finest stays — {hotels.length} handpicked properties
        </motion.p>
      </motion.div>

      {/* City Filter */}
      <div style={{ padding: "1.5rem 2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {CITIES.map((c, i) => (
          <motion.button
            key={c}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setCity(c)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "8px 20px", borderRadius: "30px",
              border: `1px solid ${city === c ? gold : "rgba(255,255,255,0.12)"}`,
              background: city === c ? gold : "transparent",
              color: city === c ? "#000" : "rgba(255,255,255,0.65)",
              fontSize: "13px", cursor: "pointer", fontFamily: "sans-serif",
              fontWeight: city === c ? 600 : 400, transition: "all 0.2s",
            }}
          >
            {c}
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: "2rem", maxWidth: "1300px", margin: "0 auto" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.5rem" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }} style={{ height: "350px", background: "rgba(255,255,255,0.04)", borderRadius: "4px" }} />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "5rem", color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏨</div>
            <p>No hotels found in {city}. Try another city!</p>
          </motion.div>
        ) : (
          <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.5rem" }}>
            <AnimatePresence mode="popLayout">
              {hotels.map((h, i) => (
                <motion.div
                  key={h.id || h.name}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.06, type: "spring", damping: 25 }}
                  whileHover={{ scale: 1.02, borderColor: gold }}
                  onClick={() => setSelected(h)}
                  style={{ border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", cursor: "pointer", transition: "border-color 0.3s", background: "#0f0f0f" }}
                >
                  <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                    <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.7 }} src={h.image || h.imageUrl} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: "1rem", right: "1rem", background: gold, color: "#000", padding: "3px 10px", fontSize: "11px", fontFamily: "sans-serif", fontWeight: 700 }}>
                      {"★".repeat(Math.min(h.stars || 5, 5))}
                    </div>
                    <div style={{ position: "absolute", top: "1rem", left: "1rem", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.9)", padding: "4px 10px", fontSize: "11px", fontFamily: "sans-serif", letterSpacing: "2px", textTransform: "uppercase" }}>
                      {h.city}
                    </div>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 400, marginBottom: "0.5rem", lineHeight: 1.3 }}>{h.name}</h3>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {h.description}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <span style={{ color: gold, fontSize: "1.1rem" }}>
                        ₹{(h.price || h.minPrice || 0).toLocaleString()}
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "sans-serif" }}>/night</span>
                      </span>
                      <span style={{ fontFamily: "sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>★ {h.rating}</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {parseAmenities(h.amenities).slice(0, 3).map((a: string) => (
                        <span key={a} style={{ fontSize: "10px", padding: "3px 8px", border: "1px solid rgba(212,175,55,0.25)", color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif" }}>{a}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 40 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#0f0f0f", border: `1px solid ${gold}`, maxWidth: "620px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: `0 0 80px rgba(212,175,55,0.15)` }}
            >
              <div style={{ position: "relative" }}>
                <img src={selected.image || selected.imageUrl} alt={selected.name} style={{ width: "100%", height: "260px", objectFit: "cover" }} />
                <button
                  onClick={() => setSelected(null)}
                  style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  ×
                </button>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", padding: "2rem 1.5rem 1rem" }}>
                  <div style={{ color: gold, fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase" }}>{selected.city}</div>
                </div>
              </div>
              <div style={{ padding: "1.5rem 2rem 2rem" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: 300, marginBottom: "0.75rem" }}>{selected.name}</h2>
                <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "sans-serif", lineHeight: 1.8, marginBottom: "1.5rem" }}>{selected.description}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem", fontFamily: "sans-serif", fontSize: "13px" }}>
                  {[
                    ["Price", `₹${(selected.price || selected.minPrice || 0).toLocaleString()}/night`],
                    ["Rating", `★ ${selected.rating}/5`],
                    ["Category", `${"★".repeat(selected.stars || 5)} Hotel`],
                    ["Phone", selected.phone || "Contact hotel"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: "rgba(255,255,255,0.03)", padding: "0.75rem", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "4px" }}>{k}</div>
                      <div style={{ color: k === "Price" ? gold : "#fff" }}>{v}</div>
                    </div>
                  ))}
                </div>
                {selected.address && (
                  <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>📍 {selected.address}</p>
                )}
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                  {parseAmenities(selected.amenities).map((a: string) => (
                    <span key={a} style={{ fontSize: "11px", padding: "4px 10px", border: "1px solid rgba(212,175,55,0.25)", color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>{a}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {selected.mapUrl && (
                    <motion.a
                      whileHover={{ scale: 1.04 }}
                      href={selected.mapUrl}
                      target="_blank"
                      style={{ flex: 1, padding: "12px 20px", border: `1px solid ${gold}`, color: gold, textDecoration: "none", fontSize: "13px", fontFamily: "sans-serif", letterSpacing: "2px", textAlign: "center", display: "block", minWidth: "140px" }}
                    >
                      📍 View on Maps
                    </motion.a>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.04, background: "#b8960c" }}
                    onClick={() => setSelected(null)}
                    style={{ flex: 1, padding: "12px 20px", background: gold, border: "none", color: "#000", fontSize: "13px", fontFamily: "sans-serif", letterSpacing: "2px", cursor: "pointer", fontWeight: 600, minWidth: "140px" }}
                  >
                    Book with Aria ✨
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
