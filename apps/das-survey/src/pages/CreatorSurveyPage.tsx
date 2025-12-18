import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";
import CreatorCanvas from "../components/Canvas/CreatorCanvas";

export type ParticipantFieldType = "name" | "email" | "address";

export type ParticipantField = {
  type: ParticipantFieldType;
  label: string;
  required: boolean;
};

/* ---------- Undo snapshot ---------- */

type SurveySnapshot = {
  surveyTitle: string | null;
  surveyDescription: string | null;
  participantFields: ParticipantField[];
};

export default function CreateSurveyPage() {
  const navigate = useNavigate();

  /* ---------- History state ---------- */

  const [history, setHistory] = useState<SurveySnapshot[]>([
    {
      surveyTitle: null,
      surveyDescription: null,
      participantFields: [],
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const current = history[historyIndex];
  const { surveyTitle, surveyDescription, participantFields } = current;

  /* ---------- History helpers ---------- */

  function pushHistory(next: SurveySnapshot) {
    setHistory((h) => [
      ...h.slice(0, historyIndex + 1),
      next,
    ]);
    setHistoryIndex((i) => i + 1);
  }

  function undo() {
    setHistoryIndex((i) => Math.max(i - 1, 0));
  }

  function redo() {
    setHistoryIndex((i) =>
      Math.min(i + 1, history.length - 1)
    );
  }

  /* ---------- Keyboard shortcuts ---------- */

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  });

  /* ---------- Mutators (ALL go through pushHistory) ---------- */

  function addParticipantField(type: ParticipantFieldType) {
    if (participantFields.some((f) => f.type === type))
      return;

    pushHistory({
      ...current,
      participantFields: [
        ...participantFields,
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
      ],
    });
  }

  function deleteParticipantField(type: ParticipantFieldType) {
    pushHistory({
      ...current,
      participantFields: participantFields.filter(
        (f) => f.type !== type
      ),
    });
  }

  function updateSurveyTitle(value: string) {
    pushHistory({ ...current, surveyTitle: value });
  }

  function updateSurveyDescription(value: string) {
    pushHistory({
      ...current,
      surveyDescription: value,
    });
  }

  function updateParticipantLabel(
    type: ParticipantFieldType,
    value: string
  ) {
    pushHistory({
      ...current,
      participantFields: participantFields.map((f) =>
        f.type === type
          ? { ...f, label: value }
          : f
      ),
    });
  }

  function updateParticipantRequired(
    type: ParticipantFieldType,
    required: boolean
  ) {
    pushHistory({
      ...current,
      participantFields: participantFields.map((f) =>
        f.type === type
          ? { ...f, required }
          : f
      ),
    });
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: "Templates", path: "/new" },
        { label: "Create Survey" },
      ]}
      sidebarContent={
        <Sidebar
          primaryAction={{
            label: "Dashboard",
            icon: <ArrowBackIcon />,
            onClick: () => navigate("/"),
          }}
        />
      }
    >
      <CreatorCanvas
        surveyTitle={surveyTitle}
        surveyDescription={surveyDescription}
        participantFields={participantFields}
        onAddParticipantField={addParticipantField}
        onUpdateSurveyTitle={updateSurveyTitle}
        onUpdateSurveyDescription={updateSurveyDescription}
        onUpdateParticipantLabel={updateParticipantLabel}
        onUpdateParticipantRequired={updateParticipantRequired}
        onDeleteParticipantField={deleteParticipantField}
      />
    </AppLayout>
  );
}