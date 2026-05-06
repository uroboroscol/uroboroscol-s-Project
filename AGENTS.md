# Enter The Signal - AGENTS.md

## Proyecto
Vite + React + TypeScript + Supabase (frontend para gestión de lineup de eventos rave/DJ)

## Comandos
```bash
# Development (corre en http://localhost:5173/)
npm run dev

# Build (TypeScript + Vite)
npm run build

# Lint
npm run lint
```

## Entorno
- Node.js/npm instalado en `C:\Program Files\nodejs`
- Variables requeridas en `.env`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## Estructura
- `src/lib/supabase.ts` - Cliente Supabase
- `src/lib/lineupService.ts` - CRUD para event_lineup_slots (fetch, reserve, confirm, cancel, release)
- `src/components/` - UI (EventInfoCard, LineupStats, LineupSlotCard, DjSignupModal, EditDjModal, EventLineupPage, AdminLineupPage)
- `src/components/components.css` - Estilos dark/rave con neón

## Supabase Schema
Tabla `event_lineup_slots`:
- `id` (uuid), `event_id` (text FK → events.id)
- `slot_label` (int), `status` ('Disponible'|'Reservado'|'Confirmado'|'Cancelado')
- `dj_artist_name`, `dj_real_name`, `whatsapp`
- `instagram`, `music_genre`, `music_link`, `comment`
- `start_time`, `end_time`, `event_name`, `event_date`
- `created_at`, `updated_at`

## Rutas
- Usuario: `/?` o `/?admin=false`
- Admin: `/?admin=true`