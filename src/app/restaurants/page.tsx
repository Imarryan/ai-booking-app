"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CITIES = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Goa", "Jaipur"];
const gold = "#d4af37";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [city, setCity] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const url = city === "All" ? "/api/restaurants" : `/api/restaurants?city=${city}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setRestaurants(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

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
          Culinary Excellence
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 300, margin: "0 0 1rem" }}>
          Finest Restaurants
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif" }}>
          India&apos;s most celebrated dining experiences
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.5rem" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }} style={{ height: "320px", background: "rgba(255,255,255,0.04)" }} />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "5rem", color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽️</div>
            <p>No restaurants found in {city}. Try another city!</p>
          </motion.div>
        ) : (
          <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1.5rem" }}>
            <AnimatePresence mode="popLayout">
              {restaurants.map((r, i) => (
                <motion.div
                  key={r.id || r.name}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.06, type: "spring", damping: 25 }}
                  whileHover={{ scale: 1.02, borderColor: gold }}
                  onClick={() => setSelected(r)}
                  style={{ border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", cursor: "pointer", transition: "border-color 0.3s", background: "#0f0f0f" }}
                >
                  <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                    <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.7 }} src={r.image || r.imageUrl} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", bottom: "0.75rem", left: "1rem" }}>
                      <span style={{ fontSize: "10px", color: gold, letterSpacing: "2px", textTransform: "uppercase", border: `1px solid ${gold}`, padding: "2px 8px", fontFamily: "sans-serif" }}>{r.cuisine}</span>
                    </div>
                    <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "3px 8px", fontFamily: "sans-serif", fontSize: "12px", color: gold }}>
                      ★ {r.rating}
                    </div>
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 400, marginBottom: "0.4rem" }}>{r.name}</h3>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {r.description}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "sans-serif", fontSize: "13px" }}>
                      <span style={{ color: "rgba(255,255,255,0.45)" }}>{r.city}</span>
                      <span style={{ color: gold }}>{r.priceRange}</span>
                    </div>
                    {(r.openHours || r.openTime) && (
                      <div style={{ marginTop: "0.5rem", fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif" }}>
                        🕐 {r.openHours || `${r.openTime}–${r.closeTime}`}
                      </div>
                    )}
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
              style={{ background: "#0f0f0f", border: `1px solid ${gold}`, maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: `0 0 80px rgba(212,175,55,0.15)` }}
            >
              <div style={{ position: "relative" }}>
                <img src={selected.image || selected.imageUrl} alt={selected.name} style={{ width: "100%", height: "240px", objectFit: "cover" }} />
                <button
                  onClick={() => setSelected(null)}
                  style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", fontSize: "20px", cursor: "pointer" }}
                >
                  ×
                </button>
                <div style={{ position: "absolute", bottom: "0.75rem", left: "1.5rem" }}>
                  <span style={{ fontSize: "10px", color: gold, letterSpacing: "3px", textTransform: "uppercase", border: `1px solid ${gold}`, padding: "3px 10px", fontFamily: "sans-serif" }}>{selected.cuisine}</span>
                </div>
              </div>
              <div style={{ padding: "1.5rem 2rem 2rem" }}>
                <h2 style={{ fontSize: "1.9rem", fontWeight: 300, margin: "0 0 0.75rem" }}>{selected.name}</h2>
                <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "sans-serif", lineHeight: 1.8, marginBottom: "1.5rem" }}>{selected.description}</p>
                <div style={{ fontFamily: "sans-serif", fontSize: "13px", marginBottom: "1.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    {[
                      ["Rating", `★ ${selected.rating}/5`],
                      ["Price", selected.priceRange],
                      ["Hours", `🕐 ${selected.openHours || `${selected.openTime || ""}–${selected.closeTime || ""}`}`],
                      ["Phone", selected.phone || "Contact restaurant"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ background: "rgba(255,255,255,0.03)", padding: "0.75rem", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: "4px" }}>{k}</div>
                        <div style={{ color: k === "Rating" || k === "Price" ? gold : "#fff" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {selected.address && (
                  <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>📍 {selected.address}</p>
                )}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {selected.mapUrl && (
                    <motion.a
                      whileHover={{ scale: 1.04 }}
                      href={selected.mapUrl}
                      target="_blank"
                      style={{ flex: 1, padding: "12px", border: `1px solid ${gold}`, color: gold, textDecoration: "none", fontSize: "13px", fontFamily: "sans-serif", letterSpacing: "2px", textAlign: "center" }}
                    >
                      📍 View on Maps
                    </motion.a>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    onClick={() => setSelected(null)}
                    style={{ flex: 1, padding: "12px", background: gold, border: "none", color: "#000", fontSize: "13px", fontFamily: "sans-serif", letterSpacing: "2px", cursor: "pointer", fontWeight: 600 }}
                  >
                    Reserve with Aria ✨
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
