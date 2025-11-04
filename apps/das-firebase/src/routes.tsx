import { RouteObject } from 'react-router-dom';

import {
  Error,
  Login,
  MainLayout,
  MarkdownPage,
  MinimalLayout,
} from "@digitalaidseattle/mui";
import DonationsPage from "./pages/donations";
import GrantPage from "./pages/grant";
import GrantsPage from "./pages/grants";
import InstitutionsPage from "./pages/institutions";
import ProjectsPage from "./pages/projects";
import TestPage from './pages/TestPage';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout sx={{ p: 1 }} />,
    children: [
      {
        path: "",
        element: <GrantsPage />,
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
        path: "grant-proposal/:id",
        element: <GrantPage />,
      }, {
        path: "grant-proposals",
        element: <GrantsPage />,
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
