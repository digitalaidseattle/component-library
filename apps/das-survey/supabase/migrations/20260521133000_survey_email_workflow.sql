create table if not exists public.survey_contacts (
  id text primary key,
  owner_key text not null,
  email text not null,
  name text null,
  organization text null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists survey_contacts_owner_key_idx
  on public.survey_contacts(owner_key);

create table if not exists public.survey_email_campaigns (
  id text primary key,
  owner_key text not null,
  survey_id text not null references public.published_surveys(id) on delete cascade,
  subject text not null,
  message_html text not null,
  status text not null check (status in ('draft', 'sending', 'sent', 'failed')),
  selected_contact_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz null,
  error_message text null
);

create index if not exists survey_email_campaigns_owner_key_idx
  on public.survey_email_campaigns(owner_key);

create index if not exists survey_email_campaigns_survey_id_idx
  on public.survey_email_campaigns(survey_id);

create table if not exists public.survey_email_recipients (
  id text primary key,
  owner_key text not null,
  campaign_id text not null references public.survey_email_campaigns(id) on delete cascade,
  survey_id text not null references public.published_surveys(id) on delete cascade,
  contact_id text not null references public.survey_contacts(id) on delete cascade,
  email text not null,
  name text null,
  status text not null check (status in ('pending', 'sent', 'failed', 'submitted')),
  survey_url text not null,
  sent_at timestamptz null,
  submitted_at timestamptz null,
  error_message text null
);

create index if not exists survey_email_recipients_owner_key_idx
  on public.survey_email_recipients(owner_key);

create index if not exists survey_email_recipients_survey_id_idx
  on public.survey_email_recipients(survey_id);

create table if not exists public.survey_responses (
  id text primary key,
  owner_key text null,
  survey_id text not null references public.published_surveys(id) on delete cascade,
  recipient_id text null references public.survey_email_recipients(id) on delete set null,
  contact_id text null references public.survey_contacts(id) on delete set null,
  respondent_email text null,
  respondent_name text null,
  answers jsonb not null,
  submitted_at timestamptz not null default now()
);

create index if not exists survey_responses_owner_key_idx
  on public.survey_responses(owner_key);

create index if not exists survey_responses_survey_id_idx
  on public.survey_responses(survey_id);
