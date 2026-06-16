import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { Eye, EyeOff, User, Mail, MapPin, Calendar, ArrowRight, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Generation } from "../context/AppContext";
import { Nav } from "../components/Nav";

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

const GENERATIONS: { value: Generation; label: string; desc: string; emoji: string }[] = [
  { value: "jeune",  label: "Jeune",  desc: "18 – 35 ans", emoji: "🧑" },
  { value: "parent", label: "Parent", desc: "35 – 60 ans", emoji: "👨‍👩‍👧" },
  { value: "senior", label: "Senior", desc: "60 ans +",    emoji: "🧓" },
];

function InputField({
  label, type = "text", value, onChange, placeholder, icon: Icon, required = false,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; icon?: React.ComponentType<{ size?: number; className?: string }>;
  required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5" style={sans}>
        {label} {required && <span className="text-[#FF6B35]">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={16} className="text-gray-400" />
          </div>
        )}
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-[#0D1B2A]/12 bg-white px-4 py-3 text-[#0D1B2A] text-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15"
          style={{ ...sans, paddingLeft: Icon ? "2.5rem" : undefined }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { login, users } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(email.trim());
    if (ok) navigate("/events");
    else setError("Aucun compte trouvé avec cet e-mail. Essayez un des comptes de démonstration ci-dessous.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <InputField label="Adresse e-mail" type="email" value={email} onChange={setEmail}
        placeholder="vous@example.com" icon={Mail} required />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600" style={sans}>{error}</div>
      )}

      <button type="submit"
        className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:scale-[1.02] hover:shadow-lg"
        style={{ ...sans, background: "#FF6B35", boxShadow: "0 4px 16px rgba(255,107,53,0.3)" }}>
        Se connecter
      </button>

      {/* Demo accounts */}
      <div className="rounded-2xl border border-dashed border-[#0D1B2A]/15 p-4">
        <p className="text-xs text-[#0D1B2A]/50 mb-3 font-medium" style={mono}>Comptes de démonstration</p>
        <div className="space-y-2">
          {users.slice(0, 3).map(u => (
            <button key={u.id} type="button"
              onClick={() => { setEmail(u.email); }}
              className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
              <img src={u.avatar} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#0D1B2A] truncate" style={sans}>{u.name}</p>
                <p className="text-[11px] text-gray-400 truncate" style={mono}>{u.email} {u.role === "admin" && "· Admin"}</p>
              </div>
              <ArrowRight size={14} className="text-gray-300 flex-shrink-0 ml-auto" />
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-[#0D1B2A]/50" style={sans}>
        Pas encore de compte ?{" "}
        <button type="button" onClick={onSwitch} className="text-[#FF6B35] font-semibold hover:underline">
          Créer un compte
        </button>
      </p>
    </form>
  );
}

// ── REGISTER ──────────────────────────────────────────────────────────
function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const { register } = useApp();
  const navigate = useNavigate();

  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [age, setAge]                 = useState("");
  const [city, setCity]               = useState("");
  const [bio, setBio]                 = useState("");
  const [generation, setGeneration]   = useState<Generation>("jeune");
  const [avatar, setAvatar]           = useState(AVATARS[0]);
  const [error, setError]             = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !age || !city) { setError("Merci de remplir tous les champs obligatoires."); return; }
    if (parseInt(age) < 18 || parseInt(age) > 120) { setError("L'âge doit être compris entre 18 et 120 ans."); return; }
    register({ name, email, age: parseInt(age), city, bio, generation, avatar });
    navigate("/events");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Avatar picker */}
      <div>
        <label className="block text-sm font-medium text-[#0D1B2A] mb-2" style={sans}>
          Photo de profil <span className="text-[#FF6B35]">*</span>
        </label>
        <div className="flex flex-wrap gap-2.5">
          {AVATARS.map(src => (
            <button key={src} type="button" onClick={() => setAvatar(src)}
              className={`relative rounded-full overflow-hidden transition-all ${avatar === src ? "ring-2 ring-[#FF6B35] ring-offset-2 scale-110" : "opacity-60 hover:opacity-100"}`}
              style={{ width: 44, height: 44 }}>
              <img src={src} className="w-full h-full object-cover" />
              {avatar === src && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(255,107,53,0.2)" }}>
                  <Check size={14} color="white" strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Prénom et nom" value={name} onChange={setName} placeholder="Louis Dupont" icon={User} required />
        <InputField label="Âge" type="number" value={age} onChange={setAge} placeholder="28" icon={Calendar} required />
      </div>

      <InputField label="Adresse e-mail" type="email" value={email} onChange={setEmail}
        placeholder="vous@example.com" icon={Mail} required />

      <InputField label="Ville" value={city} onChange={setCity} placeholder="Paris" icon={MapPin} required />

      {/* Generation picker */}
      <div>
        <label className="block text-sm font-medium text-[#0D1B2A] mb-2" style={sans}>
          Vous êtes… <span className="text-[#FF6B35]">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {GENERATIONS.map(g => (
            <button key={g.value} type="button" onClick={() => setGeneration(g.value)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                generation === g.value
                  ? "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]"
                  : "border-[#0D1B2A]/10 text-[#0D1B2A]/60 hover:border-[#0D1B2A]/25"
              }`}>
              <span className="text-xl">{g.emoji}</span>
              <span className="text-xs font-semibold" style={sans}>{g.label}</span>
              <span className="text-[10px]" style={mono}>{g.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-[#0D1B2A] mb-1.5" style={sans}>
          Quelques mots sur vous
        </label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={3}
          placeholder="Passionné(e) de balades, de bons repas et de rencontres enrichissantes..."
          className="w-full rounded-xl border border-[#0D1B2A]/12 bg-white px-4 py-3 text-[#0D1B2A] text-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 resize-none"
          style={sans}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600" style={sans}>{error}</div>
      )}

      <button type="submit"
        className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:scale-[1.02] hover:shadow-lg"
        style={{ ...sans, background: "#FF6B35", boxShadow: "0 4px 16px rgba(255,107,53,0.3)" }}>
        Créer mon compte
      </button>

      <p className="text-center text-sm text-[#0D1B2A]/50" style={sans}>
        Déjà un compte ?{" "}
        <button type="button" onClick={onSwitch} className="text-[#FF6B35] font-semibold hover:underline">
          Se connecter
        </button>
      </p>
    </form>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<"login" | "register">(
    searchParams.get("tab") === "register" ? "register" : "login"
  );
  const { currentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) navigate("/events");
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      <Nav />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-[#0D1B2A]/8 border border-[#0D1B2A]/5 overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6">
              <Link to="/">
                <p className="font-black text-2xl text-[#0D1B2A] mb-6" style={serif}>
                  Sort<span style={{ color: "#FF6B35", fontStyle: "italic" }}>.</span>
                </p>
              </Link>
              <h1 className="text-2xl font-bold text-[#0D1B2A] mb-1" style={serif}>
                {tab === "login" ? "Bon retour !" : "Rejoindre l'aventure"}
              </h1>
              <p className="text-[#0D1B2A]/50 text-sm" style={sans}>
                {tab === "login"
                  ? "Connectez-vous pour accéder à vos sorties."
                  : "Créez votre profil et trouvez des sorties près de chez vous."}
              </p>

              {/* Tabs */}
              <div className="flex mt-5 bg-[#FBF6EE] rounded-xl p-1">
                {(["login", "register"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                      tab === t ? "bg-white text-[#0D1B2A] shadow-sm" : "text-[#0D1B2A]/45 hover:text-[#0D1B2A]"
                    }`} style={sans}>
                    {t === "login" ? "Connexion" : "Inscription"}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-8 pb-8">
              {tab === "login"
                ? <LoginForm onSwitch={() => setTab("register")} />
                : <RegisterForm onSwitch={() => setTab("login")} />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
