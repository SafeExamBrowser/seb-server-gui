import { useRules } from "vuetify/labs/rules";
import type { VInput } from "vuetify/components";
import type { z } from "zod";

type VInputProps = InstanceType<typeof VInput>["$props"];
type ValidationRules = NonNullable<VInputProps["rules"]>;
type ValidationRule = ValidationRules[number];

const unwrap = (schema: z.ZodType): z.ZodType =>
    schema instanceof Object &&
    "unwrap" in schema &&
    typeof schema.unwrap === "function"
        ? (schema.unwrap() as z.ZodType)
        : schema;

export const useZodFormRules = () => {
    const rules = useRules();

    const isRequired = (schema: z.ZodType): boolean => !schema.isOptional();

    const lengthRules = (schema: z.ZodType): ValidationRules => {
        const inner = unwrap(schema);
        const out: ValidationRule[] = [];
        if (!(inner instanceof Object && "minLength" in inner)) {
            return out;
        }
        const stringSchema = inner as z.ZodString;
        if (
            typeof stringSchema.minLength === "number" &&
            stringSchema.minLength > 0
        ) {
            out.push(rules.minLength(stringSchema.minLength));
        }
        if (typeof stringSchema.maxLength === "number") {
            out.push(rules.maxLength(stringSchema.maxLength));
        }
        return out;
    };

    const formatRules = (schema: z.ZodType): ValidationRules => {
        const inner = unwrap(schema) as z.ZodType & { format?: unknown };
        if (inner.format === "email") {
            return [rules.email()];
        }
        return [];
    };

    return { isRequired, lengthRules, formatRules };
};
