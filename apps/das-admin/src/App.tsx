/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
// project import
import { RefreshContextProvider } from "@digitalaidseattle/core";
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './pages/routes';

import "./App.css"
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (
    <>
        <RefreshContextProvider>
          <RouterProvider router={router} />
        </RefreshContextProvider>
    </>
  );
}

export default App;
