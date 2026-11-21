
/**
 *  Configuration.ts
 *
 *  @copyright 2026 Digital Aid Seattle
 *
 */

import { AuthService, ConsoleLoggingService, LoggingService, StorageService } from "./api";

// Avoid importing from the monorepo package to prevent TypeScript "rootDir" errors.
// Provide a lightweight local declaration for the DataAccessObject used here.

export type ConfigurationProps = {
    authService?: AuthService;
    storageService?: StorageService;
    loggingService?: LoggingService;
}

export class Configuration {

    private static instance: Configuration;

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            throw new Error('Program Management System needs to be configured.');
        }
        return Configuration.instance;
    }

    static props(props: ConfigurationProps) {
        Configuration.instance = new Configuration(props);
    }

    authService: AuthService | undefined;
    storageService: StorageService | undefined;
    loggingService: LoggingService | undefined;

    constructor(props: ConfigurationProps) {
        this.authService = props.authService;
        this.storageService = props.storageService;
        this.loggingService = props.loggingService ?? new ConsoleLoggingService();
    }

    getAuthService(): AuthService | undefined {
        return this.authService;
    }

    getStorageService(): StorageService | undefined {
        return this.storageService;
    }

    getLoggingService(): LoggingService | undefined {
        return this.loggingService;
    }

}