import { BrowserRouter, Routes, Route } from "react-router";
import { AppProvider }      from "./context/AppContext";
import LandingPage          from "./pages/LandingPage";
import AuthPage             from "./pages/AuthPage";
import EventsPage           from "./pages/EventsPage";
import EventDetailPage      from "./pages/EventDetailPage";
import CreateEventPage      from "./pages/CreateEventPage";
import ProfilePage          from "./pages/ProfilePage";
import AdminPage            from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/"                element={<LandingPage />} />
          <Route path="/auth"            element={<AuthPage />} />
          <Route path="/events"          element={<EventsPage />} />
          <Route path="/events/create"   element={<CreateEventPage />} />
          <Route path="/events/:id/edit" element={<CreateEventPage />} />
          <Route path="/events/:id"      element={<EventDetailPage />} />
          <Route path="/profile/:id"     element={<ProfilePage />} />
          <Route path="/admin"           element={<AdminPage />} />
          <Route path="*"               element={<LandingPage />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
