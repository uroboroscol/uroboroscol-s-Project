# Enter The Signal - AGENTS.md

## Proyecto
Vite + React + TypeScript + Supabase. Frontend para gestión de lineup de eventos rave/DJ.

## Comandos
```bash
npm run dev      # http://localhost:5173/
npm run build    # tsc -b && vite build
npm run lint     # eslint .
```

## Entorno
- Node.js/npm en `C:\Program Files\nodejs`
- `.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- **CRÍTICO:** `VITE_SUPABASE_URL` sin `/rest/v1/` al final — el SDK lo añade automáticamente. Si se incluye, causa errores de ruta duplicada.

## Arquitectura
- `src/lib/supabase.ts` — Cliente Supabase + transformadores snake_case→camelCase (`transformRow`, `transformRows`)
- `src/lib/lineupService.ts` — CRUD para `event_lineup_slots`
- `src/components/` — Componentes React (EventInfoCard, LineupStats, LineupSlotCard, DjSignupModal, EditDjModal, EventLineupPage, AdminLineupPage)
- `src/components/components.css` — Estilos dark/rave neón

## Supabase Schema — `event_lineup_slots`
| Columna | Tipo |
|---------|------|
| `id` | uuid PK |
| `event_id` | text FK |
| `event_name`, `event_date` | text, date |
| `start_time`, `end_time` | time (HH:MM:SS) |
| `status` | `Disponible` / `Reservado` / `Confirmado` / `Cancelado` |
| `dj_artist_name`, `dj_real_name` | text |
| `whatsapp`, `instagram` | text |
| `music_genre`, `music_link` | text |
| `comment` | text |
| `created_at`, `updated_at` | timestamp |

## Gotchas importantes
- **Status en español:** Los valores son `Disponible`, `Reservado`, `Confirmado`, `Cancelado` — NO en inglés.
- **Transform snake→camel:** Supabase devuelve `snake_case`. El código convierte automáticamente con `transformRow`/`transformRows`. Los componentes usan `camelCase` (`djArtistName`, `musicGenre`, etc.).
- **Formato horas:** Usar `.slice(0, 5)` para mostrar `startTime`/`endTime` (recortar segundos de `HH:MM:SS`).
- **Admin updates:** `confirmLineupSlot`, `cancelLineupSlot`, `releaseLineupSlot` usan `.select()` sin `.single()` (el RLS de Supabase causa "Cannot coerce to single JSON object" si se usa `.single()`).
- **Vista pública vs admin:** `LineupSlotCard` (público) solo muestra "Reservar" y "Esperando confirmación..." — sin botones de confirmar/cancelar. `AdminLineupPage` tiene todos los botones.
- **Reserva atómica:** `reserveLineupSlot` usa `.eq("status", "Disponible")` para evitar race conditions.

## Rutas
- Usuario: `http://localhost:5173/`
- Admin: `http://localhost:5173/?admin=true`
- Dependencia: `react-router-dom` para `useSearchParams`

## Deploy
- Vercel: `vercel.json` y `public/_redirects` incluidos