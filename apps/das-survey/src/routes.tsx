import { RouteObject } from "react-router-dom";
import { Error, Login, MinimalLayout } from "@digitalaidseattle/mui";
import { SurveySessionGate } from "@digitalaidseattle/surveys";
import AuthGate from "./components/auth/AuthGate";
import DashboardPage from "./pages/DashboardPage";
import CreateSurveyPage from "./pages/CreatorSurveyPage";
import TemplateGalleryPage from "./pages/TemplateGalleryPage";
import PublishedSurveyPage from "./pages/PublishedSurveyPage";
import CreateTemplatePage from "./pages/CreateTemplatePage";
import ContactsPage from "./pages/ContactsPage";
import ResponsesPage from "./pages/ResponsesPage";
import SurveyTakerPage from "./pages/SurveyTakerPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AuthGate />,
    children: [
      {
        element: <SurveySessionGate />,
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
          {
            path: "contacts",
            element: <ContactsPage />,
          },
          {
            path: "surveys/:surveyId/contacts",
            element: <ContactsPage />,
          },
          {
            path: "responses",
            element: <ResponsesPage />,
          },
          {
            path: "surveys/:surveyId/responses",
            element: <ResponsesPage />,
          },
        ],
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
      {
        path: "take/:surveyId",
        element: <SurveyTakerPage />,
      },
      {
        path: "take/:surveyId/contact/:contactId",
        element: <SurveyTakerPage />,
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
