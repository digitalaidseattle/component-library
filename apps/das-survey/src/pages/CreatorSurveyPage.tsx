import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import CreatorSidebar from "../components/sidebars/CreatorSideBar";
import CreatorCanvas from "../components/Canvas/CreatorCanvas";

export type ParticipantFieldType = "name" | "email" | "address";

export type ParticipantField = {
  type: ParticipantFieldType;
  label: string;
  required: boolean;
};

export default function CreateSurveyPage() {
  const [surveyTitle, setSurveyTitle] = useState<string | null>(null);
  const [surveyDescription, setSurveyDescription] = useState<string | null>(null);
  const [participantFields, setParticipantFields] = useState<ParticipantField[]>([]);

  function addSurveyTitle() {
    if (surveyTitle === null) setSurveyTitle("");
  }

  function addSurveyDescription() {
    if (surveyDescription === null) setSurveyDescription("");
  }

  function addParticipantField(type: ParticipantFieldType) {
    if (participantFields.some((f) => f.type === type)) return;

    setParticipantFields((fields) => [
      ...fields,
      {
        type,
        label:
          type === "name"
            ? "Your name"
            : type === "email"
            ? "Email address"
            : "Mailing address",
        required: true,
      },
    ]);
  }

  function updateParticipantLabel(type: ParticipantFieldType, value: string) {
    setParticipantFields((fields) =>
      fields.map((f) =>
        f.type === type ? { ...f, label: value } : f
      )
    );
  }

  function updateParticipantRequired(type: ParticipantFieldType, required: boolean) {
    setParticipantFields((fields) =>
      fields.map((f) =>
        f.type === type ? { ...f, required } : f
      )
    );
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: "Create Survey" },
      ]}
      sidebarContent={
        <CreatorSidebar
          hasSurveyTitle={surveyTitle !== null}
          hasSurveyDescription={surveyDescription !== null}
          hasParticipantName={participantFields.some((f) => f.type === "name")}
          hasParticipantEmail={participantFields.some((f) => f.type === "email")}
          hasParticipantAddress={participantFields.some((f) => f.type === "address")}
          onAddSurveyTitle={addSurveyTitle}
          onAddSurveyDescription={addSurveyDescription}
          onAddParticipantName={() => addParticipantField("name")}
          onAddParticipantEmail={() => addParticipantField("email")}
          onAddParticipantAddress={() => addParticipantField("address")}
        />
      }
    >
      <CreatorCanvas
        surveyTitle={surveyTitle}
        surveyDescription={surveyDescription}
        participantFields={participantFields}
        onUpdateSurveyTitle={setSurveyTitle}
        onUpdateSurveyDescription={setSurveyDescription}
        onUpdateParticipantLabel={updateParticipantLabel}
        onUpdateParticipantRequired={updateParticipantRequired}
      />
    </AppLayout>
  );
}