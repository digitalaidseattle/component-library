import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import CreatorSidebar from "../components/CreatorSideBar";
import IntroCanvas from "../components/IntroCanvas";

import type { Survey } from "../models/SurveyModel";
import { createEmptySurvey } from "../models/CreateEmptySurvey";

export default function CreateSurveyPage() {
  const [survey, setSurvey] = useState<Survey>(() => createEmptySurvey());

  const introChapter = survey.chapters.find((c) => c.type === "intro");
  if (!introChapter || introChapter.type !== "intro") return null;

  const hasSurveyTitle = Boolean(introChapter.surveyIntro.title);
  const hasSurveyDescription = Boolean(introChapter.surveyIntro.description);

  const hasParticipantField = (type: "name" | "email" | "address") =>
    introChapter.participantIntro.fields.some((f) => f.type === type);

  function addSurveyTitle() {
    setSurvey((s) => {
      const intro = s.chapters[0];
      if (intro.type !== "intro") return s;
      if (!intro.surveyIntro.title) intro.surveyIntro.title = { type: "text", value: "" };
      return { ...s };
    });
  }

  function addSurveyDescription() {
    setSurvey((s) => {
      const intro = s.chapters[0];
      if (intro.type !== "intro") return s;
      if (!intro.surveyIntro.description)
        intro.surveyIntro.description = { type: "text", value: "" };
      return { ...s };
    });
  }

  function addParticipantField(type: "name" | "email" | "address") {
    setSurvey((s) => {
      const intro = s.chapters[0];
      if (intro.type !== "intro") return s;

      const exists = intro.participantIntro.fields.some((f) => f.type === type);
      if (exists) return s;

      intro.participantIntro.fields.push({
        type,
        label:
          type === "name"
            ? "Your name"
            : type === "email"
            ? "Email address"
            : "Mailing address",
        required: true,
      });

      return { ...s };
    });
  }

  function updateSurveyTitle(value: string) {
    setSurvey((s) => {
      const intro = s.chapters[0];
      if (intro.type !== "intro" || !intro.surveyIntro.title) return s;
      intro.surveyIntro.title.value = value;
      return { ...s };
    });
  }

  function updateSurveyDescription(value: string) {
    setSurvey((s) => {
      const intro = s.chapters[0];
      if (intro.type !== "intro" || !intro.surveyIntro.description) return s;
      intro.surveyIntro.description.value = value;
      return { ...s };
    });
  }

  function updateParticipantLabel(fieldType: "name" | "email" | "address", value: string) {
    setSurvey((s) => {
      const intro = s.chapters[0];
      if (intro.type !== "intro") return s;

      const idx = intro.participantIntro.fields.findIndex((f) => f.type === fieldType);
      if (idx === -1) return s;

      intro.participantIntro.fields[idx].label = value;
      return { ...s };
    });
  }

  function updateParticipantRequired(
    fieldType: "name" | "email" | "address",
    required: boolean
  ) {
    setSurvey((s) => {
      const intro = s.chapters[0];
      if (intro.type !== "intro") return s;

      const idx = intro.participantIntro.fields.findIndex((f) => f.type === fieldType);
      if (idx === -1) return s;

      intro.participantIntro.fields[idx].required = required;
      return { ...s };
    });
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: "Create Survey" },
      ]}
      sidebarContent={
        <CreatorSidebar
          hasSurveyTitle={hasSurveyTitle}
          hasSurveyDescription={hasSurveyDescription}
          hasParticipantName={hasParticipantField("name")}
          hasParticipantEmail={hasParticipantField("email")}
          hasParticipantAddress={hasParticipantField("address")}
          onAddSurveyTitle={addSurveyTitle}
          onAddSurveyDescription={addSurveyDescription}
          onAddParticipantName={() => addParticipantField("name")}
          onAddParticipantEmail={() => addParticipantField("email")}
          onAddParticipantAddress={() => addParticipantField("address")}
        />
      }
    >
      <IntroCanvas
        introChapter={introChapter}
        onUpdateSurveyTitle={updateSurveyTitle}
        onUpdateSurveyDescription={updateSurveyDescription}
        onUpdateParticipantLabel={updateParticipantLabel}
        onUpdateParticipantRequired={updateParticipantRequired}
      />
    </AppLayout>
  );
}