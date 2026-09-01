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
- Variables de entorno configuradas en Vercel

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

### Astrid
- System prompt: tono femenino, cálido, cercano; género neutro hacia el usuario
- Lee carta natal desde Supabase o localStorage según haya sesión
- Protocolo ante temas de salud mental
- Invitación sutil a carta natal cada ~3 mensajes cuando no hay carta
- Sin chips de sugerencia rápida
- Header: logo AstroLife (izquierda) + "Astrid / ● En línea" (centro) + menú (derecha)

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
- Google AdSense
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
| `middleware.ts` | Protege solo `/login` (redirige a `/inicio` si hay sesión) |
| `public/manifest.json` | PWA manifest |
| `public/icons/` | Íconos PNG estáticos generados con sharp |
| `scripts/generate-icons.mjs` | Script para regenerar íconos |
