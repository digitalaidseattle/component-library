/**
 *  AuthServiceContext.ts
 * 
 *  Method to broadcast an refresh signal.
 *  Combining with useInterval creates a central polling mechanism
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { createContext, useState } from 'react';
import { User } from '../api/AuthService';

// Create a context for the dependency
export const UserContext = createContext<User | null>(null);

interface Props {
    children: React.ReactNode;
}

export const UserContextProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<User | undefined>();

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};