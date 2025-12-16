// src/models/MockSurveyData.ts

export type SurveyStatus = "active" | "draft";

export type Collaborator = {
  name: string;
  avatarUrl?: string;
};

export type Survey = {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  lastOpened: Date;
  collaborators: Collaborator[];
};

const surveys: Survey[] = [
  {
    id: "a1",
    title: "Accessibility Audit Survey",
    description:
      "Evaluate accessibility compliance across web and mobile experiences, focusing on WCAG gaps and assistive technology support.",
    status: "active",
    lastOpened: new Date(),
    collaborators: [
      { name: "Remy Sharp" },
      { name: "Travis Howard" },
    ],
  },
  {
    id: "a2",
    title: "User Intake Survey",
    description:
      "Collect demographic and accommodation needs information to tailor support services more effectively.",
    status: "active",
    lastOpened: new Date(Date.now() - 86400000),
    collaborators: [{ name: "Erica Johns" }],
  },
  {
    id: "d1",
    title: "Post-Event Evaluation",
    description:
      "Gather structured feedback after events to understand impact, accessibility, and future improvements.",
    status: "draft",
    lastOpened: new Date(Date.now() - 3 * 86400000),
    collaborators: [{ name: "Cindy Baker" }],
  },
];

export default function getMockSurveyData(): Survey[] {
  return surveys;
}
