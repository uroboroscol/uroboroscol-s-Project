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
      <h1 className="event-name">{eventName}</h1>
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