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
import { NodePage, ProgramPage, ProgramsPage } from '@digitalaidseattle/program-management';
import { FundersPage } from './grant-tracking/pages/Funders';
import { AiProjectsPage } from './pages/content-generation/AiProjectsPage';
import { GrantProgramsPage } from './grant-tracking/pages/Programs';
import { VentureTrackingPage } from './venture-evaluation/pages/VentureTracking';
import { VentureDebriefsPage } from './venture-evaluation/pages/VentureDebriefs';
import { VentureTrackingDetails } from './venture-evaluation/pages/VentureTrackingDetails';

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
        path: "ai-projects/:id",
        element: <ProjectPage listPath={"ai-projects"} />,
      }, {
        path: "ai-projects",
        element: <AiProjectsPage />,
      },
      {
        path: "privacy",
        element: <MarkdownPage filepath='privacy.md' />,
      },
      {
        path: "programs",
        element: <ProgramsPage />,
      },
      {
        path: "programs/:id",
        element: <ProgramPage />,
      },
      {
        path: "programs/:program_id/nodes/:node_no",
        element: <NodePage />,
      },
      {
        path: "funders",
        element: <FundersPage />,
      },
      {
        path: "grant-programs",
        element: <GrantProgramsPage />,
      },
    ]
  },
  {
    path: "/venture-evaluation",
    element: <MainLayout sx={{ p: 1 }} />,
    children: [
      {
        path: 'programs',
        element: <VentureTrackingPage />
      },
      {
        path: "programs/:id",
        element: <VentureTrackingDetails />,
      },
      {
        path: "programs/:program_id/nodes/:node_no",
        element: <NodePage />,
      },
      {
        path: "debriefs",
        element: <VentureDebriefsPage />,
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
