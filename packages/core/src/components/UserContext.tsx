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

export interface UserContextType {
    user: User | undefined,
    setUser: (user: User) => void
}

export const UserContext = createContext<UserContextType>({
    user: undefined,
    setUser: (_user: User) => { }
});

export const UserContextProvider = (props: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>();

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props.children}
        </UserContext.Provider>
    );
};
