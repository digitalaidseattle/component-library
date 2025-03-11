/// <reference types="vite/client" />
// 
interface ImportMetaEnv {
    readonly VITE_AIRTABLE_ANON_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
