

import { AuthService, ConsoleLoggingService, LoggingService, StorageService } from "@digitalaidseattle/core";

export interface CoreServices {
  authService?: AuthService;
  storageService?: StorageService;
  loggingService?: LoggingService;
}

let services: CoreServices;

export function setCoreServices(s: CoreServices) {
  services = s;
}

export function getCoreServices() {
  if (!services) {
    services = {
      loggingService: new ConsoleLoggingService()
    } as unknown as CoreServices;
  }
  return services;
}