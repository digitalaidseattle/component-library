import type { DraftSurvey } from "./DraftSurvey";
import type { SurveyCardModel } from "./SurveyCardModel";

export function draftToCardModel(
  draft: DraftSurvey
): SurveyCardModel {
  const snapshot = draft.history[draft.historyIndex];

  return {
    id: draft.id,
    title: snapshot.surveyTitle || "Untitled survey",

    // ✅ THIS WAS THE MISSING PIECE
    description: snapshot.surveyDescription ?? "",

    status: draft.status === "published" ? "active" : "draft",
    lastOpened: new Date(draft.updatedAt),

    collaborators: [{ name: "You" }],
  };
}