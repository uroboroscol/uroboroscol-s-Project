import type { LineupSlot } from "../lib/lineupService";

interface LineupSlotCardProps {
  slot: LineupSlot;
  onReserve: (slot: LineupSlot) => void;
  onConfirm: (slot: LineupSlot) => void;
  onCancel: (slot: LineupSlot) => void;
  onRelease: (slot: LineupSlot) => void;
  onCopy: (slot: LineupSlot) => void;
}

export function LineupSlotCard({
  slot,
  onReserve,
  onConfirm,
  onCancel,
  onRelease,
  onCopy,
}: LineupSlotCardProps) {
  const statusStyles: Record<LineupSlot["status"], string> = {
    available: "status-available",
    reserved: "status-reserved",
    confirmed: "status-confirmed",
    cancelled: "status-cancelled",
  };

  const statusLabels: Record<LineupSlot["status"], string> = {
    available: "Disponible",
    reserved: "Reservado",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
  };

  return (
    <div className={`slot-card ${statusStyles[slot.status]}`}>
      <div className="slot-header">
        <span className="slot-position">#{slot.position}</span>
        <span className={`slot-status ${statusStyles[slot.status]}`}>
          {statusLabels[slot.status]}
        </span>
      </div>

      {slot.artistName && (
        <div className="slot-artist">
          <span className="artist-name">{slot.artistName}</span>
          {slot.genre && <span className="artist-genre">{slot.genre}</span>}
        </div>
      )}

      {slot.socialLink && (
        <div className="slot-social">
          <span className="social-link">{slot.socialLink}</span>
        </div>
      )}

      {slot.experience && (
        <div className="slot-experience">
          <span className="experience-label">Experiencia:</span>
          <span className="experience-text">{slot.experience}</span>
        </div>
      )}

      <div className="slot-actions">
        {slot.status === "available" && (
          <button className="btn btn-reserve" onClick={() => onReserve(slot)}>
            Reservar
          </button>
        )}

        {slot.status === "reserved" && (
          <>
            <button className="btn btn-confirm" onClick={() => onConfirm(slot)}>
              Confirmar
            </button>
            <button className="btn btn-cancel" onClick={() => onCancel(slot)}>
              Cancelar
            </button>
          </>
        )}

        {slot.status === "confirmed" && (
          <>
            <button className="btn btn-copy" onClick={() => onCopy(slot)}>
              Copiar WA
            </button>
            <button className="btn btn-release" onClick={() => onRelease(slot)}>
              Liberar
            </button>
          </>
        )}
      </div>
    </div>
  );
}