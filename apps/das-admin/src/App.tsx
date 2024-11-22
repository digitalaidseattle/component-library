/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// project import
import { AuthServiceProvider, RefreshContextProvider, UserContextProvider } from "@digitalaidseattle/core";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";

import "./App.css";
import { routes } from './routes';
import { Config } from "./Config";
import { SupabaseAuthService } from "./supabase/authService";

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  
  return (
    <>
      <AuthServiceProvider authService={new SupabaseAuthService()} >
        <LayoutConfigurationProvider configuration={Config}>
          <UserContextProvider>
            <RefreshContextProvider>
              <RouterProvider router={router} />
            </RefreshContextProvider>
          </UserContextProvider>
        </LayoutConfigurationProvider>
      </AuthServiceProvider>
    </>
  );
}

export default App;
