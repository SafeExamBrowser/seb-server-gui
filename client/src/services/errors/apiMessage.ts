import type { ApiMessage } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { ErrorCode } from "@/api/seb-server/generated/hey-api/types.gen.ts";

export type APIMessage = ApiMessage;

export const FIELD_VALIDATION_CODE = ErrorCode.FIELD_VALIDATION;
