/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PREVIEW?: string;
  readonly VITE_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
