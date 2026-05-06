import { useState, type FormEvent } from "react";
import type { DjData, LineupSlot } from "../lib/lineupService";

const GENRES = [
  "House",
  "Tech House",
  "Techno",
  "Hard Techno",
  "Trance",
  "Psytrance",
  "Acid",
  "Minimal",
  "Reggaetón",
  "Electrónica variada",
  "Experimental",
  "Otro",
];

interface DjSignupModalProps {
  slot: LineupSlot;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (slotId: string, djData: DjData) => void;
}

export function DjSignupModal({ slot, isOpen, onClose, onSubmit }: DjSignupModalProps) {
  const [artistName, setArtistName] = useState("");
  const [genre, setGenre] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [experience, setExperience] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!artistName.trim() || !genre) return;

    onSubmit(slot.id, {
      artistName: artistName.trim(),
      genre,
      socialLink: socialLink.trim() || undefined,
      experience: experience.trim() || undefined,
    });

    setArtistName("");
    setGenre("");
    setSocialLink("");
    setExperience("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Inscribirse - Slot #{slot.position}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="artistName">Nombre artístico *</label>
            <input
              id="artistName"
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Tu nombre artístico"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Género principal *</label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            >
              <option value="">Selecciona un género</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="socialLink">Link redes/social</label>
            <input
              id="socialLink"
              type="url"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              placeholder="Instagram, SoundCloud, Mixcloud, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experiencia / Descripción</label>
            <textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Cuéntanos sobre ti o tu estilo..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-reserve">
              Reservar Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}