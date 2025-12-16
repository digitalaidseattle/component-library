import { useState } from "react";
import { Divider, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import TemplateSidebar from "../components/sidebars/TemplateSidebar";
import BlankTemplatePreview from "../components/template_previews/BlankTemplatePreview";

type TemplateId = "blank";

export default function TemplateGalleryPage() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("blank");

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Dashboard", path: "/" },
        { label: "Templates" },
      ]}
      sidebarContent={
        <TemplateSidebar
          selected={selectedTemplate}
          onSelect={setSelectedTemplate}
        />
      }
    >
      <Typography fontWeight={600} gutterBottom>
        Template preview
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {selectedTemplate === "blank" && (
        <BlankTemplatePreview
          onUseTemplate={() =>
            navigate("/create")
          }
        />
      )}
    </AppLayout>
  );
}