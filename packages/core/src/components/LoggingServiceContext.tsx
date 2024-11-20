/**
 *  LogginServiceContext.ts
 * 
 *  Method to broadcast an refresh signal.
 *  Combining with useInterval creates a central polling mechanism
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { ReactNode, createContext, useContext } from 'react';
import { ConsoleLoggingService, LoggingService } from '../api';

// Create a context for the dependency
// If provider not invoked, the default console logging will be used.
const LogginServiceContext = createContext<LoggingService>(new ConsoleLoggingService());

export const LoggingServiceProvider: React.FC<{ service: LoggingService, children: ReactNode }> = ({ service, children }) => (
    <LogginServiceContext.Provider value={service}>
        {children}
    </LogginServiceContext.Provider>
);

// Hook to use the dependency
export const useLoggingService = () => {
    return useContext(LogginServiceContext);
};