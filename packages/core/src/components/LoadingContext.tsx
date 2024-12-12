/**
 *  LoadingContext.tsx
 * 
 *  Provides application wide loading indicator
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { createContext, useState } from 'react';

export interface LoadingContextType {
    loading: boolean,
    setLoading: (l: boolean) => void
}

export const LoadingContext = createContext<LoadingContextType>({
    loading: false,
    setLoading: () => { }
});

export const LoadingContextProvider = (props: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {props.children}
        </LoadingContext.Provider>
    );
};
