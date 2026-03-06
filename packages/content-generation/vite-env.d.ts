/// <reference types="vite/client" />
// 
interface ImportMetaEnv {
  readonly VITE_LOGGING: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}