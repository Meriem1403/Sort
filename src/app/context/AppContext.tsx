import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type Generation = "jeune" | "parent" | "senior";
export type UserRole = "user" | "admin";
export type EventStatus = "active" | "cancelled" | "completed";

export interface User {
  id: string; name: string; age: number; city: string; bio: string;
  avatar: string; role: UserRole; verified: boolean; joinedAt: string;
  generation: Generation; email: string;
}

export interface AppEvent {
  id: string; title: string; description: string; category: string; emoji: string;
  date: string; time: string; location: string; city: string;
  maxParticipants: number; participantIds: string[]; organizerId: string;
  price: number; createdAt: string; status: EventStatus; image: string;
}

const SEED_USERS: User[] = [
  { id: "admin-1", name: "Sophie Martin", age: 35, city: "Paris", bio: "Administratrice de la plateforme Sort ton vieux.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format", role: "admin", verified: true, joinedAt: "2024-01-01", generation: "parent", email: "admin@sortttvieux.fr" },
  { id: "user-1", name: "Louis Dupont", age: 28, city: "Paris", bio: "J'adore passer du temps avec ma grand-mère Andrée. Sort ton vieux nous a permis de rencontrer des gens formidables.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format", role: "user", verified: true, joinedAt: "2024-02-15", generation: "jeune", email: "louis@example.com" },
  { id: "user-2", name: "Andrée Fontaine", age: 74, city: "Paris", bio: "Retraitée depuis 10 ans, j'ai redécouvert le plaisir des sorties grâce à Sort ton vieux.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&auto=format", role: "user", verified: true, joinedAt: "2024-02-15", generation: "senior", email: "andree@example.com" },
  { id: "user-3", name: "Martine Leblanc", age: 68, city: "Lyon", bio: "J'aime les jeux de cartes, les marchés et les bons repas en bonne compagnie.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format", role: "user", verified: true, joinedAt: "2024-03-01", generation: "senior", email: "martine@example.com" },
  { id: "user-4", name: "Thomas Girard", age: 32, city: "Lyon", bio: "Passionné de jeux de société et de balades nature.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format", role: "user", verified: false, joinedAt: "2024-03-10", generation: "jeune", email: "thomas@example.com" },
  { id: "user-5", name: "Élise Moreau", age: 45, city: "Bordeaux", bio: "Maman de deux enfants, j'essaie de garder contact avec les plus âgés de mon quartier.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format", role: "user", verified: true, joinedAt: "2024-04-01", generation: "parent", email: "elise@example.com" },
];

const SEED_EVENTS: AppEvent[] = [
  { id: "evt-1", title: "Soirée jeux de société", category: "Jeux", emoji: "🎲", description: "Une soirée conviviale autour de jeux classiques et modernes. Tous niveaux bienvenus !", date: "2024-07-13", time: "19:00", location: "Café Le Temps Libre, 12 rue de la Roquette", city: "Paris", maxParticipants: 12, participantIds: ["user-1", "user-2", "user-3"], organizerId: "user-1", price: 0, createdAt: "2024-06-01", status: "active", image: "https://images.unsplash.com/photo-1762608206423-be8c07645de7?w=800&h=500&fit=crop&auto=format" },
  { id: "evt-2", title: "Balade en forêt de Fontainebleau", category: "Balade", emoji: "🌳", description: "Marche douce de 5 km suivie d'un pique-nique partagé. Accessible à tous.", date: "2024-07-14", time: "09:00", location: "Parking de la Croix de Toulouse, Fontainebleau", city: "Fontainebleau", maxParticipants: 20, participantIds: ["user-2", "user-4"], organizerId: "user-2", price: 0, createdAt: "2024-06-05", status: "active", image: "https://images.unsplash.com/photo-1768199189778-036bcb8cc939?w=800&h=500&fit=crop&auto=format" },
  { id: "evt-3", title: "Pizza en famille à la Part-Dieu", category: "Restaurant", emoji: "🍕", description: "Déjeuner autour de pizzas artisanales dans une trattoria chaleureuse.", date: "2024-07-20", time: "12:30", location: "Trattoria Bella Italia, 45 rue de la Part-Dieu", city: "Lyon", maxParticipants: 8, participantIds: ["user-3", "user-4"], organizerId: "user-4", price: 15, createdAt: "2024-06-08", status: "active", image: "https://images.unsplash.com/photo-1560090201-8a6a2bdab9ff?w=800&h=500&fit=crop&auto=format" },
  { id: "evt-4", title: "Théâtre Belleville — Comédie", category: "Théâtre", emoji: "🎭", description: "Soirée théâtre pour rire ensemble. La pièce met en scène des situations intergénérationnelles hilarantes.", date: "2024-07-19", time: "19:30", location: "Théâtre de Belleville, 94 rue du Faubourg du Temple", city: "Paris", maxParticipants: 30, participantIds: ["user-1", "user-5"], organizerId: "admin-1", price: 12, createdAt: "2024-06-10", status: "active", image: "https://images.unsplash.com/photo-1761415449592-cb6ce5403ecd?w=800&h=500&fit=crop&auto=format" },
  { id: "evt-5", title: "Marché des créateurs — Dimanche", category: "Marché", emoji: "🛒", description: "Flânerie au marché local. Café, boulangerie artisanale, et bonne humeur garantis.", date: "2024-07-21", time: "09:30", location: "Place des Quinconces", city: "Bordeaux", maxParticipants: 15, participantIds: ["user-5"], organizerId: "user-3", price: 0, createdAt: "2024-06-12", status: "active", image: "https://images.unsplash.com/photo-1758687126595-edcb2bdf03bd?w=800&h=500&fit=crop&auto=format" },
  { id: "evt-6", title: "Café intergénérationnel", category: "Café", emoji: "☕", description: "Un après-midi décontracté autour d'un café. On discute, on rit, on partage.", date: "2024-07-17", time: "15:00", location: "Le Café des Générations, 8 rue Sainte-Catherine", city: "Bordeaux", maxParticipants: 10, participantIds: ["user-1", "user-5"], organizerId: "user-5", price: 0, createdAt: "2024-06-14", status: "active", image: "https://images.unsplash.com/photo-1779551240879-41ad4fafe660?w=800&h=500&fit=crop&auto=format" },
];

