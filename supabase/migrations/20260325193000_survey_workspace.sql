grant usage on schema public to anon, authenticated, service_role;

create table if not exists public.survey_drafts (
  id text primary key,
  created_by text null,
  created_at timestamptz null,
  updated_by text null,
  updated_at timestamptz not null,
  status text not null check (status in ('draft', 'published')),
  template_id text not null,
  history jsonb not null default '[]'::jsonb,
  history_index integer not null default 0
);

create table if not exists public.published_surveys (
  id text primary key,
  created_by text null,
  created_at timestamptz null,
  updated_by text null,
  updated_at timestamptz not null,
  draft_id text not null,
  template_id text not null,
  title text not null,
  description text null,
  questions jsonb not null default '[]'::jsonb,
  published_at timestamptz not null
);

create table if not exists public.survey_templates (
  id text primary key,
  created_by text null,
  created_at timestamptz null,
  updated_by text null,
  updated_at timestamptz not null,
  title text not null,
  description text not null default '',
  category text not null,
  definition jsonb not null,
  scope text not null default 'user' check (scope in ('system', 'user')),
  owner_email text not null
);

create index if not exists survey_drafts_created_by_idx
  on public.survey_drafts (created_by);

create index if not exists survey_drafts_updated_by_idx
  on public.survey_drafts (updated_by);

create index if not exists survey_published_surveys_created_by_idx
  on public.published_surveys (created_by);

create index if not exists survey_published_surveys_updated_by_idx
  on public.published_surveys (updated_by);

create index if not exists survey_templates_owner_email_idx
  on public.survey_templates (owner_email);

create index if not exists survey_templates_updated_at_idx
  on public.survey_templates (updated_at desc);

grant select, insert, update, delete on public.survey_drafts
  to anon, authenticated, service_role;

grant select, insert, update, delete on public.published_surveys
  to anon, authenticated, service_role;

grant select, insert, update, delete on public.survey_templates
  to anon, authenticated, service_role;

alter table public.survey_drafts disable row level security;
alter table public.published_surveys disable row level security;
alter table public.survey_templates disable row level security;
