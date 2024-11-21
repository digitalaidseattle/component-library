/**
 *  AuthServiceContext.ts
 * 
 *  Method to broadcast an refresh signal.
 *  Combining with useInterval creates a central polling mechanism
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../api/AuthService';

// Create a context for the dependency
const AuthServiceContext = createContext<AuthService | null>(null);

export const AuthServiceProvider: React.FC<{ authService: AuthService, children: ReactNode }> = ({ authService, children }) => (
    <AuthServiceContext.Provider value={authService}>
        {children}
    </AuthServiceContext.Provider>
);

// Hook to use the dependency
export const useAuthService = () => {
    const context = useContext(AuthServiceContext);
    if (!context) throw new Error("AuthService must be used within AuthServiceProvider");
    return context;
};