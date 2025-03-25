import {
  Error,
  Login,
  MainLayout,
  MarkdownPage,
  MinimalLayout,
} from "@digitalaidseattle/mui";
import StaffingPage from "./pages/staffing";
import VenturesPage from "./pages/ventures";
import VenturePage from "./pages/venture";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <StaffingPage />,
      },
      {
        path: "ventures",
        element: <VenturesPage />,
      },
      {
        path: "venture/:id",
        element: <VenturePage />,
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
