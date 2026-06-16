import { useState, useMemo } from "react";
import { Link } from "react-router";
import { MapPin, Calendar, Users, Search, Plus, SlidersHorizontal, Clock, Euro } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { AppEvent } from "../context/AppContext";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const sans  = { fontFamily: "'DM Sans', system-ui, sans-serif" } as const;
const mono  = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

const CATEGORIES = ["Tous", "Jeux", "Balade", "Restaurant", "Théâtre", "Café", "Marché", "Concert", "Musée"];
const CITIES     = ["Toutes les villes", "Paris", "Lyon", "Bordeaux", "Fontainebleau", "Marseille", "Toulouse"];

function EventCard({ event }: { event: AppEvent }) {
  const { getUserById } = useApp();
  const organizer = getUserById(event.organizerId);
  const spotsLeft = event.maxParticipants - event.participantIds.length;
  const isFull    = spotsLeft <= 0;

  let dateStr = event.date;
  try { dateStr = format(new Date(event.date), "EEE d MMM", { locale: fr }); } catch {}

  return (
    <Link to={`/events/${event.id}`}
      className="bg-white rounded-3xl overflow-hidden border border-[#0D1B2A]/5 hover:shadow-2xl hover:shadow-[#0D1B2A]/8 hover:-translate-y-1 transition-all group block"
      style={{ boxShadow: "0 2px 8px rgba(13,27,42,0.04)" }}>
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,27,42,0.4) 0%, transparent 50%)" }} />
        {/* Category badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="text-sm">{event.emoji}</span>
          <span className="text-xs font-semibold text-[#0D1B2A]" style={sans}>{event.category}</span>
        </div>
        {/* Price */}
        <div className="absolute top-3 right-3 bg-[#0D1B2A]/80 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="text-xs font-semibold text-white" style={mono}>
            {event.price === 0 ? "Gratuit" : `${event.price} €`}
          </span>
        </div>
        {/* Status */}
        {event.status === "cancelled" && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full" style={sans}>
            Annulé
          </div>
        )}
        {isFull && event.status === "active" && (
          <div className="absolute bottom-3 left-3 bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full" style={sans}>
            Complet
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-[#0D1B2A] font-bold text-lg leading-snug mb-3 group-hover:text-[#FF6B35] transition-colors line-clamp-2" style={serif}>
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-[#0D1B2A]/50">
            <Calendar size={13} />
            <span className="text-sm capitalize" style={sans}>{dateStr} à {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-[#0D1B2A]/50">
            <MapPin size={13} />
            <span className="text-sm truncate" style={sans}>{event.city}</span>
          </div>
          <div className="flex items-center gap-2 text-[#0D1B2A]/50">
            <Users size={13} />
            <span className="text-sm" style={sans}>
              {event.participantIds.length}/{event.maxParticipants} participants
              {!isFull && <span className="text-[#22c55e] ml-1">· {spotsLeft} place{spotsLeft > 1 ? "s" : ""}</span>}
            </span>
          </div>
        </div>

        {/* Organizer */}
        {organizer && (
          <div className="flex items-center gap-2 pt-4 border-t border-[#0D1B2A]/6">
            <img src={organizer.avatar} className="w-7 h-7 rounded-full object-cover" />
            <div>
              <span className="text-xs text-[#0D1B2A]/40 block" style={mono}>Organisé par</span>
              <span className="text-sm font-medium text-[#0D1B2A]" style={sans}>
                {organizer.name}
                {organizer.verified && <span className="ml-1 text-[#FF6B35]">✓</span>}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function EventsPage() {
  const { events, currentUser } = useApp();
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("Tous");
  const [city, setCity]           = useState("Toutes les villes");
  const [freeOnly, setFreeOnly]   = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (e.status === "cancelled" && currentUser?.role !== "admin") return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "Tous" && e.category !== category) return false;
      if (city !== "Toutes les villes" && e.city !== city) return false;
      if (freeOnly && e.price !== 0) return false;
      return true;
    });
  }, [events, search, category, city, freeOnly, currentUser]);

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      <Nav />

      {/* Hero header */}
      <div className="bg-[#0D1B2A] pt-32 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#FF6B35] mb-3" style={mono}>
                {filtered.length} sortie{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
              </p>
              <h1 className="text-white leading-tight" style={{ ...serif, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900 }}>
                Les sorties du moment
              </h1>
            </div>
            {currentUser && (
              <Link to="/events/create"
                className="inline-flex items-center gap-2.5 text-white font-semibold px-6 py-3.5 rounded-full transition-all hover:scale-105 flex-shrink-0"
                style={{ ...sans, background: "#FF6B35", boxShadow: "0 4px 20px rgba(255,107,53,0.4)" }}>
                <Plus size={18} /> Organiser une sortie
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Search + Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une sortie, une ville..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#0D1B2A]/10 bg-white text-[#0D1B2A] text-sm outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 transition-all"
                style={sans}
              />
            </div>
            <button onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all ${
                showFilters ? "bg-[#0D1B2A] text-white border-[#0D1B2A]" : "bg-white text-[#0D1B2A] border-[#0D1B2A]/10 hover:border-[#0D1B2A]/30"
              }`} style={sans}>
              <SlidersHorizontal size={16} />
              <span className="hidden sm:block">Filtres</span>
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="bg-white rounded-2xl border border-[#0D1B2A]/8 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0D1B2A]/50 mb-2 uppercase tracking-wider" style={mono}>Ville</label>
                  <select value={city} onChange={e => setCity(e.target.value)}
                    className="w-full border border-[#0D1B2A]/10 rounded-xl px-3 py-2.5 text-sm text-[#0D1B2A] bg-white outline-none focus:border-[#FF6B35]"
                    style={sans}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <button onClick={() => setFreeOnly(v => !v)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      freeOnly ? "bg-[#FF6B35] text-white border-[#FF6B35]" : "bg-white text-[#0D1B2A] border-[#0D1B2A]/10"
                    }`} style={sans}>
                    <Euro size={14} /> Gratuit uniquement
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-[#0D1B2A] text-white"
                    : "bg-white text-[#0D1B2A] border border-[#0D1B2A]/10 hover:border-[#0D1B2A]/30"
                }`} style={sans}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-[#0D1B2A] mb-2" style={serif}>Aucune sortie trouvée</h3>
            <p className="text-[#0D1B2A]/50 mb-6" style={sans}>Essayez d'autres filtres ou organisez votre propre sortie !</p>
            {currentUser && (
              <Link to="/events/create"
                className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full"
                style={{ ...sans, background: "#FF6B35" }}>
                <Plus size={16} /> Créer une sortie
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
