import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  AuthServiceProvider,
  HelpContextProvider,
  UserContextProvider,
} from "@digitalaidseattle/core";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";
import "./App.css";
import { Config } from "./Config";
import { routes } from "./routes";
import { configureCoreServices, surveyAppServices } from "./services/appServices";

configureCoreServices();

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (
    <AuthServiceProvider authService={surveyAppServices.authService}>
      <UserContextProvider>
        <HelpContextProvider>
          <LayoutConfigurationProvider configuration={Config()}>
            <RouterProvider router={router} />
          </LayoutConfigurationProvider>
        </HelpContextProvider>
      </UserContextProvider>
    </AuthServiceProvider>
  );
};

export default App;
