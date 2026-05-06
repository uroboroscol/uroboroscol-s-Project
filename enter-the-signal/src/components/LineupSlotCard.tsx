import type { LineupSlot } from "../lib/lineupService";

interface LineupSlotCardProps {
  slot: LineupSlot;
  onReserve: (slot: LineupSlot) => void;
  onCopy: (slot: LineupSlot) => void;
}

export function LineupSlotCard({
  slot,
  onReserve,
  onCopy,
}: LineupSlotCardProps) {
  const statusStyles: Record<LineupSlot["status"], string> = {
    Disponible: "status-available",
    Reservado: "status-reserved",
    Confirmado: "status-confirmed",
    Cancelado: "status-cancelled",
  };

  return (
    <div className={`slot-card ${statusStyles[slot.status]}`}>
      <div className="slot-header">
        <span className="slot-position">
          {slot.startTime ? slot.startTime.slice(0, 5) : "??:??"} - {slot.endTime ? slot.endTime.slice(0, 5) : "??:??"}
        </span>
        <span className={`slot-status ${statusStyles[slot.status]}`}>
          {slot.status}
        </span>
      </div>

      {slot.djArtistName ? (
        <div className="slot-artist">
          <span className="artist-name">{slot.djArtistName}</span>
          {slot.musicGenre && <span className="artist-genre">{slot.musicGenre}</span>}
        </div>
      ) : (
        <div className="slot-artist">
          <span className="artist-name empty">[ --- ]</span>
        </div>
      )}

      {slot.instagram && (
        <div className="slot-social">
          <span className="social-link">{slot.instagram}</span>
        </div>
      )}

      {slot.comment && (
        <div className="slot-experience">
          <span className="experience-label">Comentario:</span>
          <span className="experience-text">{slot.comment}</span>
        </div>
      )}

      <div className="slot-actions">
        {slot.status === "Disponible" && (
          <button className="btn btn-reserve" onClick={() => onReserve(slot)}>
            Reservar
          </button>
        )}

        {slot.status === "Reservado" && (
          <span className="waiting-msg">Esperando confirmación del organizador...</span>
        )}

        {slot.status === "Confirmado" && (
          <button className="btn btn-copy" onClick={() => onCopy(slot)}>
            <span>📱</span> Copiar WA
          </button>
        )}
      </div>
    </div>
  );
}