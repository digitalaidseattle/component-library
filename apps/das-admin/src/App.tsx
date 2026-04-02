/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import {
  AuthServiceProvider,
  RefreshContextProvider,
  setCoreServices,
  StorageServiceProvider,
  UserContextProvider
} from "@digitalaidseattle/core";
import { LayoutConfigurationProvider } from '@digitalaidseattle/mui';
import {
  SupabaseAuthService,
  SupabaseConfiguration,
  SupabaseStorageService
} from "@digitalaidseattle/supabase";

import "./App.css";
import { Config } from './Config';
import { routes } from './routes';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App: React.FC = () => {
  const [initialized, setInitialized] = React.useState<boolean>(false);


  useEffect(() => {
    configure();
  }, []);

  function configure() {
    SupabaseConfiguration.props({
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
    });

    setCoreServices({
      authService: SupabaseAuthService.getInstance(),
      storageService: SupabaseStorageService.getInstance()
    })
    setInitialized(true);
  }

  return (initialized &&
    <AuthServiceProvider authService={SupabaseAuthService.getInstance()} >
      <StorageServiceProvider storageService={SupabaseStorageService.getInstance()} >
        <RefreshContextProvider>
          <UserContextProvider>
            <LayoutConfigurationProvider configuration={Config}>
              <RouterProvider router={createBrowserRouter(routes)} />
            </LayoutConfigurationProvider>
          </UserContextProvider>
        </RefreshContextProvider>
      </StorageServiceProvider>
    </AuthServiceProvider>
  );
}

export default App;
