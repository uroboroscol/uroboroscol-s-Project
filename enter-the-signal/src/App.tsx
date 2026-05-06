import { useSearchParams } from "react-router-dom";
import { EventLineupPage } from "./components/EventLineupPage";
import { AdminLineupPage } from "./components/AdminLineupPage";
import "./components/components.css";

function App() {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  return (
    <div className="app-container">
      {/* Watermark Background */}
      <div className="logo-watermark">
        <img src="/logo.jpg" alt="" />
      </div>

      <header className="app-header">
        <div className="container header-content">
          <div className="logo-section">
            <div className="uroboros-container">
              <img src="/logo.jpg" alt="Logo" className="main-logo" />
            </div>
            <div className="brand-text">
              <h1 className="brand-title">UROBOROS</h1>
            </div>
          </div>
        </div>
      </header>

      {isAdmin ? (
        <AdminLineupPage
          eventId="enter-the-signal-privado-1"
          eventName="ENTER THE SIGNAL"
        />
      ) : (
        <EventLineupPage
          eventId="enter-the-signal-privado-1"
          eventName="ENTER THE SIGNAL"
          eventDate="Sábado 9 de mayo"
          eventTime="1:00 p.m. - 2:00 a.m."
          eventLocation="Terraza privada / espacio humilde"
          eventEquipment="Controladora FLX4, Sonido básico, Visuales, Zona de videojuegos"
        />
      )}
    </div>
  );
}

export default App;