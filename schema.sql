create extension if not exists "pgcrypto";

create table if not exists public.reto_lily_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  locale text not null check (locale in ('es', 'en')),
  challenge_slug text not null,
  full_name text not null,
  email text not null,
  phone text,
  city text,
  country text,
  donation_amount text,
  payment_method text check (payment_method in ('stripe', 'sumup')),
  status text not null default 'pending_confirmation' check (status in ('started', 'video_completed', 'pending_confirmation', 'confirmed', 'payment_pending', 'paid', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  confirmation_token text unique,
  confirmed_at timestamptz,
  video_completed boolean not null default false,
  privacy_accepted boolean not null default false,
  source text,
  notes text
);

create index if not exists reto_lily_leads_email_idx on public.reto_lily_leads (email);
create index if not exists reto_lily_leads_status_idx on public.reto_lily_leads (status);
create index if not exists reto_lily_leads_created_at_idx on public.reto_lily_leads (created_at desc);

alter table public.reto_lily_leads enable row level security;

-- En esta versión rápida, los inserts se hacen desde API server-side con SERVICE_ROLE.
-- No abrimos políticas públicas de escritura desde cliente.
