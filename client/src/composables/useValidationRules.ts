import type { VInput } from "vuetify/components";
import { useRules } from "vuetify/labs/rules";

import i18n from "@/i18n";

type VInputProps = InstanceType<typeof VInput>["$props"];
type ValidationRules = NonNullable<VInputProps["rules"]>;
type ValidationRule = ValidationRules[number];

const localize =
    (
        rule: ValidationRule,
        key: string,
        params?: Record<string, unknown>,
    ): ValidationRule =>
    (value: unknown) => {
        const result = typeof rule === "function" ? rule(value) : rule;
        return result === true ? true : i18n.global.t(key, params ?? {});
    };

export const useValidationRules = () => {
    const rules = useRules();

    return {
        required: (): ValidationRule =>
            localize(rules.required(), "validation.required"),
        minLength: (min: number): ValidationRule =>
            localize(rules.minLength(min), "validation.minLength", { min }),
        maxLength: (max: number): ValidationRule =>
            localize(rules.maxLength(max), "validation.maxLength", { max }),
        email: (): ValidationRule =>
            localize(rules.email(), "validation.email"),
    };
};
