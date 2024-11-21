/**
 *  App.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
// project import
import { AuthServiceProvider, UserContextProvider, RefreshContextProvider } from "@digitalaidseattle/core";
import { LayoutConfigurationProvider } from "@digitalaidseattle/mui";
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';

import logo from "./assets/logo-light-icon.svg";
import {
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';

const icons = {
  CalendarOutlined,
  UserOutlined
};

import "./App.css"
import { SupabaseAuthService } from "./supabase/authService";
import Notification from "./Notification";
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  const config = {
    appName: 'DAS',
    logoUrl: logo,
    drawerWidth: 240,
    menuItems: [{
      id: 'group-main',
      title: 'DAS Admin',
      type: 'group',
      children: [
        {
          id: 'test',
          title: 'Test',
          type: 'item',
          url: '/test',
          icon: icons.CalendarOutlined,
          breadcrumbs: false
        },
        {
          id: 'drapanddrop',
          title: 'Drag And Drop',
          type: 'item',
          url: '/draganddrop',
          icon: icons.UserOutlined,
          breadcrumbs: false
        }
      ]
    }],
    toolbarItems: [
      <Notification key={1} />
    ]
  }
  return (
    <>
      <AuthServiceProvider authService={new SupabaseAuthService()} >
        <LayoutConfigurationProvider configuration={config}>
          <UserContextProvider>
            <RefreshContextProvider>
              <RouterProvider router={router} />
            </RefreshContextProvider>
          </UserContextProvider>
        </LayoutConfigurationProvider>
      </AuthServiceProvider>
    </>
  );
}

export default App;
