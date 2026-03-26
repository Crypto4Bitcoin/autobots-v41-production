-- Telegram Bridge Tables
create table if not exists telegram_users (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint not null unique,
  username text,
  first_name text,
  last_active timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists telegram_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references telegram_users(id) on delete cascade unique,
  current_state text not null default 'active',
  updated_at timestamptz not null default now()
);

create table if not exists telegram_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references telegram_users(id) on delete set null,
  session_id uuid references telegram_sessions(id) on delete set null,
  event_type text not null,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists job_runs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null,
  status text not null check (status in ('queued', 'running', 'complete', 'failed')) default 'queued',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
