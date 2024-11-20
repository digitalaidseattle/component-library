/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
// project import
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './pages/routes';

import { AuthServiceProvider, RefreshContextProvider } from "@digitalaidseattle/core";

import "./App.css"
import { SupabaseAuthService } from "./supabase/authService";
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (
    <>
      <AuthServiceProvider authService={new SupabaseAuthService()} >
        <RefreshContextProvider>
          <RouterProvider router={router} />
        </RefreshContextProvider>
      </AuthServiceProvider>
    </>
  );
}

export default App;
