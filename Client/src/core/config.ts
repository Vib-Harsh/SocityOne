declare global {
  interface ImportMetaEnv {
    readonly PORT?: string;
    readonly ENVIRONMENT?: string;
    readonly API_BASE_URL?: string;
    readonly API_KEY?: string;
    readonly APPLICATION_KEY?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

class Config {
  public readonly PORT: number;
  public readonly ENVIRONMENT: string;
  public readonly IS_DEV: boolean;
  public readonly BASE_URL: string;
  public readonly API_KEY: string;
  public readonly APPLICATION_KEY: string;
  constructor() {
    this.PORT = parseInt(import.meta.env.PORT || "5173", 10);
    this.ENVIRONMENT = import.meta.env.ENVIRONMENT || "development";
    this.BASE_URL = import.meta.env.API_BASE_URL || "";
    this.API_KEY = import.meta.env.API_KEY || "";
    this.APPLICATION_KEY = import.meta.env.APPLICATION_KEY || "";

    this.IS_DEV = this.ENVIRONMENT.toLowerCase() === "development";

    if (this.IS_DEV) {
      if (!this.API_KEY) {
        console.warn(
          "⚠️ [Config Warning]: API_KEY is not defined in your environment variables.",
        );
      }
      if (!this.APPLICATION_KEY) {
        console.warn(
          "⚠️ [Config Warning]: APPLICATION_KEY is not defined in your environment variables.",
        );
      }
    }
  }
}

export const config = new Config();
export default config;
