import { useState, useEffect, useCallback } from "react";
import { EventInfoCard } from "./EventInfoCard";
import { LineupStats } from "./LineupStats";
import { LineupSlotCard } from "./LineupSlotCard";
import { DjSignupModal } from "./DjSignupModal";
import { TimeTable } from "./TimeTable";
import type { LineupSlot, DjData } from "../lib/lineupService";
import {
  fetchLineupSlots,
  reserveLineupSlot,
  copyWhatsappConfirmation,
} from "../lib/lineupService";

interface EventLineupPageProps {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventEquipment?: string;
}

export function EventLineupPage({
  eventId,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  eventEquipment,
}: EventLineupPageProps) {
  const [slots, setSlots] = useState<LineupSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<LineupSlot | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchLineupSlots(eventId);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setSlots(result.data);
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReserve = (slot: LineupSlot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleCopy = (slot: LineupSlot) => {
    copyWhatsappConfirmation(slot);
    showNotification("¡Mensaje copiado al portapapeles!");
  };

  const handleSubmit = async (slotId: string, djData: DjData) => {
    const result = await reserveLineupSlot(slotId, djData);
    if (result.error) {
      if (result.error.includes("No rows") || result.error.includes("0 rows")) {
        showNotification("Lo sentimos, este slot acaba de ser reservado por otra persona.");
      } else {
        showNotification(`Error: ${result.error}`);
      }
    } else {
      showNotification("Tu horario quedó reservado. El organizador confirmará tu espacio.");
      loadSlots();
    }
  };

  return (
    <div className="event-lineup-page">
      {notification && <div className="notification">{notification}</div>}

      <div className="lineup-layout">
        <div className="lineup-main">
          <EventInfoCard
            eventName={eventName}
            eventDate={eventDate}
            eventTime={eventTime}
            eventLocation={eventLocation}
            eventEquipment={eventEquipment}
            slots={slots}
          />

          <LineupStats slots={slots} />

          {loading && <div className="loading">Cargando lineup...</div>}
          {error && <div className="error-message">{error}</div>}

          {!loading && !error && (
            <div className="slots-grid">
              {slots.map((slot) => (
                <LineupSlotCard
                  key={slot.id}
                  slot={slot}
                  onReserve={handleReserve}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          )}
        </div>

        <aside className="lineup-sidebar">
          <div className="timetable-sticky">
            <TimeTable
              eventId={eventId}
              eventName={eventName}
            />
          </div>
        </aside>
      </div>

      {selectedSlot && (
        <DjSignupModal
          slot={selectedSlot}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedSlot(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}