import {
  Error,
  Login,
  MainLayout,
  MarkdownPage,
  MinimalLayout,
} from "@digitalaidseattle/mui";
import GrantsPage from "./pages/grants";
import InstitutionsPage from "./pages/institutions";
import ProjectsPage from "./pages/projects";
import DonationsPage from "./pages/donations";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <ProjectsPage />,
      },
      {
        path: "instituitions",
        element: <InstitutionsPage />,
      },
      {
        path: "grant-proposals",
        element: <GrantsPage />,
      }, {
        path: "donations",
        element: <DonationsPage />,
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
