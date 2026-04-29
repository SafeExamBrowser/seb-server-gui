export interface BackendError {
    messageCode: string;
    systemMessage: string;
    details?: string;
    attributes?: string[];
}
export type BackendErrorArray = BackendError[];
