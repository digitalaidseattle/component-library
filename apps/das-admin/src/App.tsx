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
  setConfiguration,
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
  setConfiguration(
    {
      supabaseClient: createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      )
    }
  )

  setCoreServices({
    authService: SupabaseAuthService.getInstance(),
    storageService: SupabaseStorageService.getInstance()
  })

  return (
    <>
      <AuthServiceProvider authService={SupabaseAuthService.getInstance()} >
        <StorageServiceProvider storageService={SupabaseStorageService.getInstance()} >
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
