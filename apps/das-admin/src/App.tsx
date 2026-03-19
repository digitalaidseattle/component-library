/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

import {
  AuthServiceProvider,
  RefreshContextProvider,
  setCoreServices,
  StorageServiceProvider,
  UserContextProvider
} from "@digitalaidseattle/core";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";
import {
  setConfiguration as setSupabaseConfiguration,
  SupabaseAuthService,
  SupabaseStorageService
} from "@digitalaidseattle/supabase";

// project import
import "./App.css";
import { Config } from "./Config";
import { routes } from './routes';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  const supabaseClient = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
  const authService = new SupabaseAuthService(supabaseClient)
  const storageService = new SupabaseStorageService()

  setSupabaseConfiguration(
    {
      supabaseClient: supabaseClient
    }
  )

  setCoreServices(
    {
      authService: authService,
      storageService: storageService
    }
  )

  return (
    <>
      <AuthServiceProvider authService={authService} >
        <StorageServiceProvider storageService={storageService} >
          <RefreshContextProvider>
            <UserContextProvider>
              <LayoutConfigurationProvider configuration={Config}>
                <RouterProvider router={router} />
              </LayoutConfigurationProvider>
            </UserContextProvider>
          </RefreshContextProvider>
        </StorageServiceProvider>
      </AuthServiceProvider>
    </>
  );
}

export default App;
