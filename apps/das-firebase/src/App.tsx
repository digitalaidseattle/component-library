/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// project import
import {
  AuthServiceProvider,
  StorageServiceProvider,
  UserContextProvider
} from "@digitalaidseattle/core";
import { FirebaseAuthService, FirebaseStorageService } from "@digitalaidseattle/firebase";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";

import "./App.css";
import { routes } from './routes';
import { Config } from './Config';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);

const App: React.FC = () => {

  return (
    <>
      <AuthServiceProvider authService={new FirebaseAuthService()} >
        <StorageServiceProvider storageService={new FirebaseStorageService()} >
          <UserContextProvider>
            <LayoutConfigurationProvider configuration={Config}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <RouterProvider router={router} />
              </LocalizationProvider>
            </LayoutConfigurationProvider>
          </UserContextProvider>
        </StorageServiceProvider>
      </AuthServiceProvider>
    </>
  );
}

export default App;
