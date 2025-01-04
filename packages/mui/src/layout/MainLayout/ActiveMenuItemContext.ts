/**
 *  ActiveMenuItemContext.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from "react";

interface MenuItemContextType {
    activeMenuItem: string | null;
    setActiveMenuItem: (menuItem: string | null) => void;
}

export const ActiveMenuItemContext = React.createContext<MenuItemContextType>({
    activeMenuItem: null,
    setActiveMenuItem: () => { }
});

