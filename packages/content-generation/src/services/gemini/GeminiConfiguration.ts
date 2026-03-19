/**
 *  GeminiConfiguration.ts
 *
 *  IoC container for service access
 * 
 *  @copyright 2026 Digital Aid Seattle
 *
 */


import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";

export type GeminiConfiguration = {
  storage_folder: string;
  firebase_options: FirebaseOptions;
}

let configuration: GeminiConfiguration;
let firebaseApp: FirebaseApp;

export function setGeminiConfiguration(s: GeminiConfiguration) {
  configuration = s;
  firebaseApp = initializeApp(s.firebase_options);
}

export function getGeminiConfiguration(): GeminiConfiguration {
  return configuration;
}

export function getFirebaseApp(): FirebaseApp {
  return firebaseApp;
}