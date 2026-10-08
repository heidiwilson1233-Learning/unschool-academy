-- Unschool Academy — Postgres schema (Supabase)
-- Blueprint §6.3 data domains. Run in the Supabase SQL editor.
-- Auth users live in auth.users (Supabase Auth); this file adds app tables.

-- ── Roles ──────────────────────────────────────────────────────────────
create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','editor','subject_reviewer','adult_learner','parent')),
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- ── Families & children (parent-owned; minimal PII by design) ───────────
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  locale text not null default 'en-IN',
  timezone text not null default 'Asia/Kolkata',
  billing_country text not null default 'IN',
  created_at timestamptz not null default now()
);

create table if not exists public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  nickname text not null,
  age_track text not null,
  curriculum_region text,
  narration_locale text not null default 'en-IN',
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.parent_consents (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  jurisdiction text not null,
  purpose text not null,
  method text not null,
  version text not null,
  verified_at timestamptz,
  revoked_at timestamptz,
  evidence_reference text
);

-- ── Exam attempts (versioned, deterministic scoring) ────────────────────
create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_track_id text not null,
  mock_id text,
  kind text not null check (kind in ('diagnostic','practice','mock')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  scoring_version text not null default 'v1',
  score_json jsonb,
  metadata_json jsonb default '{}'::jsonb
);

create table if not exists public.exam_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
  question_id text not null,
  question_version text not null default 'v1',
  selected_answer_json jsonb,
  correctness boolean,
  response_ms integer,
  hint_count integer not null default 0,
  unique (attempt_id, question_id)
);

-- ── Kids quest attempts ─────────────────────────────────────────────────
create table if not exists public.child_quest_attempts (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  quest_id text not null,
  quest_version text not null default 'v1',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  independent_attempts integer not null default 0,
  hint_levels integer not null default 0,
  transfer_observed boolean not null default false,
  results_json jsonb default '{}'::jsonb
);

-- ── Commerce (test mode until live keys + approval) ─────────────────────
create table if not exists public.products (
  id text primary key,
  product_type text not null,
  sku text not null unique,
  currency text not null default 'INR',
  price_minor_units integer not null,
  billing_type text not null check (billing_type in ('one_time','subscription')),
  duration_days integer,
  status text not null default 'draft' check (status in ('draft','active','retired'))
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  adult_user_id uuid not null references auth.users(id),
  product_id text not null references public.products(id),
  processor text not null,
  processor_order_id text,
  amount_minor_units integer not null,
  currency text not null default 'INR',
  status text not null default 'created' check (status in ('created','pending_verification','paid','failed','cancelled','refunded')),
  created_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  processor text not null,
  event_id text not null,
  event_type text not null,
  verified_signature boolean not null default false,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (processor, event_id)
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  adult_user_id uuid not null references auth.users(id) on delete cascade,
  family_id uuid references public.families(id) on delete set null,
  product_id text not null references public.products(id),
  active_from timestamptz not null default now(),
  active_to timestamptz,
  status text not null default 'active' check (status in ('active','expired','revoked')),
  external_payment_id text
);

create table if not exists public.refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  provider_refund_id text,
  amount_minor_units integer not null,
  status text not null default 'requested'
);

-- ── Support & audit ─────────────────────────────────────────────────────
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  adult_user_id uuid references auth.users(id) on delete set null,
  category text not null,
  state text not null default 'open',
  content_redacted text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.content_audit (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  changed_by uuid references auth.users(id) on delete set null,
  action text not null,
  before_revision jsonb,
  after_revision jsonb,
  occurred_at timestamptz not null default now()
);

-- ── Row-level security: deny by default; server uses service key ────────
alter table public.user_roles enable row level security;
alter table public.families enable row level security;
alter table public.child_profiles enable row level security;
alter table public.parent_consents enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.exam_attempt_answers enable row level security;
alter table public.child_quest_attempts enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.payment_events enable row level security;
alter table public.entitlements enable row level security;
alter table public.refunds enable row level security;
alter table public.support_tickets enable row level security;
alter table public.content_audit enable row level security;
-- No public policies: all access goes through server-side checks with the
-- service-role key (never exposed to the browser). Policies can be added
-- per-feature once the access model is reviewed.
