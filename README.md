# Reto Lily · Landing premium rápida

Base profesional creada a partir de la primera landing de Stitch, convertida en proyecto Next.js listo para GitHub/Vercel.

## Incluye

- Landing premium ES/EN.
- Fondo sutil de “patrón invisible” hecho por CSS, sin depender de Stitch.
- Vídeo central con desbloqueo simulado por tiempo.
- Cuenta atrás.
- Bloque de donación Stripe/SumUp.
- Formulario conectado a API.
- Supabase para leads.
- Email de confirmación y email definitivo con Resend.
- Textos centralizados en `config/challenge.ts`.

## Rutas

- Español: `/es/reto-dinero`
- Inglés: `/en/money-challenge`
- Confirmación: `/es/confirmar?token=...` o `/en/confirmar?token=...`

## Instalación local

```bash
npm install
npm run dev
```

## Variables de entorno

Copia `.env.example` a `.env.local` y rellena:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
EMAIL_FROM="Reto Lily <noreply@tudominio.com>"
ADMIN_EMAIL="tu@email.com"
```

## Supabase

Ejecuta el SQL de:

```txt
supabase/schema.sql
```

## Dónde cambiar textos, vídeos, precios y enlaces

Todo está centralizado en:

```txt
config/challenge.ts
```

Ahí puedes cambiar:

- textos ES/EN;
- URL del vídeo español e inglés;
- fecha de cuenta atrás;
- enlaces Stripe/SumUp;
- WhatsApp;
- testimonios;
- importes.

## Notas importantes

- El ZIP original de Stitch no era un proyecto desplegable: traía `code.html`, `screen.png` y `DESIGN.md`.
- Esta versión ya está preparada como proyecto Next.js.
- La parte de pago está planteada con Payment Links para ir rápido. Los webhooks de Stripe quedarían para fase 2.
