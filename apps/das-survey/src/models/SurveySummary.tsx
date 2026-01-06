export type SurveyStatus = "draft" | "active";

export type SurveySummary = {
  id: string;
  title: string;
  status: SurveyStatus;
  lastOpened: Date;
};