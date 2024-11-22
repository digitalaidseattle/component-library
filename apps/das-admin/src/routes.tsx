import { Login, MainLayout, MinimalLayout } from "@digitalaidseattle/mui";
import { DragAndDropExample } from "./pages/DragAndDropExample";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <div >TEST</div>,
      },
      {
        path: "test",
        element: <div >TEST</div>,
      },
      {
        path: "draganddrop",
        element: <DragAndDropExample />,
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
  }
];

export { routes };
