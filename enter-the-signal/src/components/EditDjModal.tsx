import { useState, type FormEvent } from "react";
import type { LineupSlot, DjData } from "../lib/lineupService";
import { CustomSelect } from "./CustomSelect";

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

interface EditDjModalProps {
  slot: LineupSlot;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (slotId: string, djData: Partial<DjData>) => void;
}

export function EditDjModal({ slot, isOpen, onClose, onSubmit }: EditDjModalProps) {
  const [artistName, setArtistName] = useState(slot.djArtistName || "");
  const [realName, setRealName] = useState(slot.djRealName || "");
  const [whatsappContact, setWhatsappContact] = useState(slot.whatsapp || "");
  const [genre, setGenre] = useState(slot.musicGenre || "");
  const [socialLink, setSocialLink] = useState(slot.instagram || "");
  const [musicLink, setMusicLink] = useState(slot.musicLink || "");
  const [experience, setExperience] = useState(slot.comment || "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!artistName.trim() || !realName.trim() || !whatsappContact.trim() || !genre) return;

    onSubmit(slot.id, {
      artistName: artistName.trim(),
      realName: realName.trim(),
      whatsappContact: whatsappContact.trim(),
      genre,
      socialLink: socialLink.trim() || undefined,
      musicLink: musicLink.trim() || undefined,
      experience: experience.trim() || undefined,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar DJ - {slot.startTime ? slot.startTime.slice(0, 5) : "??"} - {slot.endTime ? slot.endTime.slice(0, 5) : "??"}</h2>
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
            <label htmlFor="realName">Nombre real *</label>
            <input
              id="realName"
              type="text"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              placeholder="Tu nombre real"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsappContact">WhatsApp *</label>
            <input
              id="whatsappContact"
              type="tel"
              value={whatsappContact}
              onChange={(e) => setWhatsappContact(e.target.value)}
              placeholder="+34 612 345 678"
              required
            />
          </div>

          <CustomSelect
            label="Género musical"
            value={genre}
            options={GENRES}
            onChange={setGenre}
            placeholder="Selecciona un género"
            required
          />

          <div className="form-group">
            <label htmlFor="socialLink">Instagram</label>
            <input
              id="socialLink"
              type="url"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              placeholder="Instagram URL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="musicLink">Link SoundCloud/YouTube/Mix</label>
            <input
              id="musicLink"
              type="url"
              value={musicLink}
              onChange={(e) => setMusicLink(e.target.value)}
              placeholder="SoundCloud, YouTube, Mixcloud, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Comentario adicional</label>
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
            <button type="submit" className="btn btn-confirm">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}