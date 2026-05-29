import { useRules } from "vuetify/labs/rules";
import type { VInput } from "vuetify/components";
import type { z } from "zod";

type VInputProps = InstanceType<typeof VInput>["$props"];
type ValidationRules = NonNullable<VInputProps["rules"]>;
type ValidationRule = ValidationRules[number];

type UnwrappableSchema = z.ZodType & { unwrap: () => z.ZodType };

const isUnwrappableSchema = (schema: z.ZodType): schema is UnwrappableSchema =>
    schema instanceof Object &&
    "unwrap" in schema &&
    typeof schema.unwrap === "function";

const unwrap = (schema: z.ZodType): z.ZodType =>
    isUnwrappableSchema(schema) ? schema.unwrap() : schema;

export const useZodFormRules = () => {
    const rules = useRules();

    const isRequired = (schema: z.ZodType): boolean => !schema.isOptional();

    const lengthRules = (schema: z.ZodType): ValidationRules => {
        const inner = unwrap(schema);
        const out: ValidationRule[] = [];
        if (!(inner instanceof Object)) {
            return out;
        }
        const minLength = "minLength" in inner ? inner.minLength : undefined;
        const maxLength = "maxLength" in inner ? inner.maxLength : undefined;
        if (typeof minLength === "number" && minLength > 0) {
            out.push(rules.minLength(minLength));
        }
        if (typeof maxLength === "number") {
            out.push(rules.maxLength(maxLength));
        }
        return out;
    };

    const formatRules = (schema: z.ZodType): ValidationRules => {
        const inner = unwrap(schema);
        if (
            inner instanceof Object &&
            "format" in inner &&
            inner.format === "email"
        ) {
            return [rules.email()];
        }
        return [];
    };

    return { isRequired, lengthRules, formatRules };
};
