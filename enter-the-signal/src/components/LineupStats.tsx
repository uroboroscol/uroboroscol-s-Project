import type { LineupSlot } from "../lib/lineupService";

interface LineupStatsProps {
  slots: LineupSlot[];
}

export function LineupStats({ slots }: LineupStatsProps) {
  const available = slots.filter((s) => s.status === "Disponible").length;
  const reserved = slots.filter((s) => s.status === "Reservado").length;
  const confirmed = slots.filter((s) => s.status === "Confirmado").length;
  const total = slots.length;

  return (
    <div className="lineup-stats">
      <div className="stat-item available">
        <span className="stat-number">{available}</span>
        <span className="stat-label">Disponibles</span>
      </div>
      <div className="stat-item reserved">
        <span className="stat-number">{reserved}</span>
        <span className="stat-label">Reservados</span>
      </div>
      <div className="stat-item confirmed">
        <span className="stat-number">{confirmed}</span>
        <span className="stat-label">Confirmados</span>
      </div>
      <div className="stat-item total">
        <span className="stat-number">{total}</span>
        <span className="stat-label">Total</span>
      </div>
    </div>
  );
}