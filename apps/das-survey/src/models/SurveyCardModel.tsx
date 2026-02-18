export type SurveyCardModel = {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "active";
  lastOpened: Date;

  collaborators?: {
    name: string;
  }[];
};