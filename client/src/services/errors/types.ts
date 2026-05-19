export type APIMessage = {
    messageCode: string;
    systemMessage?: string;
    details?: string;
    attributes?: string[];
};

export type BackendFieldError = {
    apiMessage: APIMessage;
    domain?: string;
    backendField?: string;
    frontendField?: string;
    rule?: string;
    ruleParams: string[];
};

export type AppError =
    | {
          kind: "backend";
          status?: number;
          method?: string;
          url?: string;
          messages: APIMessage[];
          fieldErrors: BackendFieldError[];
          globalMessages: APIMessage[];
          raw: unknown;
      }
    | {
          kind: "rate-limit";
          status: 429;
          code?: string;
          method?: string;
          url?: string;
          raw: unknown;
      }
    | {
          kind: "network";
          message: string;
          method?: string;
          url?: string;
          raw: unknown;
      }
    | {
          kind: "unknown";
          message: string;
          status?: number;
          method?: string;
          url?: string;
          raw: unknown;
      };

export type BackendFieldAliasMap = Record<string, string>;
export type BackendFieldErrorMap = Record<string, string[]>;
