/**
 * routes.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/

import { RouteObject } from 'react-router-dom';

import { ProjectPage } from '@digitalaidseattle/content-generation';
import {
  Error,
  Login,
  MainLayout,
  MarkdownPage,
  MinimalLayout,
} from "@digitalaidseattle/mui";
import { AiProjectsPage } from './pages/content-generation/AiProjectsPage';
import InstitutionsPage from "./pages/institutions";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout sx={{ p: 1 }} />,
    children: [
      {
        path: "",
        element: <AiProjectsPage />,
      },
      {
        path: "institutions",
        element: <InstitutionsPage />,
      },
      {
        path: "ai-projects/:id",
        element: <ProjectPage listPath={"ai-projects"} />,
      }, {
        path: "ai-projects",
        element: <AiProjectsPage />,
      },
      {
        path: "privacy",
        element: <MarkdownPage filepath='privacy.md' />,
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
