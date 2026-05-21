# Survey Module

A lightweight, accessible survey builder built with React, TypeScript, Vite, and MUI.

## The project

The project focuses on a creator-first experience, allowing survey authors to build surveys step-by-step using a clear story arc:

* Introduce the survey

* Collect participant information

* (Later) design questions and workflow

* Current Features

* Dashboard view with surveys

Create Survey flow with:

* Editable survey title and introduction

* Participant introduction fields (name, email, address)

* Clean canvas-based editor

* Accessible, keyboard-friendly UI

* Modular layout (shared AppBar and Sidebar)

## Tech Stack

React + TypeScript

Vite

Material UI (MUI)

## Project Status

This project is actively evolving.
Upcoming work includes drag-and-drop question ordering, field deletion, styling controls, and workflow logic.

## Persistence (Supabase)

The survey app can store draft and published survey data in Supabase.
This app's Supabase project lives at `apps/das-survey/supabase` so it stays scoped to the survey app within the monorepo.

### 1. Add environment variables

Create `apps/das-survey/.env`:

```bash
VITE_SUPABASE_TARGET=local

# Cloud project
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-cloud-anon-key

# Local Docker / Supabase CLI project
VITE_SUPABASE_LOCAL_URL=http://127.0.0.1:54321
VITE_SUPABASE_LOCAL_ANON_KEY=your-local-anon-key

# Recommended to avoid falling back to browser-only storage.
VITE_SURVEY_DATA_PROVIDER=supabase

# Leave auth local if you only want to test persistence.
# Set to supabase only if you also configure Supabase Auth.
VITE_SURVEY_AUTH_PROVIDER=local

# When auth is local, use a stable owner key instead of browser storage.
VITE_SURVEY_OWNER_KEY=local-dev
```

Change only `VITE_SUPABASE_TARGET` when you want to switch between the local container and the cloud project:

```bash
VITE_SUPABASE_TARGET=local
# or
VITE_SUPABASE_TARGET=cloud
```

The app also accepts `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as a compatibility fallback for the local target, but `VITE_SUPABASE_LOCAL_*` is the preferred format for this Vite app.

### 2. Create the database tables

The current code writes to `survey_drafts`, `published_surveys`, and `survey_templates`.
The reproducible database files are checked in at:

* `apps/das-survey/supabase/migrations/20260325193000_survey_workspace.sql`
* `apps/das-survey/supabase/schemas/001_survey_workspace.sql`

From the repo root, run Supabase CLI commands from `apps/das-survey`:

```bash
cd apps/das-survey
supabase db push
```

```sql
create table if not exists public.survey_drafts (
  id text primary key,
  created_by text null,
  created_at timestamptz null,
  updated_by text null,
  status text not null check (status in ('draft', 'published')),
  updated_at timestamptz not null,
  template_id text not null,
  history jsonb not null,
  history_index integer not null
);

create table if not exists public.published_surveys (
  id text primary key,
  created_by text null,
  created_at timestamptz null,
  updated_by text null,
  draft_id text not null,
  template_id text not null,
  title text not null,
  description text null,
  questions jsonb not null,
  published_at timestamptz not null,
  updated_at timestamptz not null
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
```

### 3. Allow the browser client to read and write

This app uses the public Supabase client and anon key directly in the browser. For local testing, you need either:

1. RLS disabled on both tables, or
2. RLS enabled with policies that allow `select`, `insert`, `update`, and `delete`.

For short-lived local testing only, disabling RLS is the fastest option:

```sql
alter table public.survey_drafts disable row level security;
alter table public.published_surveys disable row level security;
alter table public.survey_templates disable row level security;
```

If you want to keep RLS on, create policies that match your intended access model instead.

### 4. Start the app

```bash
yarn workspace survey-module dev
```

### 5. Verify persistence

Create or edit a survey draft, then refresh the page. You should see rows in `survey_drafts`. When you publish a survey, you should also see a row in `published_surveys`.

If Supabase env vars are missing, the tables do not exist, or the client is denied by RLS, writes will not persist. Check the browser console and the Supabase Table Editor to confirm you are actually writing to Supabase.

## Survey email workflow

The app now has a publish-to-contacts flow:

1. Publishing a survey opens `/surveys/:surveyId/contacts`.
2. Contacts can be selected and sent a survey invitation.
3. The browser invokes the Supabase Edge Function `send-survey-email`.
4. Recipients open `/take/:surveyId/contact/:contactId`.
5. Submitted answers are written to `survey_responses` and appear on `/responses` or `/surveys/:surveyId/responses`.

Apply the email workflow migration:

```bash
cd apps/das-survey
supabase db push
```

Configure the Resend function secrets:

```bash
supabase secrets set RESEND_API_KEY=your-resend-api-key
supabase secrets set RESEND_FROM_EMAIL="DAS Surveys <surveys@your-verified-domain.org>"
```

Deploy the send function:

```bash
cd apps/das-survey
supabase functions deploy send-survey-email
```

For local development, serve the function with:

```bash
cd apps/das-survey
supabase functions serve send-survey-email --env-file supabase/.env.local
```

The email body supports `{{survey_link}}`, which the Edge Function replaces with the generated survey taker URL.

You still need production RLS policies for:

* `survey_contacts`
* `survey_email_campaigns`
* `survey_email_recipients`
* `survey_responses`

For a quick local-only test, you can temporarily disable RLS on those tables, but production should restrict contact/campaign/response reads to the survey owner and allow public response inserts only for published survey links.
