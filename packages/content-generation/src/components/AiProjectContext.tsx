/**
 * ProjectContext.tsx
 * 
 * @copyright 2025 Digital Aid Seattle
*/
import React from "react";
import { Project } from "../services/types";

interface AiProjectContextType {
    project: Project,
    setProject: (t: Project) => void
}

export const AiProjectContext = React.createContext<AiProjectContextType>({
    project: {} as Project,
    setProject: () => { }
});

