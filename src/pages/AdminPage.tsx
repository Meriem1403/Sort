import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Users, Calendar, Shield, Trash2, Edit, CheckCircle,
  XCircle, TrendingUp, Eye, Crown, BarChart2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const sans  = { fontFamily: "'DM Sans', system-ui, sans-serif" } as const;
const mono  = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

type Tab = "dashboard" | "events" | "users";

const GEN_COLOR: Record<string, string> = { jeune: "#7C3AED", parent: "#FF6B35", senior: "#059669" };

export default function AdminPage() {
  const { currentUser, users, events, deleteUser, deleteEvent, verifyUser, makeAdmin, updateEvent } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmType, setConfirmType] = useState<"event" | "user" | null>(null);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FBF6EE] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center px-6 pt-20">
          <Shield size={48} className="text-gray-300" />
          <h2 className="text-2xl font-bold text-[#0D1B2A]" style={serif}>Accès refusé</h2>
          <p className="text-[#0D1B2A]/50" style={sans}>Cette page est réservée aux administrateurs.</p>
          <Link to="/events" className="text-white font-semibold px-6 py-3 rounded-full" style={{ ...sans, background: "#FF6B35" }}>
            Retour aux sorties
          </Link>
        </div>
      </div>
    );
  }

  const activeEvents   = events.filter(e => e.status === "active").length;
  const totalParticip  = events.reduce((s, e) => s + e.participantIds.length, 0);
  const verifiedUsers  = users.filter(u => u.verified).length;

  const stats = [
    { icon: Users,    label: "Membres",          value: users.length,    color: "#7C3AED" },
    { icon: Calendar, label: "Sorties actives",   value: activeEvents,    color: "#FF6B35" },
    { icon: TrendingUp, label: "Participations",  value: totalParticip,   color: "#059669" },
    { icon: CheckCircle, label: "Profils vérifiés", value: verifiedUsers, color: "#0ea5e9" },
  ];

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setConfirmId(null);
    setConfirmType(null);
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
    setConfirmId(null);
    setConfirmType(null);
  };

  const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: "dashboard", label: "Tableau de bord", icon: BarChart2 },
    { id: "events",    label: "Événements",      icon: Calendar },
    { id: "users",     label: "Utilisateurs",    icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      <Nav />

      {/* Header */}
      <div className="bg-[#0D1B2A] pt-24 pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/20 flex items-center justify-center">
              <Shield size={16} className="text-[#FF6B35]" />
            </div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#FF6B35]" style={mono}>Administration</p>
          </div>
          <h1 className="text-white" style={{ ...serif, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900 }}>
            Tableau de bord
          </h1>
          <p className="text-white/40 mt-1 text-sm" style={sans}>Bienvenue, {currentUser.name.split(" ")[0]}. Gérez la plateforme Sort ton vieux.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#0D1B2A]/8 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex gap-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all ${
                tab === t.id
                  ? "border-[#FF6B35] text-[#FF6B35]"
                  : "border-transparent text-[#0D1B2A]/45 hover:text-[#0D1B2A]"
              }`} style={sans}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* ── DASHBOARD ─────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <div className="space-y-10">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-white rounded-3xl p-6 border border-[#0D1B2A]/6">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <p className="text-3xl font-black text-[#0D1B2A]" style={serif}>{value}</p>
                  <p className="text-sm text-[#0D1B2A]/45 mt-1" style={sans}>{label}</p>
                </div>
              ))}
            </div>

            {/* Recent events */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#0D1B2A]" style={serif}>Dernières sorties</h2>
                <button onClick={() => setTab("events")} className="text-sm text-[#FF6B35] font-medium hover:underline" style={sans}>Tout voir →</button>
              </div>
              <div className="bg-white rounded-3xl border border-[#0D1B2A]/6 overflow-hidden">
                {events.slice(0, 5).map((ev, i) => (
                  <div key={ev.id} className={`flex items-center gap-4 p-4 ${i < events.slice(0,5).length - 1 ? "border-b border-[#0D1B2A]/5" : ""}`}>
                    <img src={ev.image} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0D1B2A] truncate" style={sans}>{ev.title}</p>
                      <p className="text-xs text-[#0D1B2A]/40 mt-0.5" style={mono}>{ev.date} · {ev.city}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ev.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`} style={mono}>
                        {ev.status === "active" ? "Actif" : "Annulé"}
                      </span>
                      <Link to={`/events/${ev.id}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                        <Eye size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent users */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#0D1B2A]" style={serif}>Membres récents</h2>
                <button onClick={() => setTab("users")} className="text-sm text-[#FF6B35] font-medium hover:underline" style={sans}>Tout voir →</button>
              </div>
              <div className="bg-white rounded-3xl border border-[#0D1B2A]/6 overflow-hidden">
                {users.slice(0, 5).map((u, i) => (
                  <div key={u.id} className={`flex items-center gap-4 p-4 ${i < users.slice(0,5).length - 1 ? "border-b border-[#0D1B2A]/5" : ""}`}>
                    <img src={u.avatar} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0D1B2A] truncate" style={sans}>
                        {u.name} {u.role === "admin" && <Crown size={12} className="inline text-[#FF6B35] ml-1" />}
                      </p>
                      <p className="text-xs text-[#0D1B2A]/40" style={mono}>{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {u.verified && <CheckCircle size={14} className="text-green-500" />}
                      <span className="text-xs capitalize text-[#0D1B2A]/40 bg-[#0D1B2A]/5 px-2 py-0.5 rounded-full" style={mono}>{u.generation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── EVENTS ────────────────────────────────────────────── */}
        {tab === "events" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0D1B2A]" style={serif}>
                Tous les événements ({events.length})
              </h2>
              <Link to="/events/create"
                className="inline-flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-all hover:scale-105"
                style={{ ...sans, background: "#FF6B35" }}>
                + Créer
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-[#0D1B2A]/6 overflow-hidden">
              {events.map((ev, i) => (
                <div key={ev.id} className={`flex items-center gap-4 p-4 ${i < events.length - 1 ? "border-b border-[#0D1B2A]/5" : ""}`}>
                  <img src={ev.image} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0D1B2A] truncate" style={sans}>{ev.title}</p>
                    <p className="text-xs text-[#0D1B2A]/40 mt-0.5" style={mono}>
                      {ev.date} · {ev.city} · {ev.participantIds.length}/{ev.maxParticipants} participants
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ev.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`} style={mono}>
                      {ev.status === "active" ? "Actif" : "Annulé"}
                    </span>
                    {/* Toggle status */}
                    <button onClick={() => updateEvent(ev.id, { status: ev.status === "active" ? "cancelled" : "active" })}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      title={ev.status === "active" ? "Annuler" : "Réactiver"}>
                      {ev.status === "active"
                        ? <XCircle size={15} className="text-red-400" />
                        : <CheckCircle size={15} className="text-green-400" />}
                    </button>
                    <Link to={`/events/${ev.id}/edit`} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#0D1B2A]/40 transition-colors">
                      <Edit size={15} />
                    </Link>
                    <Link to={`/events/${ev.id}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#0D1B2A]/40 transition-colors">
                      <Eye size={15} />
                    </Link>
                    {confirmId === ev.id && confirmType === "event" ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDeleteEvent(ev.id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg font-bold" style={sans}>
                          Confirmer
                        </button>
                        <button onClick={() => { setConfirmId(null); setConfirmType(null); }}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg" style={sans}>
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => { setConfirmId(ev.id); setConfirmType("event"); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── USERS ─────────────────────────────────────────────── */}
        {tab === "users" && (
          <div>
            <h2 className="text-xl font-bold text-[#0D1B2A] mb-6" style={serif}>
              Tous les membres ({users.length})
            </h2>

            <div className="bg-white rounded-3xl border border-[#0D1B2A]/6 overflow-hidden">
              {users.map((u, i) => (
                <div key={u.id} className={`flex items-center gap-4 p-4 ${i < users.length - 1 ? "border-b border-[#0D1B2A]/5" : ""}`}>
                  <img src={u.avatar} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#0D1B2A]" style={sans}>
                        {u.name}
                        {u.verified && <CheckCircle size={12} className="inline text-green-500 ml-1" />}
                      </p>
                      {u.role === "admin" && (
                        <span className="text-[10px] font-bold text-[#FF6B35] bg-[#FF6B35]/10 px-2 py-0.5 rounded-full" style={mono}>Admin</span>
                      )}
                    </div>
                    <p className="text-xs text-[#0D1B2A]/40 mt-0.5 truncate" style={mono}>{u.email} · {u.city}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-[10px] font-semibold text-white px-2 py-0.5 rounded-full capitalize"
                      style={{ background: GEN_COLOR[u.generation] ?? "#999", ...mono }}>
                      {u.generation}
                    </span>
                    {/* Verify */}
                    <button onClick={() => verifyUser(u.id)}
                      className={`p-1.5 rounded-lg transition-colors ${u.verified ? "bg-green-50 text-green-500 hover:bg-red-50 hover:text-red-400" : "hover:bg-green-50 text-gray-300 hover:text-green-500"}`}
                      title={u.verified ? "Retirer la vérification" : "Vérifier"}>
                      <CheckCircle size={15} />
                    </button>
                    {/* Make admin */}
                    {u.id !== currentUser.id && (
                      <button onClick={() => makeAdmin(u.id)}
                        className={`p-1.5 rounded-lg transition-colors ${u.role === "admin" ? "bg-[#FF6B35]/10 text-[#FF6B35]" : "hover:bg-[#FF6B35]/10 text-gray-300 hover:text-[#FF6B35]"}`}
                        title={u.role === "admin" ? "Rétrograder" : "Promouvoir admin"}>
                        <Crown size={15} />
                      </button>
                    )}
                    {/* View profile */}
                    <Link to={`/profile/${u.id}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#0D1B2A]/40 transition-colors">
                      <Eye size={15} />
                    </Link>
                    {/* Delete */}
                    {u.id !== currentUser.id && (
                      confirmId === u.id && confirmType === "user" ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDeleteUser(u.id)}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg font-bold" style={sans}>
                            Confirmer
                          </button>
                          <button onClick={() => { setConfirmId(null); setConfirmType(null); }}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg" style={sans}>
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => { setConfirmId(u.id); setConfirmType("user"); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-300 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
