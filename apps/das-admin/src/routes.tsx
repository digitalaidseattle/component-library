import { Login, MainLayout, MinimalLayout } from "@digitalaidseattle/mui";
import { DragAndDropExample } from "./pages/DragAndDropExample";
import { Test } from "./pages/Test";

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
