/**
 *  HelpContext.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

interface HelpContexType {
    showHelp: boolean,
    setShowHelp: (c: boolean) => void
}

export const HelpContext = createContext<HelpContexType>({
    showHelp: false,
    setShowHelp: () => { }
});

export const HelpContextProvider = (props: { children: React.ReactNode }) => {
    const [showHelp, setShowHelp] = useState<boolean>(false);

    useEffect(() => {
        console.log(showHelp)
    }, [showHelp])
    return (
        <HelpContext.Provider value={{ showHelp, setShowHelp }}>
            {props.children}
        </HelpContext.Provider>
    )
};

// Hook to use the dependency
export const useHelp = () => {
    const ctx = useContext(HelpContext);
    if (!ctx) throw new Error("useHelp must be used within a HelpContextProvider");
    return ctx;
};