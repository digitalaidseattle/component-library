/**
 *  DrawerOpenContext.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from "react";

interface DrawerOpenContextType {
    drawerOpen: boolean,
    setDrawerOpen: (open: boolean) => void
}

export const DrawerOpenContext = React.createContext<DrawerOpenContextType>({
    drawerOpen: false,
    setDrawerOpen: () => { }
});

