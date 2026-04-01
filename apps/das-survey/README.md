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

The survey dashboard/creator now use a Supabase-backed draft persistence layer.

1. Add env vars in `apps/das-survey/.env`:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

1. Create table `survey_drafts` in Supabase:

```sql
create table if not exists public.survey_drafts (
  id text primary key,
  status text not null check (status in ('draft', 'published')),
  updated_at bigint not null,
  history jsonb not null,
  history_index integer not null
);
```

If Supabase env vars are missing or requests fail, the app falls back to local browser storage.
