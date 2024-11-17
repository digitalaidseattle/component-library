/**
 *  LoadingContext.tsx
 * 
 *  Provides application wide loading indicator
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { createContext, useState } from 'react';

interface LoadingContextType {
    loading: boolean,
    setLoading: (loading: boolean) => void
}

export const LoadingContext = createContext<LoadingContextType>({
    loading: false,
    setLoading: () => { }
});

interface Props {
    children: React.ReactNode;
}

export const LoadingContextProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};