interface AppContextType {
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  register: (data: Omit<User, "id" | "joinedAt" | "verified" | "role">) => User;
  users: User[];
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  verifyUser: (id: string) => void;
  makeAdmin: (id: string) => void;
  events: AppEvent[];
  createEvent: (data: Omit<AppEvent, "id" | "createdAt" | "participantIds" | "organizerId">) => AppEvent;
  updateEvent: (id: string, data: Partial<AppEvent>) => void;
  deleteEvent: (id: string) => void;
  joinEvent: (eventId: string) => void;
  leaveEvent: (eventId: string) => void;
  getUserById: (id: string) => User | undefined;
  getEventById: (id: string) => AppEvent | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users,       setUsers]       = useState<User[]>(SEED_USERS);
  const [events,      setEvents]      = useState<AppEvent[]>(SEED_EVENTS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (email: string): boolean => {
    const u = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (u) { setCurrentUser(u); return true; }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const register = (data: Omit<User, "id" | "joinedAt" | "verified" | "role">): User => {
    const nu: User = { ...data, id: `user-${Date.now()}`, joinedAt: new Date().toISOString().split("T")[0], verified: false, role: "user" };
    setUsers(p => [...p, nu]);
    setCurrentUser(nu);
    return nu;
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(p => p.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser?.id === id) setCurrentUser(p => p ? { ...p, ...data } : null);
  };

  const deleteUser = (id: string) => {
    setUsers(p => p.filter(u => u.id !== id));
    if (currentUser?.id === id) setCurrentUser(null);
  };

  const verifyUser = (id: string) => {
    const u = users.find(u => u.id === id);
    if (u) updateUser(id, { verified: !u.verified });
  };

  const makeAdmin = (id: string) => {
    const u = users.find(u => u.id === id);
    if (u) updateUser(id, { role: u.role === "admin" ? "user" : "admin" });
  };

  const createEvent = (data: Omit<AppEvent, "id" | "createdAt" | "participantIds" | "organizerId">): AppEvent => {
    const ne: AppEvent = { ...data, id: `evt-${Date.now()}`, createdAt: new Date().toISOString().split("T")[0], participantIds: [], organizerId: currentUser?.id ?? "" };
    setEvents(p => [ne, ...p]);
    return ne;
  };

  const updateEvent = (id: string, data: Partial<AppEvent>) =>
    setEvents(p => p.map(e => e.id === id ? { ...e, ...data } : e));

  const deleteEvent = (id: string) => setEvents(p => p.filter(e => e.id !== id));

  const joinEvent = (eventId: string) => {
    if (!currentUser) return;
    setEvents(p => p.map(e => {
      if (e.id !== eventId || e.participantIds.includes(currentUser.id) || e.participantIds.length >= e.maxParticipants) return e;
      return { ...e, participantIds: [...e.participantIds, currentUser.id] };
    }));
  };

  const leaveEvent = (eventId: string) => {
    if (!currentUser) return;
    setEvents(p => p.map(e => e.id === eventId ? { ...e, participantIds: e.participantIds.filter(id => id !== currentUser.id) } : e));
  };

  const getUserById  = (id: string) => users.find(u => u.id === id);
  const getEventById = (id: string) => events.find(e => e.id === id);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, register,
      users, updateUser, deleteUser, verifyUser, makeAdmin,
      events, createEvent, updateEvent, deleteEvent, joinEvent, leaveEvent,
      getUserById, getEventById,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
