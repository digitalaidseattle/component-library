import type { ParticipantField } from "../pages/CreatorSurveyPage";

/* ---------- Editor snapshot ---------- */
export type SurveySnapshot = {
  surveyTitle: string | null;
  surveyDescription: string | null;
  participantFields: ParticipantField[];
};

/* ---------- Persisted draft ---------- */
export type DraftSurvey = {
  id: string;
  status: "draft" | "published";
  updatedAt: number;

  history: SurveySnapshot[];
  historyIndex: number;
};
