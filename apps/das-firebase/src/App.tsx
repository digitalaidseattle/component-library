/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Typography } from '@mui/material';

// project import
import {
  AuthServiceProvider,
  HelpContextProvider,
  setCoreServices,
  UserContextProvider
} from "@digitalaidseattle/core";
import {
  FirebaseAuthService,
  Configuration as FirebaseConfiguration,
  FirebaseStorageService
} from "@digitalaidseattle/firebase";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";

import {
  Configuration as ContentGenerationConfiguration,
  TransactionService
} from '@digitalaidseattle/content-generation';

import {
  Configuration as GeminiConfiguration,
  GeminiAiService,
  GeminiContentService,
  GeminiProjectService
} from '@digitalaidseattle/content-generation/gemini';

import "./App.css";
import { Config } from './Config';
import { routes } from './routes';

const App: React.FC = () => {

  const [initialized, setInitialized] = React.useState<boolean>(false);

  useEffect(() => {
    configure();
  }, [])

  function configure() {

    FirebaseConfiguration.props({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    });

    GeminiConfiguration.props({
      storage_folder: import.meta.env.VITE_FIREBASE_STORAGE_FOLDER,
      apiKey: import.meta.env.VITE_GEMINI_API_KEY
    })

    ContentGenerationConfiguration.props({
      aiService: GeminiAiService.getInstance(),
      projectService: GeminiProjectService.getInstance(),
      projectContentService: GeminiContentService.getInstance(),
      projectTransactionService: TransactionService.getInstance()
    });

    setCoreServices({
      authService: FirebaseAuthService.getInstance(),
      storageService: FirebaseStorageService.getInstance()
    });
    setInitialized(true);

  };

  return (initialized &&
    <AuthServiceProvider authService={FirebaseAuthService.getInstance()} >
      <UserContextProvider>
        <HelpContextProvider>
          <LayoutConfigurationProvider configuration={Config}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {initialized && <RouterProvider router={createBrowserRouter(routes)} />}
              {!initialized && <Typography>Application not configured.</Typography>}
            </LocalizationProvider>
          </LayoutConfigurationProvider>
        </HelpContextProvider>
      </UserContextProvider>
    </AuthServiceProvider>
  );
}

export default App;
