/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// project import
import {
  AuthServiceProvider,
  HelpContextProvider,
  setCoreServices,
  UserContextProvider
} from "@digitalaidseattle/core";
import { FirebaseAuthService, firebaseClient, FirebaseStorageService } from "@digitalaidseattle/firebase";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";

import "./App.css";
import { Config } from './Config';
import { routes } from './routes';
import {
  GeminiAiService,
  GeminiContentService,
  GeminiProjectService,
  setContentGenerationServices,
  TransactionService
} from '@digitalaidseattle/content-generation';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);
const authService = new FirebaseAuthService(firebaseClient);
const storageService = new FirebaseStorageService(firebaseClient);

setCoreServices({
  authService: authService,
  storageService: storageService
});

setContentGenerationServices({
  aiService: new GeminiAiService(),
  projectService: new GeminiProjectService(),
  projectContentService: new GeminiContentService(),
  projectTransactionService: new TransactionService()
})
const App: React.FC = () => {

  return (
    <>
      <AuthServiceProvider authService={authService} >
        <UserContextProvider>
          <HelpContextProvider>
            <LayoutConfigurationProvider configuration={Config()}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <RouterProvider router={router} />
              </LocalizationProvider>
            </LayoutConfigurationProvider>
          </HelpContextProvider>
        </UserContextProvider>
      </AuthServiceProvider>
    </>
  );
}

export default App;
