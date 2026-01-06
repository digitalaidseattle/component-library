import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { v4 as uuid } from "uuid";

import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";
import CreatorCanvas from "../components/canvas/CreatorCanvas";

import type { DraftSurvey, SurveySnapshot } from "../models/DraftSurvey";
import { getDraft, upsertDraft } from "../storage/DraftSurveyStorage";

/* ---------- Types ---------- */

export type ParticipantFieldType = "name" | "email" | "address";

export type ParticipantField = {
  type: ParticipantFieldType;
  label: string;
  required: boolean;
};

/* ---------- Page ---------- */

export default function CreateSurveyPage() {
  const navigate = useNavigate();
  const { draftId } = useParams<{ draftId: string }>();

  const [id] = useState(draftId ?? uuid());

  const [history, setHistory] = useState<SurveySnapshot[]>([
    {
      surveyTitle: null,
      surveyDescription: null,
      participantFields: [],
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [hasChanges, setHasChanges] = useState(false);

  /* ---------- Load existing draft ---------- */

  useEffect(() => {
    if (!draftId) return;

    const draft = getDraft(draftId);
    if (!draft) return;

    setHistory(draft.history);
    setHistoryIndex(draft.historyIndex);
  }, [draftId]);

  /* ---------- Persist ONLY after first change ---------- */

  useEffect(() => {
    if (!hasChanges) return;

    const draft: DraftSurvey = {
      id,
      status: "draft",
      updatedAt: Date.now(),
      history,
      historyIndex,
    };

    upsertDraft(draft);
  }, [hasChanges, history, historyIndex, id]);

  const current = history[historyIndex];
  const { surveyTitle, surveyDescription, participantFields } = current;

  /* ---------- History helpers ---------- */

  function pushHistory(next: SurveySnapshot) {
    setHasChanges(true);
    setHistory((h) => [...h.slice(0, historyIndex + 1), next]);
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
        e.shiftKey ? redo() : undo();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  });

  /* ---------- Mutators ---------- */

  function addParticipantField(type: ParticipantFieldType) {
    if (participantFields.some((f) => f.type === type)) return;

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
    pushHistory({ ...current, surveyDescription: value });
  }

  function updateParticipantLabel(
    type: ParticipantFieldType,
    value: string
  ) {
    pushHistory({
      ...current,
      participantFields: participantFields.map((f) =>
        f.type === type ? { ...f, label: value } : f
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
        f.type === type ? { ...f, required } : f
      ),
    });
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
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
        onDeleteParticipantField={deleteParticipantField}
        onUpdateSurveyTitle={updateSurveyTitle}
        onUpdateSurveyDescription={updateSurveyDescription}
        onUpdateParticipantLabel={updateParticipantLabel}
        onUpdateParticipantRequired={updateParticipantRequired}
      />
    </AppLayout>
  );
}