import { z } from "zod";

export function decodeWire<S extends z.ZodType>(
    schema: S,
    data: z.input<S>,
): z.output<S> {
    const result = z.safeDecode(schema, data);
    if (!result.success) {
        throw new Error(
            `Unexpected API response: ${z.prettifyError(result.error)}`,
            { cause: result.error },
        );
    }
    return result.data;
}

export function encodeWire<S extends z.ZodType>(
    schema: S,
    data: z.output<S>,
): z.input<S> {
    const result = z.safeEncode(schema, data);
    if (!result.success) {
        throw new Error(
            `Could not serialize API request: ${z.prettifyError(result.error)}`,
            { cause: result.error },
        );
    }
    return result.data;
}
