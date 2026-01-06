import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CreateSurveyPage from "./pages/CreatorSurveyPage";
import TemplateGalleryPage from "./pages/TemplateGalleryPage";

export default function App() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={<DashboardPage />} />

      {/* Template gallery */}
      <Route path="/surveys/new" element={<TemplateGalleryPage />} />

      {/* Create new survey (blank draft) */}
      <Route path="/surveys/create" element={<CreateSurveyPage />} />

      {/* Edit existing draft */}
      <Route
        path="/surveys/edit/:draftId"
        element={<CreateSurveyPage />}
      />
    </Routes>
  );
}