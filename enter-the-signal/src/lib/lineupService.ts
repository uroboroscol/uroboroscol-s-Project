import { supabase, transformRow, transformRows } from "./supabase";

export type SlotStatus = "Disponible" | "Reservado" | "Confirmado" | "Cancelado";

export interface DjData {
  artistName: string;
  realName: string;
  genre: string;
  socialLink?: string;
  musicLink?: string;
  experience?: string;
  whatsappContact?: string;
}

export interface LineupSlot {
  id: string;
  eventId: string;
  eventName?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  slotLabel: number;
  status: SlotStatus;
  djArtistName?: string;
  djRealName?: string;
  whatsapp?: string;
  instagram?: string;
  musicGenre?: string;
  musicLink?: string;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LineupSlotResponse {
  data?: LineupSlot;
  error?: string;
}

export interface LineupSlotsResponse {
  data?: LineupSlot[];
  error?: string;
}

export async function fetchLineupSlots(eventId: string): Promise<LineupSlotsResponse> {
  try {
    const { data, error } = await supabase
      .from("event_lineup_slots")
      .select("*")
      .eq("event_id", eventId)
      .order("event_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      return { error: error.message };
    }

    return { data: transformRows<LineupSlot>(data as Record<string, unknown>[]) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function reserveLineupSlot(slotId: string, djData: DjData): Promise<LineupSlotResponse> {
  try {
    const { data, error } = await supabase
      .from("event_lineup_slots")
      .update({
        status: "Reservado",
        dj_artist_name: djData.artistName,
        dj_real_name: djData.realName,
        music_genre: djData.genre,
        instagram: djData.socialLink,
        music_link: djData.musicLink,
        comment: djData.experience,
        whatsapp: djData.whatsappContact,
      })
      .eq("id", slotId)
      .eq("status", "Disponible")
      .select()
      .single();

if (error) {
      return { error: error.message };
    }

    return { data: transformRow<LineupSlot>(data as Record<string, unknown>) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function confirmLineupSlot(slotId: string): Promise<LineupSlotResponse> {
  try {
    const { data, error } = await supabase
      .from("event_lineup_slots")
      .update({ status: "Confirmado" })
      .eq("id", slotId)
      .select();

    if (error) {
      return { error: error.message };
    }

    console.log("confirmLineupSlot result:", data);
    return { data: data?.[0] ? transformRow<LineupSlot>(data[0] as Record<string, unknown>) : undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function cancelLineupSlot(slotId: string): Promise<LineupSlotResponse> {
  try {
    const { data, error } = await supabase
      .from("event_lineup_slots")
      .update({ status: "Cancelado" })
      .eq("id", slotId)
      .select();

    if (error) {
      return { error: error.message };
    }

    console.log("cancelLineupSlot result:", data);
    return { data: data?.[0] ? transformRow<LineupSlot>(data[0] as Record<string, unknown>) : undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function releaseLineupSlot(slotId: string): Promise<LineupSlotResponse> {
  try {
    const { data, error } = await supabase
      .from("event_lineup_slots")
      .update({
        status: "Disponible",
        dj_artist_name: null,
        dj_real_name: null,
        whatsapp: null,
        instagram: null,
        music_genre: null,
        music_link: null,
        comment: null,
      })
      .eq("id", slotId)
      .select();

    if (error) {
      return { error: error.message };
    }

    console.log("releaseLineupSlot result:", data);
    return { data: data?.[0] ? transformRow<LineupSlot>(data[0] as Record<string, unknown>) : undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function updateDjInfo(slotId: string, djData: Partial<DjData>): Promise<LineupSlotResponse> {
  try {
    const { data, error } = await supabase
      .from("event_lineup_slots")
      .update({
        dj_artist_name: djData.artistName,
        dj_real_name: djData.realName,
        music_genre: djData.genre,
        instagram: djData.socialLink,
        music_link: djData.musicLink,
        comment: djData.experience,
        whatsapp: djData.whatsappContact,
      })
      .eq("id", slotId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: transformRow<LineupSlot>(data as Record<string, unknown>) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export function copyWhatsappConfirmation(slot: LineupSlot): { text: string; waLink: string } {
  const startTime = slot.startTime ? slot.startTime.slice(0, 5) : "hora a convenir";
  const endTime = slot.endTime ? slot.endTime.slice(0, 5) : "hora a convenir";

  const message = `🎧 ¡Hola ${slot.djArtistName || "DJ"}!
Tu espacio en ${slot.eventName || "ENTER THE SIGNAL"} quedó confirmado.
📅 ${slot.eventDate || "Fecha por confirmar"}
⏰ Horario: ${startTime} - ${endTime}
Recuerda llegar mínimo 20 minutos antes.
🎛️ Equipo disponible: Controladora FLX4 + sonido básico
Nos vemos en la señal. 📡`;

  const waLink = slot.whatsapp
    ? `https://wa.me/${slot.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    : "";

  navigator.clipboard.writeText(message);
  return { text: message, waLink };
}