// src/pages/CreateSurveyPage.tsx

import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import CreatorSidebar from "../../components/sidebars/CreatorSideBar";
import CreatorCanvas from "../../components/Canvas/CreatorCanvas";
import {
  createInitialCreatorModel,
  applyCreatorCommand,
} from "../../models/CreatorModel";
import type { ChapterId } from "../../models/CreatorModel";

export default function CreateSurveyPage() {
  const [creatorModel, setCreatorModel] = useState(
    createInitialCreatorModel()
  );

  function handleCommand(cmd: any) {
    setCreatorModel((m) => applyCreatorCommand(m, cmd));
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: "Templates", path: "/new" },
        { label: "Create Survey" },
      ]}
      sidebarContent={
        <CreatorSidebar onCommand={handleCommand} />
      }
    >
      <CreatorCanvas
      model={creatorModel}
      onFocusChapter={(id: ChapterId) =>
        handleCommand({
          type: "FOCUS_CHAPTER",
          chapterId: id,
        })
      }
    />
    </AppLayout>
  );
}