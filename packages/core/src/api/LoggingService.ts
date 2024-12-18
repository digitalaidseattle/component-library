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

import { User } from './AuthService';

const NO_USER = '<no user>';

interface LoggingService {

    info(message: string, user?: User): void;

    warn(message: string, user?: User): void;

    error(message: string, user?: User): void;
}

class ConsoleLoggingService implements LoggingService {

    // FIXME
    enabled =  true; // import.meta.env.VITE_LOGGING ? import.meta.env.VITE_LOGGING : true;

    info(message: string, user?: User) {
        if (this.enabled) {
            console.info(user ? user.email : NO_USER, new Date(), message)
        }
    }

    warn(message: string, user?: User) {
        if (this.enabled) {
            console.warn(user ? user.email : NO_USER, new Date(), message)
        }
    }

    error(message: string, user?: User) {
        if (this.enabled) {
            console.error(user ? user.email : NO_USER, new Date(), message)
        }
    }
}

export { ConsoleLoggingService };
export type { LoggingService };
