/**
 *  loggingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 * 
 * <ul>
 * <li>Logging service currently writes to console.</li>
 * <li>Production services could write to a remote service. Include severity as part of payload.</li>
 * <li>An enhancement would be to enable various severities.</li>
 * </ul>
 *
 */


const NO_USER = '<no user>';

interface LoggingService {

    info(message?: string, ...optionalParams: any[]): void;

    warn(message?: string, ...optionalParams: any[]): void;

    error(message?: string, ...optionalParams: any[]): void;
}

class ConsoleLoggingService implements LoggingService {

    enabled = false;

    info(message?: string, ...optionalParams: any[]) {
        if (this.enabled) {
            console.info(message, optionalParams);
        }
    }

    warn(message?: string, ...optionalParams: any[]) {
        if (this.enabled) {
            console.warn(message, optionalParams);
        }
    }

    error(message?: string, ...optionalParams: any[]) {
        if (this.enabled) {
            console.error(message, optionalParams);
        }
    }
}

export { ConsoleLoggingService };
export type { LoggingService };

