import { Login, MinimalLayout } from "@digitalaidseattle/mui";

const routes = [

  {
    path: "/",
    element: <MinimalLayout />,
    children: [
      {
        path: '',
        element: <div >TEST</div>
      },
      {
        path: 'login',
        element: <Login />
      }
    ]
  }
];

export { routes };
