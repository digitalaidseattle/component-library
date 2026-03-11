/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Typography } from '@mui/material';

// project import
import {
  AuthServiceProvider,
  HelpContextProvider,
  setCoreServices,
  UserContextProvider
} from "@digitalaidseattle/core";
import { FirebaseAuthService, firebaseClient, FirebaseStorageService } from "@digitalaidseattle/firebase";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";

import {
  GeminiAiService,
  GeminiContentService,
  GeminiProjectService,
  setContentGenerationServices,
  setGeminiConfiguration,
  TransactionService
} from '@digitalaidseattle/content-generation';
import "./App.css";
import { Config } from './Config';
import { routes } from './routes';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);
const authService = new FirebaseAuthService(firebaseClient);
const storageService = new FirebaseStorageService(firebaseClient);




const App: React.FC = () => {

  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    try {
      setCoreServices({
        authService: authService,
        storageService: storageService
      });

      setGeminiConfiguration({
        storage_folder: import.meta.env.VITE_FIREBASE_STORAGE_FOLDER,
        firebase_options:
        {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
          measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
        }
      })

      setContentGenerationServices({
        aiService: GeminiAiService.getInstance(),
        projectService: GeminiProjectService.getInstance(),
        projectContentService: GeminiContentService.getInstance(),
        projectTransactionService: TransactionService.getInstance()
      })
      setInitialized(true);
    } catch (error) {
      console.error(error);
    }
  }, [])
  return (
    <>
      <AuthServiceProvider authService={authService} >
        <UserContextProvider>
          <HelpContextProvider>
            <LayoutConfigurationProvider configuration={Config()}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {initialized && <RouterProvider router={router} />}
                {!initialized && <Typography>Application not configured.</Typography>}
              </LocalizationProvider>
            </LayoutConfigurationProvider>
          </HelpContextProvider>
        </UserContextProvider>
      </AuthServiceProvider>
    </>
  );
}

export default App;
