/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// project import
import { AuthServiceProvider, UserContextProvider } from "@digitalaidseattle/core";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";
import { SupabaseAuthService } from "@digitalaidseattle/supabase";

import "./App.css";
import { Config } from "./Config";
import { routes } from './routes';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);

const App: React.FC = () => {

  return (
    <>
      <AuthServiceProvider authService={new SupabaseAuthService()} >
        <UserContextProvider>
          <LayoutConfigurationProvider configuration={Config}>
            <RouterProvider router={router} />
          </LayoutConfigurationProvider>
        </UserContextProvider>
      </AuthServiceProvider>
    </>
  );
}

export default App;
