@AGENTS.md

# AstroLife.cl — Estado del proyecto

Aplicación de astrología PWA en español. Stack: Next.js (App Router) + TypeScript + Tailwind + Supabase + Vercel + Claude Sonnet 4.6.

---

## ✅ Construido y funcionando

### Infraestructura
- Next.js App Router, TypeScript, Tailwind v4
- Supabase: tablas `carta_natal`, `perfil`, `chat_astrid` con RLS
- Deploy en Vercel → dominio `astrolife.cl` activo
- PWA con `manifest.json`, íconos estáticos en `public/icons/`
- Variables de entorno requeridas en Vercel: `ANTHROPIC_API_KEY`, `BREVO_API_KEY` (mayúsculas exactas, case-sensitive), `NEXT_PUBLIC_ADMIN_EMAIL`, `CRON_SECRET`

### Auth
- Magic link sin contraseña (Supabase OTP, implicit flow)
- `/auth/callback` + `/auth/session` para manejo de tokens en hash
- URL Configuration apuntando a `astrolife.cl`
- Menú hamburguesa con estado de sesión y cerrar sesión

### Páginas
- `/` — Landing: tagline, feature cards, CTA inteligente (sesión-aware)
- `/login` — Formulario email + magic link
- `/inicio` — Horóscopo diario IA (Claude Sonnet 4.6), selector signos 2×6
- `/carta-natal` — Abierta sin login: formulario + rueda natal SVG + lista planetas; modal para guardar
- `/astrid` — Chat con Astrid; carta natal desde Supabase (con sesión) o localStorage (sin sesión)
- `/transitos` — Lista estática, sin interacción aún
- `/horoscopo/[signo]` — 12 páginas estáticas SSG con `revalidate = 86400`; horóscopo diario por signo con SEO completo
- `/dashboard` — Panel admin protegido por `NEXT_PUBLIC_ADMIN_EMAIL`; genera 7 posts Facebook semanales con Claude + descarga PNG 1080×1080px por post

### Astrid
- System prompt: tono femenino, cálido, cercano; género neutro hacia el usuario
- Lee carta natal desde Supabase o localStorage según haya sesión
- Protocolo ante temas de salud mental
- Invitación sutil a carta natal cada ~3 mensajes cuando no hay carta
- Sin chips de sugerencia rápida
- Header: logo AstroLife (izquierda) + "Astrid / ● En línea" (centro) + menú (derecha)

### Marketing / Brevo
- `OptinPendienteSync` sincroniza marketing opt-in post-login desde localStorage → `/api/marketing-optin`
- Race condition resuelta: `localStorage.removeItem` se llama ANTES del fetch (no en `.then()`)
- `/api/marketing-optin` upsertea `perfil.marketing_optin` y agrega a lista Brevo #4 con atributo `SIGNO`
- Env var `BREVO_API_KEY` (exactamente así, case-sensitive) — Node.js falla silencioso si el nombre no coincide

### Crons (vercel.json)
- `/api/ping` — cada 3 días a las 09:00 UTC (mantiene serverless caliente)
- `/api/cron/revalidate-horoscopo` — diario a las 03:01 UTC (00:01 Chile); revalida las 12 páginas `/horoscopo/[signo]`; requiere header `Authorization: Bearer <CRON_SECRET>`

### Flujo de usuario
- Nuevo: `/carta-natal` → calcula → modal email → magic link → CartaPendienteSync → `/astrid`
- Recurrente: `/login` → magic link → `/inicio`
- localStorage limpio para usuarios sin sesión (no queda data cruzada)

### UX / Diseño
- Navbar sticky con backdrop-filter blur en todas las páginas
- Logo AstroLife clickeable → `/` en todas las páginas
- Card "Habla con Astrid" con fondo violeta `#7B6FA0` para contraste
- Selector de signos en grilla 2×6 (todos visibles sin scroll)
- Horóscopo: tono elegante latinoamericano, sin modismos
- Íconos PWA: estrella 4 puntas dorada `#C8A96E` sobre fondo `#100A1A`

---

## ❌ Pendiente

### Próximo sprint
- Horóscopo precarga signo solar automático desde carta natal en Supabase
- Términos de uso `/terminos`
- Política de privacidad `/privacidad`
- Página de contacto `/contacto`

### Fase 2
- Tránsitos personalizados (cálculo real con `astronomia`)
- Google AdSense (`public/ads.txt` ya publicado con publisher ID)
- Email de bienvenida post-registro (Resend)
- Historial de conversaciones con Astrid
- Reportes premium descargables

---

## Sistema de diseño (bloqueado — no modificar)

| Token | Valor |
|---|---|
| Fondo app | `#100A1A` |
| Dorado | `#C8A96E` |
| Violeta | `#7B6FA0` |
| Texto | `#F0EDE8` |
| Home bg | `#EDE8E0` |
| Chat bg | `#F5F2ED` |
| Tipografía | Playfair Display (display) + Inter (body) |

---

## Archivos clave

| Archivo | Propósito |
|---|---|
| `src/app/astrid/page.tsx` | Chat con Astrid (client component) |
| `src/app/inicio/page.tsx` | Home con horóscopo |
| `src/app/carta-natal/page.tsx` | Carta natal + modal guardar |
| `src/components/home/SignAndHoroscope.tsx` | Selector signos + horóscopo IA |
| `src/components/ui/NavHeader.tsx` | Header sticky con prop `centerContent` |
| `src/components/ui/UserMenu.tsx` | Menú hamburguesa con auth |
| `src/lib/anthropic/astrid.ts` | System prompt + welcomes de Astrid |
| `src/app/api/astrid/route.ts` | Streaming API de Astrid |
| `src/app/api/horoscopo/route.ts` | Horóscopo diario por signo |
| `src/lib/supabase/actions.ts` | `guardarCartaNatal()` server action |
| `src/components/inicio/CartaPendienteSync.tsx` | Sincroniza carta post-login |
| `src/components/inicio/OptinPendienteSync.tsx` | Sincroniza marketing opt-in post-login (race condition resuelta) |
| `src/app/api/marketing-optin/route.ts` | Upsert `perfil.marketing_optin` + Brevo lista #4 |
| `src/app/api/content/facebook/route.ts` | Genera 7 posts semanales con símbolo zodiacal via Claude |
| `src/app/api/cron/revalidate-horoscopo/route.ts` | Revalida 12 páginas de horóscopo (cron diario) |
| `src/app/dashboard/page.tsx` | Página admin protegida por email |
| `src/components/dashboard/AdminContent.tsx` | 7 cards con texto + descarga PNG html2canvas |
| `src/app/horoscopo/[signo]/page.tsx` | Páginas SSG de horóscopo por signo |
| `vercel.json` | Configuración de crons (ping + revalidate-horoscopo) |
| `public/ads.txt` | Autorización Google AdSense |
| `middleware.ts` | Protege solo `/login` (redirige a `/inicio` si hay sesión) |
| `public/manifest.json` | PWA manifest |
| `public/icons/` | Íconos PNG estáticos generados con sharp |
| `scripts/generate-icons.mjs` | Script para regenerar íconos |
