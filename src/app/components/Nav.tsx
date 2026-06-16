import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronDown, LogOut, Plus, Shield, User, Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const sans  = { fontFamily: "'DM Sans', system-ui, sans-serif" } as const;
const mono  = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

export function Nav({ transparent = false }: { transparent?: boolean }) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!transparent) return;
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [transparent]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const glass = transparent && !scrolled;
  const tc    = glass ? "rgba(255,255,255,0.7)" : "rgba(13,27,42,0.55)";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: glass ? "linear-gradient(to bottom,rgba(13,27,42,0.78),transparent)" : "#fff", borderBottom: glass ? "none" : "1px solid rgba(13,27,42,0.08)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link to="/">
          <p className="font-black text-2xl leading-none" style={{ ...serif, color: glass ? "#fff" : "#0D1B2A" }}>
            Sort<span style={{ color: "#FF6B35", fontStyle: "italic" }}>.</span>
          </p>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/events" className="text-sm font-medium hover:text-[#FF6B35] transition-colors" style={{ ...sans, color: tc }}>Sorties</Link>
          {currentUser && (
            <Link to="/events/create" className="text-sm font-medium hover:text-[#FF6B35] transition-colors" style={{ ...sans, color: tc }}>Organiser</Link>
          )}
          {currentUser?.role === "admin" && (
            <Link to="/admin" className="text-sm font-medium hover:text-[#FF6B35] transition-colors" style={{ ...sans, color: tc }}>Admin</Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border transition-all hover:border-[#FF6B35]/40"
                style={{ borderColor: glass ? "rgba(255,255,255,0.25)" : "rgba(13,27,42,0.12)" }}>
                <img src={currentUser.avatar} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-sm font-medium" style={{ ...sans, color: glass ? "#fff" : "#0D1B2A" }}>{currentUser.name.split(" ")[0]}</span>
                <ChevronDown size={13} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} style={{ color: glass ? "rgba(255,255,255,0.5)" : "rgba(13,27,42,0.4)" }} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-[#0D1B2A]" style={sans}>{currentUser.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize" style={mono}>{currentUser.generation}{currentUser.role === "admin" && " · Admin"}</p>
                  </div>
                  <Link to={`/profile/${currentUser.id}`} onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#0D1B2A] hover:bg-gray-50 transition-colors" style={sans}>
                    <User size={14} className="text-gray-400" /> Mon profil
                  </Link>
                  <Link to="/events/create" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#0D1B2A] hover:bg-gray-50 transition-colors" style={sans}>
                    <Plus size={14} className="text-gray-400" /> Créer un événement
                  </Link>
                  {currentUser.role === "admin" && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-[#FF6B35] hover:bg-orange-50 transition-colors" style={sans}>
                      <Shield size={14} /> Administration
                    </Link>
                  )}
                  <div className="border-t border-gray-100" />
                  <button onClick={() => { logout(); setUserMenuOpen(false); navigate("/"); }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors w-full" style={sans}>
                    <LogOut size={14} /> Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium px-4 py-2 rounded-full hover:text-[#FF6B35] transition-colors"
                style={{ ...sans, color: glass ? "rgba(255,255,255,0.8)" : "#0D1B2A" }}>
                Connexion
              </Link>
              <Link to="/auth?tab=register"
                className="text-sm font-semibold px-5 py-2.5 rounded-full text-white hover:scale-105 transition-transform"
                style={{ ...sans, background: "#FF6B35", boxShadow: "0 4px 16px rgba(255,107,53,0.35)" }}>
                Rejoindre
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 rounded-xl" style={{ color: glass ? "#fff" : "#0D1B2A" }}
          onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-2">
          <Link to="/events" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium text-[#0D1B2A] hover:text-[#FF6B35] transition-colors" style={sans}>Sorties</Link>
          {currentUser && <Link to="/events/create" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium text-[#0D1B2A]" style={sans}>Organiser</Link>}
          {currentUser?.role === "admin" && <Link to="/admin" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium text-[#FF6B35]" style={sans}>Admin</Link>}
          <div className="border-t border-gray-100 pt-3 mt-1 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link to={`/profile/${currentUser.id}`} onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium text-[#0D1B2A]" style={sans}>Mon profil</Link>
                <button onClick={() => { logout(); setMobileOpen(false); navigate("/"); }} className="py-2.5 text-sm font-medium text-red-500 text-left" style={sans}>Se déconnecter</button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="py-2.5 text-sm font-medium text-[#0D1B2A]" style={sans}>Connexion</Link>
                <Link to="/auth?tab=register" onClick={() => setMobileOpen(false)} className="py-3 text-sm font-semibold text-white text-center rounded-xl" style={{ ...sans, background: "#FF6B35" }}>Rejoindre</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
