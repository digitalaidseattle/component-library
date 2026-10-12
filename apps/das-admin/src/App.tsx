/**
 *  App.tsx
 *
 *  @copyright 2026 Digital Aid Seattle
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
  SupabaseConfiguration
} from "@digitalaidseattle/supabase";

import "./App.css";

import {
  FirebaseAuthService,
  Configuration as FirebaseConfiguration,
  FirebaseStorageService
} from '@digitalaidseattle/firebase';
import { Configuration as ProgramManagmentConfigucation } from "@digitalaidseattle/program-management";
import { Configuration as SuperhumanConfiguration } from "@digitalaidseattle/superhuman";

import { Config } from './Config';
import { ProfileDao, ProgramDao } from './pages/program-management';
import { routes } from './routes';
import { NodeDao } from './pages/program-management/NodeDao';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App: React.FC = () => {
  const [initialized, setInitialized] = React.useState<boolean>(false);

  useEffect(() => {
    configure();
  }, []);

  function configure() {
    SuperhumanConfiguration.props({
      apiToken: import.meta.env.VITE_CODA_API_TOKEN,
      apiBase: import.meta.env.VITE_CODA_API_BASE
    });

    SupabaseConfiguration.props({
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
    });

    FirebaseConfiguration.props({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    });

    ProgramManagmentConfigucation.props(
      {
        profileDao: ProfileDao.getInstance(),
        programDao: ProgramDao.getInstance(),
        nodeDao: NodeDao.getInstance(),
      }
    )

    setCoreServices({
      authService: FirebaseAuthService.getInstance(),
      storageService: FirebaseStorageService.getInstance()
    })
    setInitialized(true);
  }

  return (initialized &&
    <AuthServiceProvider authService={FirebaseAuthService.getInstance()} >
      <StorageServiceProvider storageService={FirebaseStorageService.getInstance()} >
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
