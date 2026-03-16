/**
 *  RefreshContext.ts
 * 
 *  Method to broadcast an refresh signal.
 *  Combining with useInterval creates a central polling mechanism
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { createContext, useEffect, useState } from 'react';

export const useInterval = (callback: Function, delay: number | null) => {
    useEffect(() => {
        if (delay !== null) {
            const id = setInterval(callback, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

interface RefreshContextType {
    refresh: number,
    setRefresh: (refresh: number) => void
}

export const RefreshContext = createContext<RefreshContextType>({
    refresh: 0,
    setRefresh: () => { }
});

export const RefreshContextProvider = (props: { secondsDelay?: number, children: React.ReactNode }) => {
    const [refresh, setRefresh] = useState(Date.now());

    useInterval(() => {
        setRefresh(Date.now());
    }, (props.secondsDelay && props.secondsDelay > 0) ? 1000 * props.secondsDelay : null);

    return (
        <RefreshContext.Provider value={{ refresh, setRefresh }}>
            {props.children}
        </RefreshContext.Provider>
    );
};
