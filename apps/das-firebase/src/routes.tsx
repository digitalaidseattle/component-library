import { RouteObject } from 'react-router-dom';

import {
  Error,
  Login,
  MainLayout,
  MarkdownPage,
  MinimalLayout,
} from "@digitalaidseattle/mui";
import DonationsPage from "./pages/donations";
import InstitutionsPage from "./pages/institutions";
import ProjectsPage from "./pages/projects";
import TestPage from './pages/TestPage';
import { ProjectPage as AiProjectPage, ProjectsListPage as AiProjectsListPage } from '@digitalaidseattle/content-generation';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout sx={{ p: 1 }} />,
    children: [
      {
        path: "",
        element: <AiProjectsListPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "institutions",
        element: <InstitutionsPage />,
      },
      {
        path: "ai-projects/:id",
        element: <AiProjectPage listPath={"ai-projects"} />,
      }, {
        path: "ai-projects",
        element: <AiProjectsListPage detailPath="ai-projects" helpFilePath='./ai-projects.md' />,
      }, {
        path: "donations",
        element: <DonationsPage />,
      },
      {
        path: "privacy",
        element: <MarkdownPage filepath='privacy.md' />,
      },
      {
        path: "testpage",
        element: <TestPage />,
      }
    ]
  },
  {
    path: "/",
    element: <MinimalLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      }
    ]
  },
  {
    path: "*",
    element: <MinimalLayout />,
    children: [
      {
        path: '*',
        element: <Error />
      }
    ]
  }
];

export { routes };
