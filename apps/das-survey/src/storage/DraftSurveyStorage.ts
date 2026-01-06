import type { DraftSurvey } from "../models/DraftSurvey";

const STORAGE_KEY = "draft-surveys";

export function loadDrafts(): DraftSurvey[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveDrafts(drafts: DraftSurvey[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function getDraft(id: string) {
  return loadDrafts().find((d) => d.id === id);
}

export function upsertDraft(draft: DraftSurvey) {
  const drafts = loadDrafts();
  const idx = drafts.findIndex((d) => d.id === draft.id);

  if (idx === -1) drafts.push(draft);
  else drafts[idx] = draft;

  saveDrafts(drafts);
}

export function deleteDraft(id: string) {
  saveDrafts(loadDrafts().filter((d) => d.id !== id));
}