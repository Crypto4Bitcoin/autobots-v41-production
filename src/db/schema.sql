create extension if not exists pgcrypto;

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  billing_status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text unique,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid not null references app_users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'operator', 'viewer')),
  unique (tenant_id, user_id)
);

create table if not exists divisions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  group_name text not null default 'core',
  grid_depth int not null default 3,
  grid_signature text not null default '9x9x9',
  architecture_note text,
  created_at timestamptz not null default now()
);

create table if not exists source_records (
  id uuid primary key default gen_random_uuid(),
  division_slug text not null references divisions(slug) on delete cascade,
  label text not null,
  source_type text not null,
  reference_url text,
  source_count int not null default 1,
  confidence_score numeric(8,2) not null default 0,
  stale_after_hours int not null default 24,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists entities (
  id uuid primary key default gen_random_uuid(),
  division_slug text not null references divisions(slug) on delete cascade,
  name text not null,
  entity_type text not null,
  status text not null check (status in ('active', 'draft', 'archived')) default 'draft',
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists metric_cards (
  id uuid primary key default gen_random_uuid(),
  division_slug text not null references divisions(slug) on delete cascade,
  title text not null,
  value_display text not null,
  delta_display text not null,
  direction text not null check (direction in ('up', 'down', 'flat')),
  verifier_state text not null check (verifier_state in ('verified', 'provisional', 'synthetic')),
  sort_order int not null default 0
);

create table if not exists metric_series (
  id uuid primary key default gen_random_uuid(),
  metric_card_id uuid not null references metric_cards(id) on delete cascade,
  year text not null,
  value numeric(10,2) not null
);

create table if not exists watch_scores (
  id uuid primary key default gen_random_uuid(),
  division_slug text not null references divisions(slug) on delete cascade,
  name text not null,
  category text not null,
  score numeric(8,2) not null,
  change_value numeric(8,2) not null,
  verifier_state text not null check (verifier_state in ('verified', 'provisional', 'synthetic'))
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  division_slug text not null references divisions(slug) on delete cascade,
  event_date date not null,
  title text not null,
  event_type text not null,
  impact_level text not null,
  source_label text not null,
  entity_id uuid references entities(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists relay_links (
  id uuid primary key default gen_random_uuid(),
  from_division_slug text not null references divisions(slug) on delete cascade,
  to_division_slug text not null references divisions(slug) on delete cascade,
  relay_lane text not null,
  status text not null check (status in ('live', 'queued', 'review', 'approved', 'rejected')),
  payload_summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists integrity_issues (
  id uuid primary key default gen_random_uuid(),
  division_slug text not null references divisions(slug) on delete cascade,
  issue_type text not null check (issue_type in ('conflict', 'edge_case', 'drift', 'stale', 'relay', 'verifier')),
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  description text not null,
  affected_modules text[] not null default '{}',
  status text not null check (status in ('open', 'watching', 'resolved')) default 'open',
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists simulation_runs (
  id uuid primary key default gen_random_uuid(),
  division_slug text not null references divisions(slug) on delete cascade,
  name text not null,
  outcome text not null,
  result text not null check (result in ('pass', 'warn', 'fail')),
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists action_logs (
  id uuid primary key default gen_random_uuid(),
  division_slug text not null,
  intent text not null,
  target_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists verifier_queue (
  id uuid primary key default gen_random_uuid(),
  division_slug text not null references divisions(slug) on delete cascade,
  entity_kind text not null,
  entity_id text not null,
  source_record_id uuid references source_records(id) on delete set null,
  status text not null check (status in ('queued', 'running', 'passed', 'failed')) default 'queued',
  contradiction_count int not null default 0,
  stale_hours int not null default 0,
  confidence_score numeric(8,2) not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists automation_jobs (
  id uuid primary key default gen_random_uuid(),
  division_slug text not null references divisions(slug) on delete cascade,
  job_type text not null,
  status text not null check (status in ('queued', 'running', 'complete', 'failed')) default 'queued',
  payload jsonb not null default '{}'::jsonb,
  run_after timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists billing_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  monthly_price_cents int not null default 0,
  agent_limit int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists tenant_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  billing_plan_id uuid not null references billing_plans(id),
  status text not null default 'draft',
  external_customer_id text,
  external_subscription_id text,
  created_at timestamptz not null default now()
);

create or replace view metric_cards_view as
select
  mc.id,
  mc.division_slug,
  mc.title,
  mc.value_display,
  mc.delta_display,
  mc.direction,
  mc.verifier_state,
  mc.sort_order,
  coalesce(
    json_agg(json_build_object('year', ms.year, 'value', ms.value) order by ms.year)
      filter (where ms.id is not null),
    '[]'::json
  ) as series_points
from metric_cards mc
left join metric_series ms on ms.metric_card_id = mc.id
group by mc.id;

create or replace view watch_scores_view as
select * from watch_scores;

create or replace view events_view as
select * from events;

create or replace view relay_links_view as
select
  rl.*,
  fd.name as from_division_name,
  td.name as to_division_name
from relay_links rl
join divisions fd on fd.slug = rl.from_division_slug
join divisions td on td.slug = rl.to_division_slug;

create or replace view integrity_issues_view as
select * from integrity_issues;

create or replace view simulation_runs_view as
select * from simulation_runs;

create or replace view entities_view as
select * from entities;

create or replace view source_records_view as
select * from source_records;
