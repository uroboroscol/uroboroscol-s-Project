import { useSearchParams } from "react-router-dom";
import { EventLineupPage } from "./components/EventLineupPage";
import { AdminLineupPage } from "./components/AdminLineupPage";
import "./components/components.css";

function App() {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  return isAdmin ? (
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
  );
}

export default App;