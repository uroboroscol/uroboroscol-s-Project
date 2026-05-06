import { supabase } from "./supabase";

export interface DjData {
  artistName: string;
  genre: string;
  socialLink?: string;
  experience?: string;
}

export interface LineupSlot {
  id: string;
  eventId: string;
  position: number;
  status: "available" | "reserved" | "confirmed" | "cancelled";
  artistName?: string;
  genre?: string;
  socialLink?: string;
  experience?: string;
  reservedAt?: string;
  confirmedAt?: string;
  createdAt: string;
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
      .from("lineup_slots")
      .select("*")
      .eq("eventId", eventId)
      .order("position", { ascending: true });

    if (error) {
      return { error: error.message };
    }

    return { data: data as LineupSlot[] };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function reserveLineupSlot(slotId: string, djData: DjData): Promise<LineupSlotResponse> {
  try {
    const { data, error } = await supabase
      .from("lineup_slots")
      .update({
        status: "reserved",
        artistName: djData.artistName,
        genre: djData.genre,
        socialLink: djData.socialLink,
        experience: djData.experience,
        reservedAt: new Date().toISOString(),
      })
      .eq("id", slotId)
      .eq("status", "available")
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as LineupSlot };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function confirmLineupSlot(slotId: string): Promise<LineupSlotResponse> {
  try {
    const { data, error } = await supabase
      .from("lineup_slots")
      .update({
        status: "confirmed",
        confirmedAt: new Date().toISOString(),
      })
      .eq("id", slotId)
      .eq("status", "reserved")
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as LineupSlot };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function cancelLineupSlot(slotId: string): Promise<LineupSlotResponse> {
  try {
    const { data, error } = await supabase
      .from("lineup_slots")
      .update({
        status: "cancelled",
      })
      .eq("id", slotId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as LineupSlot };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function releaseLineupSlot(slotId: string): Promise<LineupSlotResponse> {
  try {
    const { data, error } = await supabase
      .from("lineup_slots")
      .update({
        status: "available",
        artistName: null,
        genre: null,
        socialLink: null,
        experience: null,
        reservedAt: null,
        confirmedAt: null,
      })
      .eq("id", slotId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as LineupSlot };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function updateDjInfo(slotId: string, djData: Partial<DjData>): Promise<LineupSlotResponse> {
  try {
    const { data, error } = await supabase
      .from("lineup_slots")
      .update({
        artistName: djData.artistName,
        genre: djData.genre,
        socialLink: djData.socialLink,
        experience: djData.experience,
      })
      .eq("id", slotId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as LineupSlot };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export function copyWhatsappConfirmation(slot: LineupSlot): string {
  const message = `¡Slot confirmado! 🎧
📍 Evento: ${slot.eventId}
🎤 DJ: ${slot.artistName}
🎵 Género: ${slot.genre}
📱 Social: ${slot.socialLink || "No proporcionado"}
📋 Experiencia: ${slot.experience || "No proporcionada"}
🔢 Posición: ${slot.position}
📅 Confirmado: ${slot.confirmedAt ? new Date(slot.confirmedAt).toLocaleDateString("es-ES") : "N/A"}`;

  navigator.clipboard.writeText(message);
  return message;
}