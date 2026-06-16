import { Link } from "react-router";
import { Heart } from "lucide-react";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const sans  = { fontFamily: "'DM Sans', system-ui, sans-serif" } as const;
const mono  = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

export function Footer() {
  return (
    <footer className="bg-[#060E16] border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <p className="font-black text-2xl text-white mb-3" style={serif}>
              Sort<span style={{ color: "#FF6B35", fontStyle: "italic" }}>.</span>
            </p>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs" style={sans}>
              L'application qui transforme une simple sortie en famille en une expérience sociale intergénérationnelle.
            </p>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="text-white/20 text-xs" style={mono}>Made with</span>
              <Heart size={11} className="text-[#FF6B35]" fill="#FF6B35" />
              <span className="text-white/20 text-xs" style={mono}>en France</span>
            </div>
          </div>
          <div>
            <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-4" style={mono}>Plateforme</p>
            <div className="flex flex-col gap-2.5">
              {[{ to: "/events", l: "Toutes les sorties" }, { to: "/events/create", l: "Organiser une sortie" }, { to: "/auth?tab=register", l: "Créer un compte" }, { to: "/auth", l: "Se connecter" }].map(({ to, l }) => (
                <Link key={to} to={to} className="text-sm text-white/30 hover:text-white/65 transition-colors" style={sans}>{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-4" style={mono}>Légal</p>
            <div className="flex flex-col gap-2.5">
              {["Mentions légales", "Confidentialité", "CGU", "Contact"].map(l => (
                <span key={l} className="text-sm text-white/30 cursor-pointer hover:text-white/55 transition-colors" style={sans}>{l}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-white/15 text-xs" style={mono}>© 2024 Sort ton vieux — Tous droits réservés</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-white/22 text-xs" style={mono}>1 247 sorties actives</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
