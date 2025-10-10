/**
 *  HelpContext.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import React, { createContext, useContext, useState } from 'react';

// TODO library need ability to import CSS, PNG,  & SVG
// import {logo} from '../../assets/das-dark.png';

interface HelpContexType {
    showHelp: boolean,
    setShowHelp: (c: boolean) => void
}

export const HelpContext = createContext<HelpContexType>({
    showHelp: false,
    setShowHelp: (c: boolean) => { }
});

export const HelpContextProvider = (props: { children: React.ReactNode }) => {
    const [showHelp, setShowHelp] = useState<boolean>(false);

    return (
        <HelpContext.Provider value={{ showHelp, setShowHelp }
        }>
            {props.children}
        </HelpContext.Provider>
    )
};

// Hook to use the dependency
export const useHelp = () => {
    return useContext(HelpContext);
};