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
  UserContextProvider
} from "@digitalaidseattle/core";
import { FirebaseAuthService } from "@digitalaidseattle/firebase";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";

import "./App.css";
import { Config } from './Config';
import { routes } from './routes';
import { HelpContextProvider } from './components/HelpContext';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);

const App: React.FC = () => {

  return (
    <>
      <AuthServiceProvider authService={new FirebaseAuthService()} >
        <UserContextProvider>
          <LayoutConfigurationProvider configuration={Config()}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <HelpContextProvider>
                <RouterProvider router={router} />
              </HelpContextProvider>
            </LocalizationProvider>
          </LayoutConfigurationProvider>
        </UserContextProvider>
      </AuthServiceProvider>
    </>
  );
}

export default App;
