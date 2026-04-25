-- Seeded-mode relational sketch.
-- Not used by the app runtime yet.
-- This exists so the fake data maps cleanly to a future SQL-backed repository.

create table cases (
  case_id text primary key,
  scenario_type text not null,
  status text not null,
  resolution_state text not null,
  masked_user_label text not null,
  masked_phone text not null,
  segment_label text not null,
  wallet_label text not null,
  region_label text not null,
  current_control_state text not null,
  score integer not null,
  risk_level text not null,
  export_note text not null
);

create table score_components (
  case_id text not null references cases(case_id),
  code text not null,
  label text not null,
  points integer not null,
  evidence_ids jsonb not null
);

create table evidence_items (
  evidence_id text primary key,
  case_id text not null references cases(case_id),
  kind text not null,
  title text not null,
  summary text not null,
  source text not null,
  observed_at timestamptz not null,
  confidence numeric,
  policy_ids jsonb not null
);

create table policy_hits (
  case_id text not null references cases(case_id),
  policy_id text not null,
  title text not null,
  explanation text not null,
  action_allow_list jsonb not null
);

create table case_prompts (
  prompt_id text primary key,
  case_id text not null references cases(case_id),
  channel text not null,
  state text not null,
  template_name text not null,
  message_preview text not null,
  sent_at timestamptz,
  delivered_at timestamptz,
  expired_at timestamptz
);

create table audit_events (
  event_id text primary key,
  case_id text not null references cases(case_id),
  actor_type text not null,
  actor_name text not null,
  event_type text not null,
  summary text not null,
  created_at timestamptz not null
);
