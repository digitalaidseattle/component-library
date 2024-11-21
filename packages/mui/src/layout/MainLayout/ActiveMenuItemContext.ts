/**
 *  ActiveMenuItemContext.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { createContext } from "react";

interface MenuItemContextType {
    activeMenuItem: string | null;
    setActiveMenuItem: (menuItem: string | null) => void;
}

export const ActiveMenuItemContext = createContext<MenuItemContextType>({
    activeMenuItem: null,
    setActiveMenuItem: () => { }
});

