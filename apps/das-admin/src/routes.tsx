import {
  Error,
  Login,
  MainLayout,
  MarkdownPage,
  MinimalLayout,
} from "@digitalaidseattle/mui";
import { DragAndDropExample } from "./pages/DragAndDropExample";
import { Test } from "./pages/Test";
import MapPage from "./pages/maps/MapPage";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <div>Home</div>,
      },
      {
        path: "test",
        element: <Test />,
      },
      {
        path: "draganddrop",
        element: <DragAndDropExample />,
      },
      {
        path: "maps",
        element: <MapPage />,
      },
      {
        path: "privacy",
        element: <MarkdownPage  filepath='privacy.md'/>,
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
