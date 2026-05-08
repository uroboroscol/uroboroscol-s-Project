import { useState, useEffect } from "react";
import type { LineupSlot } from "../lib/lineupService";
import { fetchLineupSlots } from "../lib/lineupService";
import "./timetable.css";

interface TimeTableProps {
  eventId: string;
  eventName: string;
  exportMode?: boolean;
  slots?: LineupSlot[];
  loading?: boolean;
}

export function TimeTable({ eventId, eventName, exportMode = false, slots: externalSlots, loading: externalLoading }: TimeTableProps) {
  const [internalSlots, setInternalSlots] = useState<LineupSlot[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    if (externalSlots !== undefined) return;
    const load = async () => {
      setInternalLoading(true);
      const result = await fetchLineupSlots(eventId);
      if (result.data) setInternalSlots(result.data);
      setInternalLoading(false);
    };
    load();
  }, [eventId, externalSlots]);

  const slots = externalSlots ?? internalSlots;
  const loading = externalLoading ?? internalLoading;

  const visibleSlots = slots.filter(
    (s) => s.status === "Confirmado" || s.status === "Disponible"
  );

  return (
    <div className={`timetable-wrapper${exportMode ? " timetable-export" : ""}`}>
      <div className={`timetable-story${exportMode ? " story-export" : ""}`}>
        <div className="timetable-bg" />
        <div className="timetable-pcb" />

        <div className="timetable-content">
          <div className="ouroboros-logo">
            <svg viewBox="0 0 120 120" className="ouroboros-svg">
              <defs>
                <linearGradient id="ouro-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#bf00ff" />
                  <stop offset="100%" stopColor="#00d4ff" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M60 12 A48 48 0 1 1 12 60"
                fill="none"
                stroke="url(#ouro-grad)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
              />
              <path
                d="M14 56 L12 42 L26 48"
                fill="none"
                stroke="url(#ouro-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
              <circle cx="12" cy="60" r="2.5" fill="#bf00ff" filter="url(#glow)" />
              <circle cx="60" cy="12" r="2" fill="#00d4ff" filter="url(#glow)" />
            </svg>
          </div>

          <h1 className="timetable-title" data-text={eventName}>
            {eventName}
          </h1>
          <h2 className="timetable-subtitle" data-text="TIME TABLE">
            TIME TABLE
          </h2>

          {loading && <div className="timetable-loading">CARGANDO...</div>}

          {!loading && (
            <div className="timetable-slots">
              {visibleSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`timetable-slot ${
                    slot.status === "Confirmado" ? "slot-confirmed" : "slot-available"
                  }`}
                >
                  <div className="slot-time">
                    <span className="time-icon">
                      {slot.status === "Confirmado" ? "◆" : "◇"}
                    </span>
                    <span className="time-range">
                      {slot.startTime?.slice(0, 5)} - {slot.endTime?.slice(0, 5)}
                    </span>
                  </div>

                  <div className="slot-info">
                    {slot.status === "Confirmado" ? (
                      <span className="slot-dj">{slot.djArtistName}</span>
                    ) : (
                      <span className="slot-disponible">DISPONIBLE</span>
                    )}
                    {slot.status === "Confirmado" && slot.musicGenre && (
                      <span className="slot-genre">{slot.musicGenre}</span>
                    )}
                    {slot.comment && (
                      <span className="slot-comment">{slot.comment}</span>
                    )}
                  </div>
                </div>
              ))}
              {visibleSlots.length === 0 && (
                <div className="timetable-empty">NO HAY HORARIOS DEFINIDOS</div>
              )}
            </div>
          )}

          <div className="timetable-footer">
            <span className="footer-dot" />
            <span className="footer-text">ENTER THE SIGNAL</span>
            <span className="footer-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}