import { RouteObject } from "react-router-dom";
import { Error, Login, MinimalLayout } from "@digitalaidseattle/mui";
import AuthGate from "./components/auth/AuthGate";
import DashboardPage from "./pages/DashboardPage";
import CreateSurveyPage from "./pages/CreatorSurveyPage";
import TemplateGalleryPage from "./pages/TemplateGalleryPage";
import PublishedSurveyPage from "./pages/PublishedSurveyPage";
import CreateTemplatePage from "./pages/CreateTemplatePage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AuthGate />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "templates/create",
        element: <CreateTemplatePage />,
      },
      {
        path: "surveys/new",
        element: <TemplateGalleryPage />,
      },
      {
        path: "surveys/create/:templateId",
        element: <CreateSurveyPage />,
      },
      {
        path: "surveys/edit/:draftId",
        element: <CreateSurveyPage />,
      },
      {
        path: "surveys/:surveyId",
        element: <PublishedSurveyPage />,
      },
    ],
  },
  {
    path: "/",
    element: <MinimalLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <MinimalLayout />,
    children: [
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
];
