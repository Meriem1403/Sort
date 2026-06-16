import { useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { MapPin, Shield, MessageCircle, ArrowRight, ChevronDown, Star, Check, Smartphone, CreditCard, Users, Calendar } from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const sans  = { fontFamily: "'DM Sans', system-ui, sans-serif" } as const;
const mono  = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

const IMGS = {
  hero:       "https://images.unsplash.com/photo-1768199189778-036bcb8cc939?w=1800&h=1000&fit=crop&auto=format",
  bored:      "https://images.unsplash.com/photo-1772160106758-c6483d91126b?w=900&h=1100&fit=crop&auto=format",
  cafe:       "https://images.unsplash.com/photo-1761415449592-cb6ce5403ecd?w=1400&h=800&fit=crop&auto=format",
  restaurant: "https://images.unsplash.com/photo-1560090201-8a6a2bdab9ff?w=700&h=950&fit=crop&auto=format",
  cards:      "https://images.unsplash.com/photo-1762608206423-be8c07645de7?w=800&h=600&fit=crop&auto=format",
  group:      "https://images.unsplash.com/photo-1758613171860-99ef6386e33f?w=1400&h=900&fit=crop&auto=format",
};

function Reveal({ children, delay = 0, className = "", y = 40 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function FloatingCard({ emoji, title, subtitle, meta, delay = 0, className = "" }: { emoji: string; title: string; subtitle: string; meta: string; delay?: number; className?: string }) {
  return (
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4 + delay * 0.5, repeat: Infinity, ease: "easeInOut", delay }}
      className={`bg-white/96 backdrop-blur-sm rounded-2xl p-4 w-[210px] ${className}`} style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
      <div className="flex items-start gap-2.5">
        <span className="text-xl">{emoji}</span>
        <div>
          <p className="text-[#0D1B2A] text-[13px] font-semibold leading-snug" style={sans}>{title}</p>
          <p className="text-gray-400 text-[10px] mt-0.5" style={mono}>{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 mt-3 pt-2.5 border-t border-gray-100">
        {[0,1,2,3,4].map(i => <Star key={i} size={8} fill="#FF6B35" stroke="none" />)}
        <span className="text-[10px] text-gray-400 ml-1.5" style={mono}>{meta}</span>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY     = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-[#0D1B2A]">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <img src={IMGS.hero} alt="Groupe de personnes en balade" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(13,27,42,0.88) 0%,rgba(13,27,42,0.5) 55%,rgba(13,27,42,0.85) 100%)" }} />
      </motion.div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1,1.2,1], opacity: [0.2,0.35,0.2] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full blur-[120px]" style={{ background: "#FF6B35" }} />
        <motion.div animate={{ scale: [1.1,1,1.1], opacity: [0.1,0.2,0.1] }} transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-1/3 left-1/5 w-72 h-72 rounded-full blur-[100px]" style={{ background: "#7C3AED" }} />
      </div>
      <motion.div style={{ y: textY, opacity: fadeOut }} className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-5xl">
        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="text-[10px] tracking-[0.3em] uppercase mb-7" style={{ ...mono, color: "#FF6B35" }}>
          L'app intergénérationnelle
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.2, ease: [0.16,1,0.3,1] }}
          className="text-white leading-[1.0] mb-7" style={{ ...serif, fontSize: "clamp(3.5rem,10vw,8.5rem)", fontWeight: 900 }}>
          Ce soir,<br />on sort<br /><span style={{ color: "#FF6B35", fontStyle: "italic" }}>ton vieux.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
          className="text-lg md:text-xl leading-relaxed mb-10 max-w-md" style={{ ...sans, color: "rgba(255,255,255,0.58)" }}>
          Des sorties proches, des profils vérifiés, des moments vrais. Pour les seniors, les parents, les enfants — ensemble.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }} className="flex flex-wrap items-center gap-4">
          <Link to="/events" className="flex items-center gap-2.5 text-white font-semibold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform"
            style={{ ...sans, background: "#FF6B35", boxShadow: "0 10px 35px rgba(255,107,53,0.4)" }}>
            Trouver une sortie <ArrowRight size={20} />
          </Link>
          <Link to="/auth?tab=register" className="text-sm font-medium px-6 py-4 rounded-full hover:bg-white/10 transition-all"
            style={{ ...sans, color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.2)" }}>
            Créer mon compte
          </Link>
        </motion.div>
      </motion.div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col gap-4">
        <FloatingCard emoji="🎭" title="Théâtre du Châtelet" subtitle="Ce soir · 19h30 · Paris 1er" meta="12 places" delay={0} />
        <FloatingCard emoji="🥘" title="Pizza en famille" subtitle="Samedi · 12h · Montreuil" meta="5 inscrits" delay={1.3} />
        <FloatingCard emoji="🎲" title="Jeux de société" subtitle="Dimanche · 15h · Lyon" meta="8 places" delay={2.6} />
      </div>
      <motion.div animate={{ y: [0,8,0] }} transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2" style={{ color: "rgba(255,255,255,0.3)" }}>
        <span className="text-[9px] tracking-[0.3em] uppercase" style={mono}>Défiler</span>
        <ChevronDown size={14} />
      </motion.div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="bg-[#FBF6EE] py-28 md:py-40 px-8 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <Reveal y={40}>
          <div className="relative">
            <img src={IMGS.bored} alt="Personnes assises sur un canapé" className="w-full h-[520px] object-cover rounded-3xl shadow-2xl shadow-[#0D1B2A]/15" />
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -right-4 md:-right-8 bg-[#0D1B2A] text-white rounded-2xl px-6 py-5 shadow-2xl">
              <p className="text-4xl font-black leading-none" style={serif}>73%</p>
              <p className="text-white/50 text-sm mt-1.5 leading-snug" style={sans}>des seniors s'ennuient<br />le week-end</p>
            </motion.div>
          </div>
        </Reveal>
        <div className="md:pl-8">
          <Reveal><p className="text-[10px] tracking-[0.25em] uppercase mb-5" style={{ ...mono, color: "#FF6B35" }}>Le problème</p></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-[#0D1B2A] leading-[1.08] mb-8" style={{ ...serif, fontSize: "clamp(2rem,4.5vw,3.6rem)", fontWeight: 700 }}>
              Vous sortez ensemble.<br /><em>Mais votre cercle<br />ne grandit pas.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="space-y-4 text-[#0D1B2A]/60 text-lg leading-relaxed mb-10" style={sans}>
              <p>Tu sors avec ton père, ta mère ou ton grand-parent parce que tu aimes passer du temps avec eux. Mais souvent, au bout d'un moment, tu t'ennuies un peu. Eux aussi parfois. Vous êtes ensemble, mais votre cercle social ne grandit pas.</p>
              <p>Et si une sortie devenait l'occasion de rencontrer d'autres jeunes qui vivent la même chose, ainsi que d'autres seniors qui ont envie d'échanger, rire et créer des liens ?</p>
              <p className="font-semibold text-[#0D1B2A]">Sort ton vieux transforme une simple sortie en expérience sociale intergénérationnelle.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {[{ number: "1 sur 2", label: "senior sans sortie sociale ce mois-ci" }, { number: "68%", label: "des familles veulent plus de moments partagés" }].map(({ number, label }, i) => (
              <Reveal key={label} delay={0.3 + i * 0.1}>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#0D1B2A]/6">
                  <p className="text-2xl font-black text-[#0D1B2A]" style={serif}>{number}</p>
                  <p className="text-[#0D1B2A]/45 text-sm mt-2 leading-snug" style={sans}>{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section className="relative bg-[#0D1B2A] py-28 md:py-40 px-8 md:px-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1,1.2,1] }} transition={{ duration: 18, repeat: Infinity }} className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: "rgba(124,58,237,0.12)" }} />
        <motion.div animate={{ scale: [1.1,1,1.1] }} transition={{ duration: 14, repeat: Infinity }} className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full blur-3xl" style={{ background: "rgba(255,107,53,0.1)" }} />
      </div>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Reveal><p className="text-[10px] tracking-[0.3em] uppercase mb-7" style={{ ...mono, color: "#FF6B35" }}>La solution</p></Reveal>
          <Reveal delay={0.1}><h2 className="text-white leading-[1.04] mb-6" style={{ ...serif, fontSize: "clamp(2.8rem,7vw,6rem)", fontWeight: 900 }}>Il existe une sortie<br /><em className="text-[#FF6B35]">pour vous.</em></h2></Reveal>
          <Reveal delay={0.2}><p className="text-white/45 text-xl max-w-xl mx-auto" style={sans}>Sort ton vieux connecte les générations autour d'activités proches, accessibles et sélectionnées avec soin.</p></Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {[{ icon: MapPin, text: "Je cherche une sortie près de chez moi" }, { icon: Users, text: "Je rejoins un groupe de personnes sympas" }, { icon: Star, text: "On passe un moment inoubliable ensemble" }].map(({ icon: Icon, text }, i) => (
            <Reveal key={text} delay={0.1 * i}>
              <div className="relative flex flex-col items-center text-center p-8 rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group">
                <div className="w-16 h-16 rounded-full mb-6 flex items-center justify-center" style={{ background: "rgba(255,107,53,0.12)" }}>
                  <Icon size={24} style={{ color: "#FF6B35" }} />
                </div>
                <p className="text-white/70 text-base leading-relaxed" style={sans}>{text}</p>
                <span className="absolute top-5 right-6 font-black text-5xl select-none" style={{ ...serif, color: "rgba(255,255,255,0.05)", lineHeight: 1 }}>0{i + 1}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.35}>
          <div className="relative rounded-3xl overflow-hidden">
            <img src={IMGS.cafe} alt="Terrasse de café animée" className="w-full h-64 md:h-80 object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(13,27,42,0.95) 0%,rgba(13,27,42,0.2) 60%,transparent 100%)" }} />
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <div>
                <p className="text-white/35 text-[9px] uppercase tracking-widest mb-1.5" style={mono}>En ce moment</p>
                <p className="text-white font-black leading-[1.1]" style={{ ...serif, fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}>1 247 sorties<br />près de chez vous</p>
              </div>
              <Link to="/events" className="hidden md:flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full text-sm flex-shrink-0" style={{ ...sans, background: "#FF6B35" }}>
                Explorer <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: MapPin, title: "Carte interactive", desc: "Trouvez des sorties autour de vous en temps réel. Restaurants, balades, musées — à portée de doigt." },
    { icon: Calendar, title: "Événements curatés", desc: "Sélectionnés pour être accessibles à tous les âges, avec horaires, budget, et tous les détails." },
    { icon: Shield, title: "Profils vérifiés", desc: "Chaque profil est authentifié. Rencontrez des gens réels, pas des inconnus sans visage." },
    { icon: MessageCircle, title: "Chat intégré", desc: "Un espace pour organiser, planifier, et garder le contact longtemps après la sortie." },
  ];
  return (
    <section className="bg-[#FBF6EE] py-28 md:py-40 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <Reveal><p className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ ...mono, color: "#FF6B35" }}>Fonctionnalités</p></Reveal>
        <Reveal delay={0.1}><h2 className="text-[#0D1B2A] leading-[1.05] mb-16 max-w-2xl" style={{ ...serif, fontSize: "clamp(2rem,4.5vw,3.8rem)", fontWeight: 700 }}>Tout ce qu'il faut<br /><em>pour sortir ensemble.</em></h2></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={0.08 * i}>
              <div className="bg-white rounded-3xl p-9 border border-black/5 hover:shadow-2xl hover:-translate-y-1.5 transition-all group cursor-default">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 bg-[#0D1B2A] group-hover:bg-[#FF6B35] transition-colors">
                  <Icon size={22} color="white" />
                </div>
                <h3 className="text-[#0D1B2A] text-xl font-bold mb-3" style={serif}>{title}</h3>
                <p className="leading-relaxed" style={{ ...sans, color: "rgba(13,27,42,0.48)" }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  return (
    <section className="bg-[#0D1B2A] py-28 md:py-40 px-8 md:px-16 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(to right,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="max-w-3xl mx-auto relative z-10">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 mb-10 border" style={{ background: "rgba(255,107,53,0.1)", borderColor: "rgba(255,107,53,0.25)", color: "#FF6B35" }}>
            <Shield size={15} /><span className="text-sm font-medium" style={mono}>Identité vérifiée</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}><h2 className="text-white leading-[1.05] mb-8" style={{ ...serif, fontSize: "clamp(2.4rem,6vw,4.8rem)", fontWeight: 900 }}>Vous ne rencontrez<br /><em style={{ color: "#FF6B35" }}>que des vraies personnes.</em></h2></Reveal>
        <Reveal delay={0.2}><p className="text-white/45 text-xl mb-16 leading-relaxed" style={sans}>Chaque profil est vérifié par notre équipe. Nom réel, photo, numéro de téléphone. Parce que la confiance, ça se mérite.</p></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{ icon: CreditCard, label: "Identité vérifiée par pièce officielle" }, { icon: Smartphone, label: "Numéro de téléphone confirmé" }, { icon: Shield, label: "Photo de profil authentique contrôlée" }].map(({ icon: Icon, label }, i) => (
            <Reveal key={label} delay={0.1 * i}>
              <div className="flex items-center gap-4 rounded-2xl p-5 text-left border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,107,53,0.15)" }}>
                  <Icon size={18} style={{ color: "#FF6B35" }} />
                </div>
                <p className="text-white/60 text-sm leading-snug" style={sans}>{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AmbianceSection() {
  const tags = [{ emoji: "🎭", label: "Théâtre" }, { emoji: "☕", label: "Café" }, { emoji: "🥘", label: "Restaurant" }, { emoji: "🌳", label: "Balade" }, { emoji: "🎲", label: "Jeux" }, { emoji: "🎵", label: "Concert" }, { emoji: "🖼️", label: "Musée" }, { emoji: "🛒", label: "Marché" }];
  return (
    <section className="bg-[#FBF6EE] py-28 md:py-40 px-8 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Reveal><p className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ ...mono, color: "#FF6B35" }}>L'ambiance</p></Reveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <Reveal delay={0.1}><h2 className="text-[#0D1B2A] leading-[1.05]" style={{ ...serif, fontSize: "clamp(2rem,4.5vw,3.8rem)", fontWeight: 700 }}>Des sorties pour<br /><em>tous les goûts.</em></h2></Reveal>
          <Reveal delay={0.2}><p className="text-[#0D1B2A]/45 text-lg max-w-xs leading-relaxed" style={sans}>Soirées jeux, restos, marchés, concerts, balades...</p></Reveal>
        </div>
        <Reveal delay={0.25}>
          <div className="flex flex-wrap gap-3 mb-14">
            {tags.map(({ emoji, label }) => (
              <Link key={label} to={`/events?category=${label}`}
                className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-medium text-[#0D1B2A] border border-black/8 hover:bg-[#0D1B2A] hover:text-white hover:border-[#0D1B2A] transition-all" style={sans}>
                <span>{emoji}</span><span>{label}</span>
              </Link>
            ))}
          </div>
        </Reveal>
        <div className="grid grid-cols-12 gap-4" style={{ gridTemplateRows: "260px 260px" }}>
          <Reveal y={30} className="col-span-12 md:col-span-7 row-span-2">
            <div className="relative h-full rounded-3xl overflow-hidden bg-gray-200">
              <img src={IMGS.group} alt="Groupe en balade" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 50%)" }} />
              <div className="absolute bottom-6 left-6 bg-white/92 backdrop-blur-sm rounded-2xl p-4">
                <p className="font-bold text-[#0D1B2A] text-base" style={serif}>Balade en forêt</p>
                <p className="text-[#0D1B2A]/45 text-[11px] mt-1" style={mono}>📍 Fontainebleau · 8 participants</p>
                <div className="flex gap-0.5 mt-2">{[0,1,2,3,4].map(i => <Star key={i} size={9} fill="#FF6B35" stroke="none" />)}</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15} y={30} className="col-span-12 md:col-span-5 row-span-1">
            <div className="relative h-full rounded-3xl overflow-hidden bg-gray-200">
              <img src={IMGS.restaurant} alt="Repas en famille" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 60%)" }} />
              <span className="absolute bottom-4 left-4 text-white text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ ...sans, background: "#FF6B35" }}>🍽 Repas en famille</span>
            </div>
          </Reveal>
          <Reveal delay={0.25} y={30} className="col-span-12 md:col-span-5 row-span-1">
            <div className="relative h-full rounded-3xl overflow-hidden bg-gray-200">
              <img src={IMGS.cards} alt="Jeux en extérieur" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 60%)" }} />
              <span className="absolute bottom-4 left-4 text-white text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ ...sans, background: "#7C3AED" }}>🎲 Jeux en plein air</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AppPreviewSection() {
  const miniEvents = [{ emoji: "🎭", title: "Théâtre du Châtelet", tag: "Ce soir", color: "#FF6B35" }, { emoji: "🥘", title: "Soupe populaire festive", tag: "Demain", color: "#7C3AED" }, { emoji: "🌳", title: "Balade du dimanche", tag: "Dim.", color: "#059669" }];
  return (
    <section className="bg-[#0D1B2A] py-28 md:py-40 px-8 md:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
        <div className="flex-1">
          <Reveal><p className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ ...mono, color: "#FF6B35" }}>L'application</p></Reveal>
          <Reveal delay={0.1}><h2 className="text-white leading-[1.05] mb-10" style={{ ...serif, fontSize: "clamp(2rem,4.5vw,3.8rem)", fontWeight: 700 }}>Toute la magie dans<br /><em style={{ color: "#FF6B35" }}>votre poche.</em></h2></Reveal>
          <div className="space-y-4">
            {[{ title: "Simple pour tous les âges", desc: "Conçue pour être utilisée par mamie sans tutoriel de 3 heures." }, { title: "Gratuit pour commencer", desc: "Trouvez votre première sortie sans payer un centime." }, { title: "Disponible partout en France", desc: "2 400 villes couvertes, et ça grandit chaque semaine." }].map(({ title, desc }, i) => (
              <Reveal key={title} delay={0.15 + i * 0.1}>
                <div className="flex items-start gap-4 rounded-2xl p-5 border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "#FF6B35" }}>
                    <Check size={12} color="white" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1" style={sans}>{title}</p>
                    <p className="text-white/38 text-sm leading-relaxed" style={sans}>{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.3} className="flex-shrink-0 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-[70px] scale-75 translate-y-8" style={{ background: "rgba(255,107,53,0.22)" }} />
            <div className="relative overflow-hidden border-[5px]" style={{ width: 275, height: 570, borderRadius: 44, background: "#111E2B", borderColor: "#1E3347", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10" style={{ width: 110, height: 24, background: "#111E2B", borderRadius: "0 0 16px 16px" }} />
              <div className="flex justify-between items-center px-6 pt-4 pb-1">
                <span className="text-white/30 text-[11px]" style={mono}>9:41</span>
                <div className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-white/20" /><div className="w-1.5 h-1.5 rounded-full bg-white/20" /><div className="w-1.5 h-1.5 rounded-full" style={{ background: "#FF6B35" }} /></div>
              </div>
              <div className="px-5 pt-3 pb-6">
                <div className="flex items-center gap-2 mb-4"><MapPin size={11} style={{ color: "#FF6B35" }} /><span className="text-white/38 text-[10px]" style={mono}>Paris 11e</span></div>
                <p className="text-white font-bold text-lg leading-tight mb-5" style={serif}>Ce week-end<br />près de vous</p>
                {miniEvents.map(({ emoji, title, tag, color }) => (
                  <div key={title} className="rounded-2xl p-3 mb-2.5 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <span className="text-xl">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-[12px] font-semibold truncate" style={sans}>{title}</p>
                      <span className="text-white text-[9px] px-2 py-0.5 rounded-full mt-1 inline-block font-medium" style={{ background: color, ...mono }}>{tag}</span>
                    </div>
                  </div>
                ))}
                <div className="mt-4 rounded-2xl overflow-hidden relative flex items-center justify-center" style={{ height: 100, background: "#1A3352" }}>
                  <div className="absolute inset-0 opacity-15">{[0,1,2,3,4].map(i => <div key={i} className="absolute w-full border-t border-white/50" style={{ top: `${i*25}%` }} />)}{[0,1,2,3,4].map(i => <div key={i} className="absolute h-full border-l border-white/50" style={{ left: `${i*25}%` }} />)}</div>
                  <div className="relative flex flex-col items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#FF6B35", boxShadow: "0 0 20px rgba(255,107,53,0.5)" }}><MapPin size={14} color="white" /></div>
                    <span className="text-white/35 text-[9px]" style={mono}>Carte des sorties</span>
                  </div>
                  <motion.div animate={{ scale: [1,2.8,1], opacity: [0.5,0,0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2" style={{ borderColor: "#FF6B35" }} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-32 md:py-48 px-8 md:px-16 overflow-hidden" style={{ background: "#FF6B35" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1,1.2,1], x: [0,30,0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(255,255,255,0.18)" }} />
        <motion.div animate={{ scale: [1.1,1,1.1], x: [0,-20,0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(13,27,42,0.18)" }} />
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Reveal><p className="text-[10px] tracking-[0.3em] uppercase mb-8" style={{ ...mono, color: "rgba(255,255,255,0.55)" }}>Prêt à sortir ?</p></Reveal>
        <Reveal delay={0.1}><h2 className="text-white leading-[1.0] mb-8" style={{ ...serif, fontSize: "clamp(3rem,8vw,7rem)", fontWeight: 900 }}>Ne laissez plus<br /><em>personne s'ennuyer.</em></h2></Reveal>
        <Reveal delay={0.2}><p className="text-white/70 text-xl mb-14 leading-relaxed" style={sans}>1 247 sorties près de vous ce week-end.<br />Il n'en reste plus beaucoup de disponibles.</p></Reveal>
        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/events" className="flex items-center gap-3 text-white font-semibold text-lg px-10 py-5 rounded-full hover:scale-105 transition-transform"
              style={{ ...sans, background: "#0D1B2A", boxShadow: "0 12px 40px rgba(13,27,42,0.35)" }}>
              <MapPin size={20} /> Trouver une sortie près de moi
            </Link>
            <Link to="/auth?tab=register" className="text-white font-medium text-lg px-8 py-5 rounded-full border hover:bg-white/10 transition-colors"
              style={{ ...sans, borderColor: "rgba(255,255,255,0.3)" }}>
              Créer mon compte
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.4}><p className="text-white/40 text-sm mt-10" style={mono}>Gratuit · Sécurisé · Sans spam</p></Reveal>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <Nav transparent />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <SecuritySection />
      <AmbianceSection />
      <AppPreviewSection />
      <CTASection />
      <Footer />
    </div>
  );
}
