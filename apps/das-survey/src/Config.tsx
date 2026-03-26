import type { LayoutConfiguration } from "@digitalaidseattle/mui";
import packageJson from "../package.json";
import logo from "./assets/react.svg";
import { theme } from "./Theme";
import { surveyAppServices } from "./services/appServices";

export const Config = (): LayoutConfiguration => ({
  appName: "DAS Survey Module",
  version: packageJson.version,
  logoUrl: logo,
  drawerWidth: 280,
  theme,
  menuItems: [],
  toolbarItems: [],
  profileItems: [],
  authProviders: surveyAppServices.authService.getProviders(),
});
