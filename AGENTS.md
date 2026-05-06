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
- `src/lib/lineupService.ts` - CRUD para lineup_slots (fetch, reserve, confirm, cancel, release)
- `src/components/` - UI (EventInfoCard, LineupStats, LineupSlotCard, DjSignupModal, EventLineupPage)
- `src/components/components.css` - Estilos dark/rave con neón

## Supabase Schema (esperado)
Tabla `lineup_slots`:
- `id`, `eventId`, `position`, `status` (available|reserved|confirmed|cancelled)
- `artistName`, `genre`, `socialLink`, `experience`
- `reservedAt`, `confirmedAt`, `createdAt`