/**
 *  AuthServiceContext.ts
 * 
 *  Method to broadcast an refresh signal.
 *  Combining with useInterval creates a central polling mechanism
 * 
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { createContext } from 'react';
import { User } from '../api/AuthService';

// Create a context for the dependency
export const UserContext = createContext<User | null>(null);
