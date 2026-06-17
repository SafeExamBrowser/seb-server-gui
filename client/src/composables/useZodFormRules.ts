import type { VInput } from "vuetify/components";
import { z } from "zod";
import { useValidationRules } from "@/composables/useValidationRules.ts";

type VInputProps = InstanceType<typeof VInput>["$props"];
type ValidationRules = NonNullable<VInputProps["rules"]>;
type ValidationRule = ValidationRules[number];

type UnwrappableSchema = z.ZodType & { unwrap: () => z.ZodType };

const WRAPPER_TYPES = new Set([
    "optional",
    "nullable",
    "nonoptional",
    "default",
    "readonly",
    "catch",
]);

const typeTag = (schema: z.ZodType): string | undefined => {
    if (!("def" in schema)) {
        return undefined;
    }
    const def = schema.def;
    if (typeof def !== "object" || def === null || !("type" in def)) {
        return undefined;
    }
    return typeof def.type === "string" ? def.type : undefined;
};

const isUnwrappableSchema = (schema: z.ZodType): schema is UnwrappableSchema =>
    "unwrap" in schema && typeof schema.unwrap === "function";

type PipeSchema = z.ZodType & { def: { out: z.ZodType } };

const isPipeSchema = (schema: z.ZodType): schema is PipeSchema => {
    if (typeTag(schema) !== "pipe") {
        return false;
    }
    const def = schema.def;
    return (
        typeof def === "object" &&
        def !== null &&
        "out" in def &&
        def.out instanceof z.ZodType
    );
};

const unwrap = (schema: z.ZodType): z.ZodType => {
    let current = schema;
    for (;;) {
        if (
            WRAPPER_TYPES.has(typeTag(current) ?? "") &&
            isUnwrappableSchema(current)
        ) {
            current = current.unwrap();
            continue;
        }
        // codecs are pipes; the app-facing constraints live on the out side
        if (isPipeSchema(current)) {
            current = current.def.out;
            continue;
        }
        return current;
    }
};

export const useZodFormRules = () => {
    const rules = useValidationRules();

    const isRequired = (schema: z.ZodType): boolean => !schema.isOptional();

    const lengthRules = (schema: z.ZodType): ValidationRules => {
        const inner = unwrap(schema);
        const out: ValidationRule[] = [];
        if (typeTag(inner) !== "string") {
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
        if (typeTag(inner) !== "string") {
            return [];
        }
        const format = "format" in inner ? inner.format : undefined;
        if (format === "email") {
            return [rules.email()];
        }
        return [];
    };

    const fieldRules = (schema: z.ZodType): ValidationRules => [
        ...lengthRules(schema),
        ...formatRules(schema),
    ];

    return { isRequired, fieldRules };
};
