import { Login, MainLayout, MinimalLayout } from "@digitalaidseattle/mui";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <div >TEST</div>,
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
