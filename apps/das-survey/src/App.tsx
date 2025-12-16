import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CreateSurveyPage from "./pages/CreatorSurveyPage";
import TemplateGalleryPage from "./pages/TemplateGalleryPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/new" element={<TemplateGalleryPage />} />
      <Route path="/create" element={<CreateSurveyPage />} />
    </Routes>
  );
}