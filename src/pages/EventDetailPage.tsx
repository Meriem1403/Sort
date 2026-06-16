import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  MapPin, Calendar, Users, Clock, Euro, ArrowLeft,
  Edit, Trash2, Share2, CheckCircle, XCircle, ExternalLink,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const sans  = { fontFamily: "'DM Sans', system-ui, sans-serif" } as const;
const mono  = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, getUserById, currentUser, joinEvent, leaveEvent, deleteEvent, updateEvent } = useApp();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  const event = getEventById(id ?? "");
  if (!event) {
    return (
      <div className="min-h-screen bg-[#FBF6EE] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center px-6 pt-20">
          <p className="text-5xl">🔍</p>
          <h2 className="text-2xl font-bold text-[#0D1B2A]" style={serif}>Sortie introuvable</h2>
          <p className="text-[#0D1B2A]/50" style={sans}>Cette sortie n'existe pas ou a été supprimée.</p>
          <Link to="/events" className="text-white font-semibold px-6 py-3 rounded-full mt-2"
            style={{ ...sans, background: "#FF6B35" }}>
            Voir toutes les sorties
          </Link>
        </div>
      </div>
    );
  }

  const organizer   = getUserById(event.organizerId);
  const isOrganizer = currentUser?.id === event.organizerId;
  const isAdmin     = currentUser?.role === "admin";
  const isJoined    = currentUser ? event.participantIds.includes(currentUser.id) : false;
  const isFull      = event.participantIds.length >= event.maxParticipants;
  const spotsLeft   = event.maxParticipants - event.participantIds.length;

  let dateStr = event.date;
  try { dateStr = format(new Date(event.date), "EEEE d MMMM yyyy", { locale: fr }); } catch {}

  const handleJoin = () => {
    if (!currentUser) { navigate("/auth"); return; }
    joinEvent(event.id);
  };

  const handleLeave = () => leaveEvent(event.id);

  const handleDelete = () => {
    deleteEvent(event.id);
    navigate("/events");
  };

  const handleToggleStatus = () => {
    updateEvent(event.id, {
      status: event.status === "active" ? "cancelled" : "active",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      <Nav />

      {/* Hero image */}
      <div className="relative pt-16 overflow-hidden bg-[#0D1B2A]" style={{ height: 380 }}>
        <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,27,42,1) 0%, rgba(13,27,42,0.3) 60%, transparent 100%)" }} />
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <Link to="/events" className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors" style={sans}>
            <ArrowLeft size={16} /> Toutes les sorties
          </Link>
          <div className="flex items-center gap-2">
            {(isAdmin || isOrganizer) && (
              <>
                <Link to={`/events/${event.id}/edit`}
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-2 rounded-full backdrop-blur-sm transition-colors"
                  style={sans}>
                  <Edit size={13} /> Modifier
                </Link>
                <button onClick={handleToggleStatus}
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-2 rounded-full backdrop-blur-sm transition-colors"
                  style={sans}>
                  {event.status === "active" ? <XCircle size={13} /> : <CheckCircle size={13} />}
                  {event.status === "active" ? "Annuler" : "Réactiver"}
                </button>
                {!confirmDelete ? (
                  <button onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium px-3 py-2 rounded-full backdrop-blur-sm transition-colors"
                    style={sans}>
                    <Trash2 size={13} /> Supprimer
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleDelete}
                      className="bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-full" style={sans}>
                      Confirmer
                    </button>
                    <button onClick={() => setConfirmDelete(false)}
                      className="bg-white/20 text-white text-xs px-3 py-2 rounded-full" style={sans}>
                      Annuler
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Status banner */}
            {event.status === "cancelled" && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                <XCircle size={18} className="text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-600" style={sans}>Sortie annulée</p>
                  <p className="text-xs text-red-500 mt-0.5" style={sans}>L'organisateur a annulé cet événement.</p>
                </div>
              </div>
            )}

            {/* Category + Title */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{event.emoji}</span>
              <span className="text-sm font-semibold text-[#FF6B35] bg-[#FF6B35]/10 px-3 py-1 rounded-full" style={mono}>
                {event.category}
              </span>
              {event.price === 0
                ? <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full" style={mono}>Gratuit</span>
                : <span className="text-sm font-semibold text-[#0D1B2A]/60 bg-[#0D1B2A]/5 px-3 py-1 rounded-full" style={mono}>{event.price} €</span>
              }
            </div>

            <h1 className="text-[#0D1B2A] leading-tight mb-6"
              style={{ ...serif, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900 }}>
              {event.title}
            </h1>

            {/* Meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Calendar, label: "Date", value: <span className="capitalize">{dateStr}</span> },
                { icon: Clock, label: "Heure", value: event.time },
                { icon: MapPin, label: "Ville", value: event.city },
                { icon: Users, label: "Participants", value: `${event.participantIds.length}/${event.maxParticipants}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-2xl p-4 border border-[#0D1B2A]/6">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} className="text-[#FF6B35]" />
                    <span className="text-xs text-[#0D1B2A]/40 uppercase tracking-wider" style={mono}>{label}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#0D1B2A]" style={sans}>{value}</p>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-5 border border-[#0D1B2A]/6 mb-8">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={15} className="text-[#FF6B35]" />
                <p className="text-sm font-semibold text-[#0D1B2A]" style={sans}>Lieu</p>
              </div>
              <p className="text-[#0D1B2A]/60 text-sm" style={sans}>{event.location}</p>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-[#0D1B2A] mb-4" style={serif}>À propos de cette sortie</h2>
              <p className="text-[#0D1B2A]/65 leading-relaxed text-base" style={sans}>{event.description}</p>
            </div>

            {/* Participants */}
            <div>
              <h2 className="text-xl font-bold text-[#0D1B2A] mb-4" style={serif}>
                Participants ({event.participantIds.length})
              </h2>
              {event.participantIds.length === 0 ? (
                <p className="text-[#0D1B2A]/40 text-sm" style={sans}>
                  Soyez le premier à rejoindre cette sortie !
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {event.participantIds.map(uid => {
                    const u = getUserById(uid);
                    if (!u) return null;
                    return (
                      <Link key={uid} to={`/profile/${uid}`}
                        className="flex items-center gap-2.5 bg-white rounded-full pl-1 pr-4 py-1 border border-[#0D1B2A]/8 hover:border-[#FF6B35]/40 transition-all group">
                        <img src={u.avatar} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-medium text-[#0D1B2A] group-hover:text-[#FF6B35] transition-colors" style={sans}>
                            {u.name.split(" ")[0]}
                            {u.verified && <span className="text-[#FF6B35] ml-0.5">✓</span>}
                          </p>
                          <p className="text-[10px] text-gray-400 capitalize" style={mono}>{u.generation}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Join card */}
            <div className="bg-white rounded-3xl p-6 border border-[#0D1B2A]/6 sticky top-24">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0D1B2A]/50" style={sans}>Places restantes</span>
                  <span className="text-sm font-bold text-[#0D1B2A]" style={mono}>{spotsLeft}/{event.maxParticipants}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${(event.participantIds.length / event.maxParticipants) * 100}%`,
                    background: isFull ? "#ef4444" : "#FF6B35",
                  }} />
                </div>
                {!isFull && <p className="text-xs text-[#22c55e] mt-1.5 font-medium" style={mono}>{spotsLeft} place{spotsLeft > 1 ? "s" : ""} disponible{spotsLeft > 1 ? "s" : ""}</p>}
                {isFull && <p className="text-xs text-red-500 mt-1.5 font-medium" style={mono}>Complet</p>}
              </div>

              {event.price > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-4 py-3 mb-4">
                  <Euro size={15} className="text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700" style={sans}>Participation : {event.price} €</span>
                </div>
              )}

              {event.status === "active" && (
                <>
                  {!currentUser ? (
                    <Link to="/auth"
                      className="w-full block text-center text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02]"
                      style={{ ...sans, background: "#FF6B35", boxShadow: "0 4px 16px rgba(255,107,53,0.3)" }}>
                      Connexion pour participer
                    </Link>
                  ) : isOrganizer ? (
                    <div className="text-center py-3 text-sm text-[#0D1B2A]/40 bg-gray-50 rounded-xl" style={sans}>
                      Vous organisez cette sortie
                    </div>
                  ) : isJoined ? (
                    <button onClick={handleLeave}
                      className="w-full text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                      style={{ ...sans, background: "#0D1B2A" }}>
                      <XCircle size={18} /> Je ne viens plus
                    </button>
                  ) : (
                    <button onClick={handleJoin} disabled={isFull}
                      className="w-full text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ ...sans, background: isFull ? "#9ca3af" : "#FF6B35", boxShadow: isFull ? "none" : "0 4px 16px rgba(255,107,53,0.3)" }}>
                      {isFull ? "Complet" : "Rejoindre cette sortie"}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Organizer card */}
            {organizer && (
              <div className="bg-white rounded-3xl p-6 border border-[#0D1B2A]/6">
                <p className="text-xs text-[#0D1B2A]/40 uppercase tracking-wider mb-4" style={mono}>Organisé par</p>
                <div className="flex items-center gap-3 mb-4">
                  <img src={organizer.avatar} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-[#0D1B2A]" style={sans}>
                      {organizer.name}
                      {organizer.verified && <span className="text-[#FF6B35] ml-1">✓</span>}
                    </p>
                    <p className="text-xs text-gray-400 capitalize" style={mono}>{organizer.generation} · {organizer.city}</p>
                  </div>
                </div>
                {organizer.bio && <p className="text-sm text-[#0D1B2A]/55 leading-relaxed mb-4 line-clamp-3" style={sans}>{organizer.bio}</p>}
                <Link to={`/profile/${organizer.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#0D1B2A]/10 text-sm font-medium text-[#0D1B2A] hover:border-[#0D1B2A]/30 transition-colors"
                  style={sans}>
                  <ExternalLink size={14} /> Voir le profil
                </Link>
              </div>
            )}

            {/* Share */}
            <button onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#0D1B2A]/10 text-sm font-medium text-[#0D1B2A] hover:border-[#0D1B2A]/25 transition-colors bg-white"
              style={sans}>
              {copied ? <><CheckCircle size={16} className="text-green-500" /> Lien copié !</> : <><Share2 size={16} /> Partager cette sortie</>}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
