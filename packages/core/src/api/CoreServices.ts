// @deprecated Use Configuration directly

import { AuthService, ConsoleLoggingService, LoggingService, StorageService } from "@digitalaidseattle/core";
import { Configuration } from "../Configuration";

export interface CoreServices {
  authService?: AuthService;
  storageService?: StorageService;
  loggingService?: LoggingService;
}

export function setCoreServices(core: CoreServices) {
  Configuration.props(core);
}


export function getCoreServices(): CoreServices {
  return Configuration.getInstance();
}