import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CreateSurveyPage from "./pages/CreatorSurveyPage";
import TemplateGalleryPage from "./pages/TemplateGalleryPage";
import PublishedSurveyPage from "./pages/PublishedSurveyPage";
import CreateTemplatePage from "./pages/CreateTemplatePage";

export default function App() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={<DashboardPage />} />

      {/* Template creation */}
      <Route path="/templates/create" element={<CreateTemplatePage />} />

      {/* Template gallery */}
      <Route path="/surveys/new" element={<TemplateGalleryPage />} />

      {/* Create new survey (blank draft) */}
      <Route path="/surveys/create/:templateId" element={<CreateSurveyPage />} />

      {/* Edit existing draft */}
      <Route
        path="/surveys/edit/:draftId"
        element={<CreateSurveyPage />}
      />

      <Route path="/surveys/:surveyId" element={<PublishedSurveyPage />} />
    </Routes>
  );
}
