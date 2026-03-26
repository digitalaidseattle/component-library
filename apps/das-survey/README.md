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

### 1. Add environment variables

Create `apps/das-survey/.env`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional but recommended to avoid auto-detection surprises.
VITE_SURVEY_DATA_PROVIDER=supabase

# Leave auth local if you only want to test persistence.
# Set to supabase only if you also configure Supabase Auth.
VITE_SURVEY_AUTH_PROVIDER=local
```

### 2. Create the database tables

The current code writes to both `survey_drafts` and `published_surveys`.

```sql
create table if not exists public.survey_drafts (
  id text primary key,
  status text not null check (status in ('draft', 'published')),
  updated_at timestamptz not null,
  template_id text not null,
  history jsonb not null,
  history_index integer not null
);

create table if not exists public.published_surveys (
  id text primary key,
  draft_id text not null,
  template_id text not null,
  title text not null,
  description text null,
  questions jsonb not null,
  published_at timestamptz not null,
  updated_at timestamptz not null
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
```

If you want to keep RLS on, create policies that match your intended access model instead.

### 4. Start the app

```bash
yarn workspace survey-module dev
```

### 5. Verify persistence

Create or edit a survey draft, then refresh the page. You should see rows in `survey_drafts`. When you publish a survey, you should also see a row in `published_surveys`.

If Supabase env vars are missing, the tables do not exist, or the client is denied by RLS, the app falls back to local browser storage. In that case the UI may still appear to work, so check the browser console and the Supabase Table Editor to confirm you are actually writing to Supabase.
