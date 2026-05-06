import { useState, useEffect } from "react";
import type { LineupSlot } from "../lib/lineupService";
import {
  fetchLineupSlots,
  confirmLineupSlot,
  cancelLineupSlot,
  releaseLineupSlot,
  updateDjInfo,
  copyWhatsappConfirmation,
} from "../lib/lineupService";
import { EditDjModal } from "./EditDjModal";

interface AdminSlotCardProps {
  slot: LineupSlot;
  onConfirm: (slot: LineupSlot) => void;
  onCancel: (slot: LineupSlot) => void;
  onRelease: (slot: LineupSlot) => void;
  onEdit: (slot: LineupSlot) => void;
  onCopy: (slot: LineupSlot) => void;
}

function AdminSlotCard({
  slot,
  onConfirm,
  onCancel,
  onRelease,
  onEdit,
  onCopy,
}: AdminSlotCardProps) {
  const statusStyles: Record<LineupSlot["status"], string> = {
    Disponible: "status-available",
    Reservado: "status-reserved",
    Confirmado: "status-confirmed",
    Cancelado: "status-cancelled",
  };

  return (
    <div className={`admin-slot-card ${statusStyles[slot.status]}`}>
      <div className="slot-header">
        <span className="slot-position">
        {slot.startTime ? slot.startTime.slice(0, 5) : "??"} - {slot.endTime ? slot.endTime.slice(0, 5) : "??"}
      </span>
        <span className={`slot-status ${statusStyles[slot.status]}`}>
          {slot.status}
        </span>
      </div>

      {slot.djArtistName ? (
        <div className="slot-details">
          <div className="detail-row">
            <span className="detail-label">DJ</span>
            <span className="detail-value">{slot.djArtistName}</span>
          </div>
          {slot.djRealName && (
            <div className="detail-row">
              <span className="detail-label">Nombre real</span>
              <span className="detail-value">{slot.djRealName}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">Género</span>
            <span className="detail-value genre">{slot.musicGenre || "-"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Instagram</span>
            <a
              href={slot.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-value link"
            >
              {slot.instagram || "-"}
            </a>
          </div>
          {slot.musicLink && (
            <div className="detail-row">
              <span className="detail-label">Música</span>
              <a
                href={slot.musicLink}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-value link"
              >
                {slot.musicLink}
              </a>
            </div>
          )}
          {slot.comment && (
            <div className="detail-row">
              <span className="detail-label">Comentario</span>
              <span className="detail-value">{slot.comment}</span>
            </div>
          )}
          {slot.whatsapp && (
            <div className="detail-row">
              <span className="detail-label">WhatsApp</span>
              <a
                href={`https://wa.me/${slot.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-value link wa"
              >
                {slot.whatsapp}
              </a>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">Horario</span>
            <span className="detail-value">
              {slot.startTime ? slot.startTime.slice(0, 5) : "-"} - {slot.endTime ? slot.endTime.slice(0, 5) : "-"}
            </span>
          </div>
        </div>
      ) : (
        <div className="slot-empty">Sin inscribir</div>
      )}

      <div className="slot-actions">
        {(slot.status === "Reservado" || slot.status === "Confirmado") && (
          <button className="btn btn-edit" onClick={() => onEdit(slot)}>
            Editar
          </button>
        )}
        {slot.status === "Reservado" && (
          <button className="btn btn-confirm" onClick={() => onConfirm(slot)}>
            Confirmar
          </button>
        )}
        {slot.status === "Reservado" && (
          <button className="btn btn-cancel" onClick={() => onCancel(slot)}>
            Cancelar
          </button>
        )}
        {slot.status === "Confirmado" && (
          <button className="btn btn-copy" onClick={() => onCopy(slot)}>
            Copiar WA
          </button>
        )}
        {(slot.status === "Confirmado" || slot.status === "Cancelado") && (
          <button className="btn btn-release" onClick={() => onRelease(slot)}>
            Liberar
          </button>
        )}
      </div>
    </div>
  );
}

interface AdminLineupPageProps {
  eventId: string;
  eventName: string;
}

export function AdminLineupPage({ eventId, eventName }: AdminLineupPageProps) {
  const [slots, setSlots] = useState<LineupSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<LineupSlot | null>(null);

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

  const handleConfirm = async (slot: LineupSlot) => {
    const result = await confirmLineupSlot(slot.id);
    if (result.error) {
      showNotification(`Error: ${result.error}`);
    } else {
      showNotification("Slot confirmado");
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
    const { waLink } = copyWhatsappConfirmation(slot);
    if (waLink) {
      window.open(waLink, "_blank");
      showNotification("¡Mensaje copiado y WhatsApp abierto!");
    } else {
      showNotification("Mensaje copiado al portapapeles");
    }
  };

  const handleEdit = (slot: LineupSlot) => {
    setSelectedSlot(slot);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (slotId: string, djData: Parameters<typeof updateDjInfo>[1]) => {
    const result = await updateDjInfo(slotId, djData);
    if (result.error) {
      showNotification(`Error: ${result.error}`);
    } else {
      showNotification("Datos actualizados");
      loadSlots();
    }
  };

  const available = slots.filter((s) => s.status === "Disponible").length;
  const reserved = slots.filter((s) => s.status === "Reservado").length;
  const confirmed = slots.filter((s) => s.status === "Confirmado").length;
  const total = slots.length;

  return (
    <div className="admin-lineup-page">
      {notification && <div className="notification">{notification}</div>}

      <div className="admin-header">
        <h1>Panel Admin: {eventName}</h1>
        <div className="admin-stats">
          <span className="stat available">{available} disponibles</span>
          <span className="stat reserved">{reserved} reservados</span>
          <span className="stat confirmed">{confirmed} confirmados</span>
          <span className="stat total">{total} total</span>
        </div>
      </div>

      {loading && <div className="loading">Cargando...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="admin-slots-grid">
          {slots.map((slot) => (
            <AdminSlotCard
              key={slot.id}
              slot={slot}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onRelease={handleRelease}
              onEdit={handleEdit}
              onCopy={handleCopy}
            />
          ))}
        </div>
      )}

      {selectedSlot && (
        <EditDjModal
          slot={selectedSlot}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedSlot(null);
          }}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}