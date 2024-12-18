/**
 *  StorageServiceContext.ts
 * 
 *  DI for storage context
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { ReactNode, createContext, useContext } from 'react';
import { LocalStorageService, StorageService } from '../api/StorageService';


// Create a context for the dependency
const StorageServiceContext = createContext<StorageService | null>(new LocalStorageService());

export const StorageServiceProvider: React.FC<{ storageService: StorageService, children: ReactNode }> = ({ storageService, children }) => (
    <StorageServiceContext.Provider value={storageService}>
        {children}
    </StorageServiceContext.Provider>
);

// Hook to use the dependency
export const useStorageService = () => {
    return useContext(StorageServiceContext);
};