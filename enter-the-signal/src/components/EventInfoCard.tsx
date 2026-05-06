import type { LineupSlot } from "../lib/lineupService";

interface EventInfoCardProps {
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventEquipment?: string;
  slots?: LineupSlot[];
}

export function EventInfoCard({
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  eventEquipment,
}: EventInfoCardProps) {
  return (
    <div className="event-info-card">
      <div className="event-header-top">
        <h1 className="event-name">{eventName}</h1>
        <button className="btn btn-share" onClick={() => {
          navigator.share?.({ title: eventName, url: window.location.href })
            .catch(() => navigator.clipboard.writeText(window.location.href));
        }}>
          <span>🔗</span> Compartir Señal
        </button>
      </div>
      <div className="event-details">
        <div className="detail-item">
          <span className="detail-icon">📅</span>
          <span>{eventDate}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">⏰</span>
          <span>{eventTime}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <span>{eventLocation}</span>
        </div>
        {eventEquipment && (
          <div className="detail-item">
            <span className="detail-icon">🎛️</span>
            <span>{eventEquipment}</span>
          </div>
        )}
      </div>
    </div>
  );
}