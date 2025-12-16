import type { Survey } from "../models/SurveyModel";

export function createEmptySurvey(): Survey {
  return {
    id: crypto.randomUUID(),
    title: "Untitled Survey",
    chapters: [
      {
        type: "intro",
        surveyIntro: {},
        participantIntro: {
          fields: [],
        },
      },
    ],
  };
}