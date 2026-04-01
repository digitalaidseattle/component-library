import type { DraftSurvey } from "../models/DraftSurvey";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const STORAGE_KEY = "draft-surveys";
const TABLE_NAME = "survey_drafts";

type SurveyDraftRow = {
  id: string;
  status: "draft" | "published";
  updated_at: number;
  history: DraftSurvey["history"];
  history_index: number;
};

const supabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const supabaseClient: SupabaseClient | null = supabaseConfigured
  ? createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )
  : null;

function rowToDraft(row: SurveyDraftRow): DraftSurvey {
  return {
    id: row.id,
    status: row.status,
    updatedAt: row.updated_at,
    history: row.history,
    historyIndex: row.history_index,
  };
}

function draftToRow(draft: DraftSurvey): SurveyDraftRow {
  return {
    id: draft.id,
    status: draft.status,
    updated_at: draft.updatedAt,
    history: draft.history,
    history_index: draft.historyIndex,
  };
}

function loadLocalDrafts(): DraftSurvey[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveLocalDrafts(drafts: DraftSurvey[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

async function loadSupabaseDrafts(): Promise<DraftSurvey[]> {
  if (!supabaseClient) return [];

  const { data, error } = await supabaseClient
    .from(TABLE_NAME)
    .select("id,status,updated_at,history,history_index")
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row: unknown) =>
    rowToDraft(row as SurveyDraftRow)
  );
}

export async function loadDrafts(): Promise<DraftSurvey[]> {
  if (!supabaseConfigured) {
    return loadLocalDrafts();
  }

  try {
    return await loadSupabaseDrafts();
  } catch (error) {
    console.error("Failed to load drafts from Supabase, using local cache", error);
    return loadLocalDrafts();
  }
}

export async function getDraft(id: string): Promise<DraftSurvey | undefined> {
  if (!supabaseConfigured) {
    return loadLocalDrafts().find((draft) => draft.id === id);
  }

  try {
    if (!supabaseClient) return undefined;

    const { data, error } = await supabaseClient
      .from(TABLE_NAME)
      .select("id,status,updated_at,history,history_index")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? rowToDraft(data as SurveyDraftRow) : undefined;
  } catch (error) {
    console.error("Failed to load draft from Supabase, using local cache", error);
    return loadLocalDrafts().find((draft) => draft.id === id);
  }
}

export async function upsertDraft(draft: DraftSurvey): Promise<void> {
  if (!supabaseConfigured) {
    const drafts = loadLocalDrafts();
    const idx = drafts.findIndex((d) => d.id === draft.id);

    if (idx === -1) drafts.push(draft);
    else drafts[idx] = draft;

    saveLocalDrafts(drafts);
    return;
  }

  try {
    if (!supabaseClient) return;

    const { error } = await supabaseClient
      .from(TABLE_NAME)
      .upsert(draftToRow(draft), { onConflict: "id" });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Failed to upsert draft in Supabase, using local cache", error);
    const drafts = loadLocalDrafts();
    const idx = drafts.findIndex((d) => d.id === draft.id);

    if (idx === -1) drafts.push(draft);
    else drafts[idx] = draft;

    saveLocalDrafts(drafts);
  }
}

export async function deleteDraft(id: string): Promise<void> {
  if (!supabaseConfigured) {
    saveLocalDrafts(loadLocalDrafts().filter((draft) => draft.id !== id));
    return;
  }

  try {
    if (!supabaseClient) return;

    const { error } = await supabaseClient.from(TABLE_NAME).delete().eq("id", id);
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Failed to delete draft from Supabase, using local cache", error);
    saveLocalDrafts(loadLocalDrafts().filter((draft) => draft.id !== id));
  }
}

export function isSupabaseConfigured(): boolean {
  return supabaseConfigured;
}
