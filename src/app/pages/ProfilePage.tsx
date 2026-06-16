import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  MapPin, Calendar, Edit2, Check, X, Trash2, Shield,
  CheckCircle, Plus, ArrowLeft,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Generation } from "../context/AppContext";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const sans  = { fontFamily: "'DM Sans', system-ui, sans-serif" } as const;
const mono  = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1639747280929-e84ef392c69a?w=200&h=200&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&auto=format",
];

const GEN_LABEL: Record<string, string> = { jeune: "Jeune", parent: "Parent", senior: "Senior" };
const GEN_COLOR: Record<string, string> = { jeune: "#7C3AED", parent: "#FF6B35", senior: "#059669" };

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, currentUser, updateUser, deleteUser, verifyUser, makeAdmin, events } = useApp();

  const profile = getUserById(id ?? "");
  const isSelf  = currentUser?.id === profile?.id;
  const isAdmin = currentUser?.role === "admin";
  const canEdit = isSelf || isAdmin;

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Edit state
  const [name,       setName]       = useState(profile?.name       ?? "");
  const [city,       setCity]       = useState(profile?.city       ?? "");
  const [bio,        setBio]        = useState(profile?.bio        ?? "");
  const [generation, setGeneration] = useState<Generation>(profile?.generation ?? "jeune");
  const [avatar,     setAvatar]     = useState(profile?.avatar     ?? AVATARS[0]);
  const [age,        setAge]        = useState(String(profile?.age ?? ""));

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FBF6EE] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center px-6 pt-20">
          <p className="text-5xl">👤</p>
          <h2 className="text-2xl font-bold text-[#0D1B2A]" style={serif}>Profil introuvable</h2>
          <Link to="/events" className="text-white font-semibold px-6 py-3 rounded-full" style={{ ...sans, background: "#FF6B35" }}>
            Retour aux sorties
          </Link>
        </div>
      </div>
    );
  }

  const organizedEvents = events.filter(e => e.organizerId === profile.id);
  const joinedEvents    = events.filter(e => e.participantIds.includes(profile.id) && e.organizerId !== profile.id);

  const handleSave = () => {
    updateUser(profile.id, { name, city, bio, generation, avatar, age: parseInt(age) || profile.age });
    setEditing(false);
  };

  const handleCancel = () => {
    setName(profile.name); setCity(profile.city); setBio(profile.bio);
    setGeneration(profile.generation); setAvatar(profile.avatar); setAge(String(profile.age));
    setEditing(false);
  };

  const handleDelete = () => {
    deleteUser(profile.id);
    navigate(isSelf ? "/" : "/admin");
  };

  const genColor = GEN_COLOR[profile.generation] ?? "#FF6B35";

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      <Nav />

      {/* Hero */}
      <div className="bg-[#0D1B2A] pt-24 pb-0">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <Link to="/events" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors" style={sans}>
            <ArrowLeft size={15} /> Retour
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 pb-0">
            {/* Avatar */}
            <div className="relative">
              <img src={editing ? avatar : profile.avatar} className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-[#0D1B2A]" />
              {profile.verified && (
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
                  <CheckCircle size={16} color="white" strokeWidth={2.5} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pb-6">
              {editing ? (
                <input value={name} onChange={e => setName(e.target.value)}
                  className="text-white font-black text-2xl bg-transparent border-b border-white/30 pb-1 outline-none w-full"
                  style={serif} />
              ) : (
                <h1 className="text-white font-black text-2xl md:text-3xl leading-tight" style={serif}>
                  {profile.name}
                  {profile.verified && <span className="text-[#FF6B35] ml-2 text-lg">✓</span>}
                </h1>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-xs font-semibold text-white px-3 py-1 rounded-full" style={{ background: genColor }}>
                  {GEN_LABEL[profile.generation]}
                </span>
                {profile.role === "admin" && (
                  <span className="text-xs font-semibold text-[#FF6B35] bg-[#FF6B35]/15 px-3 py-1 rounded-full flex items-center gap-1">
                    <Shield size={11} /> Admin
                  </span>
                )}
                <span className="text-white/40 text-sm flex items-center gap-1" style={sans}>
                  <MapPin size={12} /> {profile.city}
                </span>
                <span className="text-white/40 text-sm flex items-center gap-1" style={sans}>
                  <Calendar size={12} /> {profile.age} ans
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pb-6">
              {canEdit && !editing && (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-full transition-colors"
                  style={sans}>
                  <Edit2 size={14} /> Modifier
                </button>
              )}
              {editing && (
                <>
                  <button onClick={handleSave}
                    className="flex items-center gap-2 bg-[#FF6B35] text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-all hover:scale-105"
                    style={sans}>
                    <Check size={14} /> Enregistrer
                  </button>
                  <button onClick={handleCancel}
                    className="flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-2.5 rounded-full"
                    style={sans}>
                    <X size={14} /> Annuler
                  </button>
                </>
              )}
              {isAdmin && !isSelf && (
                <>
                  <button onClick={() => verifyUser(profile.id)}
                    className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-full transition-colors ${
                      profile.verified ? "bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400" : "bg-white/10 text-white hover:bg-green-500/20 hover:text-green-400"
                    }`} style={sans}>
                    <CheckCircle size={14} /> {profile.verified ? "Vérifier ✓" : "Vérifier"}
                  </button>
                  <button onClick={() => makeAdmin(profile.id)}
                    className="flex items-center gap-2 bg-[#FF6B35]/20 text-[#FF6B35] text-sm font-medium px-4 py-2.5 rounded-full hover:bg-[#FF6B35]/30 transition-colors"
                    style={sans}>
                    <Shield size={14} /> {profile.role === "admin" ? "Rétrograder" : "Promouvoir admin"}
                  </button>
                  {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)}
                      className="flex items-center gap-2 bg-red-500/20 text-red-400 text-sm font-medium px-4 py-2.5 rounded-full hover:bg-red-500/30 transition-colors"
                      style={sans}>
                      <Trash2 size={14} /> Supprimer
                    </button>
                  ) : (
                    <>
                      <button onClick={handleDelete} className="bg-red-500 text-white text-sm font-bold px-4 py-2.5 rounded-full" style={sans}>Confirmer</button>
                      <button onClick={() => setConfirmDelete(false)} className="bg-white/10 text-white text-sm px-4 py-2.5 rounded-full" style={sans}>Annuler</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: edit form or bio */}
          <div className="lg:col-span-1 space-y-6">
            {editing ? (
              <div className="bg-white rounded-3xl p-6 border border-[#0D1B2A]/6 space-y-5">
                <p className="text-sm font-bold text-[#0D1B2A]" style={serif}>Modifier le profil</p>

                {/* Avatar picker */}
                <div>
                  <p className="text-xs font-semibold text-[#0D1B2A]/50 mb-2 uppercase tracking-wider" style={mono}>Photo</p>
                  <div className="flex flex-wrap gap-2">
                    {AVATARS.map(src => (
                      <button key={src} type="button" onClick={() => setAvatar(src)}
                        className={`rounded-full overflow-hidden transition-all ${avatar === src ? "ring-2 ring-[#FF6B35] ring-offset-1 scale-110" : "opacity-50 hover:opacity-100"}`}
                        style={{ width: 36, height: 36 }}>
                        <img src={src} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#0D1B2A]/50 mb-1.5 uppercase tracking-wider" style={mono}>Âge</p>
                  <input type="number" value={age} onChange={e => setAge(e.target.value)}
                    className="w-full rounded-xl border border-[#0D1B2A]/12 px-3 py-2.5 text-sm text-[#0D1B2A] outline-none focus:border-[#FF6B35]"
                    style={sans} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#0D1B2A]/50 mb-1.5 uppercase tracking-wider" style={mono}>Ville</p>
                  <input value={city} onChange={e => setCity(e.target.value)}
                    className="w-full rounded-xl border border-[#0D1B2A]/12 px-3 py-2.5 text-sm text-[#0D1B2A] outline-none focus:border-[#FF6B35]"
                    style={sans} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#0D1B2A]/50 mb-2 uppercase tracking-wider" style={mono}>Génération</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["jeune", "parent", "senior"] as Generation[]).map(g => (
                      <button key={g} type="button" onClick={() => setGeneration(g)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                          generation === g ? "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]" : "border-[#0D1B2A]/10 text-[#0D1B2A]/50 hover:border-[#0D1B2A]/25"
                        }`} style={sans}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#0D1B2A]/50 mb-1.5 uppercase tracking-wider" style={mono}>Bio</p>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                    className="w-full rounded-xl border border-[#0D1B2A]/12 px-3 py-2.5 text-sm text-[#0D1B2A] outline-none focus:border-[#FF6B35] resize-none"
                    style={sans} />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 border border-[#0D1B2A]/6">
                <p className="text-xs font-semibold text-[#0D1B2A]/40 uppercase tracking-wider mb-3" style={mono}>À propos</p>
                <p className="text-[#0D1B2A]/65 leading-relaxed text-sm" style={sans}>
                  {profile.bio || "Aucune biographie renseignée."}
                </p>
                <div className="border-t border-[#0D1B2A]/6 mt-5 pt-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[#0D1B2A]/50" style={sans}>
                    <MapPin size={13} className="text-[#FF6B35]" /> {profile.city}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#0D1B2A]/50" style={sans}>
                    <Calendar size={13} className="text-[#FF6B35]" /> {profile.age} ans
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#0D1B2A]/50" style={sans}>
                    <CheckCircle size={13} className={profile.verified ? "text-green-500" : "text-gray-300"} />
                    {profile.verified ? "Identité vérifiée" : "Non vérifié"}
                  </div>
                </div>
                {isSelf && (
                  <div className="mt-5 pt-5 border-t border-[#0D1B2A]/6">
                    <Link to="/events/create"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                      style={{ ...sans, background: "#FF6B35" }}>
                      <Plus size={15} /> Organiser une sortie
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: events */}
          <div className="lg:col-span-2 space-y-10">
            {/* Organized */}
            <div>
              <h2 className="text-xl font-bold text-[#0D1B2A] mb-5" style={serif}>
                Sorties organisées ({organizedEvents.length})
              </h2>
              {organizedEvents.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-[#0D1B2A]/6">
                  <p className="text-[#0D1B2A]/35 text-sm" style={sans}>Aucune sortie organisée pour l'instant.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {organizedEvents.map(ev => (
                    <Link key={ev.id} to={`/events/${ev.id}`}
                      className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-[#0D1B2A]/6 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                      <img src={ev.image} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0D1B2A] group-hover:text-[#FF6B35] transition-colors truncate" style={sans}>{ev.title}</p>
                        <p className="text-xs text-[#0D1B2A]/40 mt-1" style={mono}>{ev.date} · {ev.city}</p>
                        <p className="text-xs text-[#0D1B2A]/40 mt-0.5" style={mono}>{ev.participantIds.length}/{ev.maxParticipants} participants</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                        ev.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                      }`} style={mono}>{ev.status === "active" ? "Actif" : "Annulé"}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Joined */}
            {joinedEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#0D1B2A] mb-5" style={serif}>
                  Sorties rejointes ({joinedEvents.length})
                </h2>
                <div className="space-y-3">
                  {joinedEvents.map(ev => (
                    <Link key={ev.id} to={`/events/${ev.id}`}
                      className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-[#0D1B2A]/6 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                      <img src={ev.image} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0D1B2A] group-hover:text-[#FF6B35] transition-colors truncate" style={sans}>{ev.title}</p>
                        <p className="text-xs text-[#0D1B2A]/40 mt-1" style={mono}>{ev.date} · {ev.city}</p>
                      </div>
                      <span className="text-lg flex-shrink-0">{ev.emoji}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
