import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { TimeTable } from "./TimeTable";
import type { LineupSlot } from "../lib/lineupService";

interface TimeTableSidebarProps {
  eventId: string;
  eventName: string;
  slots?: LineupSlot[];
  loading?: boolean;
}

function restoreStyles(el: HTMLDivElement) {
  el.style.position = "";
  el.style.top = "";
  el.style.left = "";
  el.style.zIndex = "";
  el.style.opacity = "";
  el.style.pointerEvents = "";
}

export function TimeTableSidebar({ eventId, eventName, slots, loading }: TimeTableSidebarProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!exportRef.current) return;
    setDownloading(true);

    const el = exportRef.current;

    try {
      el.style.position = "fixed";
      el.style.top = "0";
      el.style.left = "0";
      el.style.zIndex = "-1";
      el.style.opacity = "0.01";
      el.style.pointerEvents = "none";

      await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 500));

      const rect = el.getBoundingClientRect();
      console.log("Export dimensions:", rect.width, "x", rect.height);

      if (rect.width === 0 || rect.height === 0) {
        throw new Error("Export element has zero dimensions");
      }

      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0a0a0c",
        cacheBust: true,
        style: {
          opacity: "1",
          position: "relative",
          top: "0",
          left: "0",
        },
      });

      restoreStyles(el);

      const link = document.createElement("a");
      link.download = `timetable-${eventName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error al generar la imagen:", err);
      restoreStyles(el);
    } finally {
      setDownloading(false);
    }
  }, [eventName]);

  return (
    <div className="timetable-sidebar">
      <button
        className="timetable-download-btn"
        onClick={handleDownload}
        disabled={downloading}
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
      >
        <svg
          className="download-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {downloading ? "Generando..." : buttonHover ? "Descargar PNG" : "Descargar"}
      </button>

      <div className="timetable-sticky">
        <TimeTable eventId={eventId} eventName={eventName} slots={slots} loading={loading} />
      </div>

      <div className="timetable-export-hidden" ref={exportRef} aria-hidden="true">
        <TimeTable eventId={eventId} eventName={eventName} exportMode slots={slots} loading={loading} />
      </div>
    </div>
  );
}