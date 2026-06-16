import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { MapPin, Calendar, Clock, Users, Euro, ArrowLeft, Image, AlignLeft, Tag } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Nav } from "../components/Nav";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const sans  = { fontFamily: "'DM Sans', system-ui, sans-serif" } as const;
const mono  = { fontFamily: "'DM Mono', 'Courier New', monospace" } as const;

const CATEGORIES = [
  { value: "Jeux",       emoji: "🎲" },
  { value: "Balade",     emoji: "🌳" },
  { value: "Restaurant", emoji: "🍽️" },
  { value: "Théâtre",    emoji: "🎭" },
  { value: "Café",       emoji: "☕" },
  { value: "Marché",     emoji: "🛒" },
  { value: "Concert",    emoji: "🎵" },
  { value: "Musée",      emoji: "🖼️" },
  { value: "Cinéma",     emoji: "🎬" },
  { value: "Sport",      emoji: "⚽" },
  { value: "Autre",      emoji: "✨" },
];

const SUGGESTED_IMAGES = [
  "https://images.unsplash.com/photo-1762608206423-be8c07645de7?w=800&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1768199189778-036bcb8cc939?w=800&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1761415449592-cb6ce5403ecd?w=800&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1560090201-8a6a2bdab9ff?w=800&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1758613171860-99ef6386e33f?w=800&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1779551240879-41ad4fafe660?w=800&h=500&fit=crop&auto=format",
];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0D1B2A] mb-2" style={sans}>
        {label} {required && <span className="text-[#FF6B35]">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full rounded-xl border border-[#0D1B2A]/12 bg-white px-4 py-3 text-[#0D1B2A] text-sm outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15";

export default function CreateEventPage() {
  const { id } = useParams();           // if set → edit mode
  const navigate = useNavigate();
  const { currentUser, createEvent, updateEvent, getEventById } = useApp();
  const isEdit = Boolean(id);
  const existing = isEdit ? getEventById(id!) : undefined;

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) navigate("/auth");
  }, [currentUser, navigate]);

  // Block non-owner non-admin from editing
  useEffect(() => {
    if (isEdit && existing && currentUser) {
      if (existing.organizerId !== currentUser.id && currentUser.role !== "admin") {
        navigate(`/events/${id}`);
      }
    }
  }, [isEdit, existing, currentUser, id, navigate]);

  const [title,        setTitle]        = useState(existing?.title        ?? "");
  const [description,  setDescription]  = useState(existing?.description  ?? "");
  const [category,     setCategory]     = useState(existing?.category     ?? "Jeux");
  const [date,         setDate]         = useState(existing?.date         ?? "");
  const [time,         setTime]         = useState(existing?.time         ?? "18:00");
  const [location,     setLocation]     = useState(existing?.location     ?? "");
  const [city,         setCity]         = useState(existing?.city         ?? "");
  const [maxP,         setMaxP]         = useState(String(existing?.maxParticipants ?? 10));
  const [price,        setPrice]        = useState(String(existing?.price ?? 0));
  const [image,        setImage]        = useState(existing?.image        ?? SUGGESTED_IMAGES[0]);
  const [error,        setError]        = useState("");

  const selectedCat = CATEGORIES.find(c => c.value === category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title || !description || !date || !location || !city) {
      setError("Merci de remplir tous les champs obligatoires."); return;
    }
    const maxParsed   = parseInt(maxP);
    const priceP = parseFloat(price);
    if (isNaN(maxParsed) || maxParsed < 2) { setError("Le nombre de participants doit être au moins 2."); return; }

    const data = {
      title, description, category,
      emoji: selectedCat?.emoji ?? "✨",
      date, time, location, city,
      maxParticipants: maxParsed,
      price: isNaN(priceP) ? 0 : priceP,
      image: image || SUGGESTED_IMAGES[0],
      status: "active" as const,
    };

    if (isEdit && id) {
      updateEvent(id, data);
      navigate(`/events/${id}`);
    } else {
      const ev = createEvent(data);
      navigate(`/events/${ev.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      <Nav />
      <div className="max-w-2xl mx-auto px-6 py-10 pt-28">
        <Link to="/events" className="inline-flex items-center gap-2 text-[#0D1B2A]/50 hover:text-[#0D1B2A] text-sm mb-8 transition-colors" style={sans}>
          <ArrowLeft size={16} /> Toutes les sorties
        </Link>

        <div className="mb-8">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#FF6B35] mb-2" style={mono}>
            {isEdit ? "Modifier la sortie" : "Nouvelle sortie"}
          </p>
          <h1 className="text-[#0D1B2A]" style={{ ...serif, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900 }}>
            {isEdit ? "Modifier l'événement" : "Organisez votre sortie"}
          </h1>
          <p className="text-[#0D1B2A]/50 mt-2" style={sans}>
            Partagez-la avec votre communauté et invitez d'autres générations à vous rejoindre.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image picker */}
          <Field label="Image de couverture">
            <div className="space-y-3">
              {image && (
                <div className="rounded-2xl overflow-hidden" style={{ height: 160 }}>
                  <img src={image} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {SUGGESTED_IMAGES.map(src => (
                  <button key={src} type="button" onClick={() => setImage(src)}
                    className={`flex-shrink-0 rounded-xl overflow-hidden transition-all ${image === src ? "ring-2 ring-[#FF6B35] ring-offset-2 scale-105" : "opacity-60 hover:opacity-100"}`}
                    style={{ width: 80, height: 56 }}>
                    <img src={src} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="relative">
                <Image size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={image} onChange={e => setImage(e.target.value)}
                  placeholder="Ou collez l'URL d'une image..."
                  className={inputClass} style={{ ...sans, paddingLeft: "2.25rem" }} />
              </div>
            </div>
          </Field>

          {/* Title */}
          <Field label="Titre de la sortie" required>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Soirée jeux de société au café…" required className={inputClass} style={sans} />
          </Field>

          {/* Category */}
          <Field label="Catégorie" required>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                    category === cat.value
                      ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                      : "bg-white text-[#0D1B2A] border-[#0D1B2A]/10 hover:border-[#0D1B2A]/30"
                  }`} style={sans}>
                  <span>{cat.emoji}</span> {cat.value}
                </button>
              ))}
            </div>
          </Field>

          {/* Description */}
          <Field label="Description" required>
            <div className="relative">
              <AlignLeft size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                rows={4} required placeholder="Décrivez votre sortie : ambiance, programme, ce qu'il faut apporter…"
                className={`${inputClass} resize-none`} style={{ ...sans, paddingLeft: "2.25rem" }} />
            </div>
          </Field>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" required>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                  className={inputClass} style={{ ...sans, paddingLeft: "2.25rem" }} />
              </div>
            </Field>
            <Field label="Heure" required>
              <div className="relative">
                <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="time" value={time} onChange={e => setTime(e.target.value)} required
                  className={inputClass} style={{ ...sans, paddingLeft: "2.25rem" }} />
              </div>
            </Field>
          </div>

          {/* Location */}
          <Field label="Adresse complète" required>
            <div className="relative">
              <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="12 rue de la Roquette, Paris" required
                className={inputClass} style={{ ...sans, paddingLeft: "2.25rem" }} />
            </div>
          </Field>

          {/* City */}
          <Field label="Ville" required>
            <div className="relative">
              <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={city} onChange={e => setCity(e.target.value)}
                placeholder="Paris" required
                className={inputClass} style={{ ...sans, paddingLeft: "2.25rem" }} />
            </div>
          </Field>

          {/* Participants + Price */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Participants max." required>
              <div className="relative">
                <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" min={2} max={200} value={maxP} onChange={e => setMaxP(e.target.value)}
                  className={inputClass} style={{ ...sans, paddingLeft: "2.25rem" }} />
              </div>
            </Field>
            <Field label="Participation (€)">
              <div className="relative">
                <Euro size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" min={0} step={0.5} value={price} onChange={e => setPrice(e.target.value)}
                  placeholder="0 = gratuit"
                  className={inputClass} style={{ ...sans, paddingLeft: "2.25rem" }} />
              </div>
            </Field>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600" style={sans}>{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <Link to={isEdit ? `/events/${id}` : "/events"}
              className="flex-1 text-center py-3.5 rounded-xl border border-[#0D1B2A]/12 text-[#0D1B2A] font-semibold text-sm hover:border-[#0D1B2A]/30 transition-colors"
              style={sans}>
              Annuler
            </Link>
            <button type="submit"
              className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ ...sans, background: "#FF6B35", boxShadow: "0 4px 16px rgba(255,107,53,0.3)" }}>
              {isEdit ? "Enregistrer les modifications" : "Publier la sortie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
