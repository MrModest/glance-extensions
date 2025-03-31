declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP__PORT?: number;
      TODOIST__TOKEN: string;
    }
  }
}

export {};
