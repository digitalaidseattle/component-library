import { useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/sidebars/Sidebar";
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
        <Sidebar
          primaryAction={{
            label: "Dashboard",
            icon: <ArrowBackIcon />,
            onClick: () => navigate("/"),
          }}
        />
      }
    >
      {/* Canvas header */}
      <Box sx={{ mb: 2 }}>
        <Typography fontWeight={600} gutterBottom>
          Templates
        </Typography>

        <Tabs
          value={selectedTemplate}
          onChange={(_, value) => setSelectedTemplate(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab
            label="Blank survey"
            value="blank"
          />

          {/* future templates */}
          {/* 
          <Tab label="Customer feedback" value="feedback" />
          <Tab label="Intake form" value="intake" />
          */}
        </Tabs>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Preview */}
      {selectedTemplate === "blank" && (
        <BlankTemplatePreview
          onUseTemplate={() => navigate("/create")}
        />
      )}
    </AppLayout>
  );
}