import { useState, useEffect } from "react";
import { EventInfoCard } from "./EventInfoCard";
import { LineupStats } from "./LineupStats";
import { LineupSlotCard } from "./LineupSlotCard";
import { DjSignupModal } from "./DjSignupModal";
import type { LineupSlot, DjData } from "../lib/lineupService";
import {
  fetchLineupSlots,
  reserveLineupSlot,
  confirmLineupSlot,
  cancelLineupSlot,
  releaseLineupSlot,
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

  const loadSlots = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchLineupSlots(eventId);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setSlots(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSlots();
  }, [eventId]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReserve = (slot: LineupSlot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleConfirm = async (slot: LineupSlot) => {
    const result = await confirmLineupSlot(slot.id);
    if (result.error) {
      showNotification(`Error: ${result.error}`);
    } else {
      showNotification("¡Slot confirmado!");
      loadSlots();
    }
  };

  const handleCancel = async (slot: LineupSlot) => {
    const result = await cancelLineupSlot(slot.id);
    if (result.error) {
      showNotification(`Error: ${result.error}`);
    } else {
      showNotification("Slot cancelado");
      loadSlots();
    }
  };

  const handleRelease = async (slot: LineupSlot) => {
    const result = await releaseLineupSlot(slot.id);
    if (result.error) {
      showNotification(`Error: ${result.error}`);
    } else {
      showNotification("Slot liberado");
      loadSlots();
    }
  };

  const handleCopy = (slot: LineupSlot) => {
    copyWhatsappConfirmation(slot);
    showNotification("¡Mensaje copiado al portapapeles!");
  };

  const handleSubmit = async (slotId: string, djData: DjData) => {
    const result = await reserveLineupSlot(slotId, djData);
    if (result.error) {
      showNotification(`Error: ${result.error}`);
    } else {
      showNotification("¡Slot reservado!");
      loadSlots();
    }
  };

  return (
    <div className="event-lineup-page">
      {notification && <div className="notification">{notification}</div>}

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
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onRelease={handleRelease}
              onCopy={handleCopy}
            />
          ))}
        </div>
      )}

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