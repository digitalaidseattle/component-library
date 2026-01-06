import type { DraftSurvey } from "./DraftSurvey";
import type { SurveySummary } from "./SurveySummary";

export function draftToSummary(
  draft: DraftSurvey
): SurveySummary {
  const snapshot = draft.history[draft.historyIndex];

  return {
    id: draft.id,
    title: snapshot.surveyTitle || "Untitled survey",
    status: draft.status === "published" ? "active" : "draft",
    lastOpened: new Date(draft.updatedAt),
  };
}