/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
// project import
import { AuthServiceProvider, UserContextProvider, RefreshContextProvider } from "@digitalaidseattle/core";
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';

import "./App.css"
import { SupabaseAuthService } from "./supabase/authService";
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (
    <>
      <AuthServiceProvider authService={new SupabaseAuthService()} >
        <UserContextProvider>
          <RefreshContextProvider>
            <RouterProvider router={router} />
          </RefreshContextProvider>
        </UserContextProvider>
      </AuthServiceProvider>
    </>
  );
}

export default App;
