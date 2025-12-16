import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CreateSurveyPage from "./pages/CreateSurveyPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/create" element={<CreateSurveyPage />} />
    </Routes>
  );
}