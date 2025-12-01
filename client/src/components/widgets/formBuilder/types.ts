import { Ref } from "vue";
import type {
    VField,
    VInput,
    VNumberInput,
    VTextField,
} from "vuetify/components";

type VFieldProps = InstanceType<typeof VField>["$props"];
type VInputProps = InstanceType<typeof VInput>["$props"];
type VTextFieldProps = InstanceType<typeof VTextField>["$props"];
type VNumberInputProps = InstanceType<typeof VNumberInput>["$props"];

export type FormFieldBaseProperties = Pick<
    VInputProps,
    | "ref"
    | "label"
    | "density"
    | "rules"
    | "hint"
    | "persistentHint"
    | "onUpdate:modelValue"
> &
    Pick<VFieldProps, "variant">;

export type FormFieldNumberProperties = Pick<VNumberInputProps, "min" | "max">;
export type FormFieldTextualProperties = Pick<VTextFieldProps, "placeholder">;

type FormFieldBase = {
    name: string;
    label: string;
    rules?: VInputProps["rules"];
    info?: string;
    validationDependsOn?: string[];
};

export type FormFieldSimple = FormFieldBase &
    (
        | {
              type: "text";
              placeholder?: string;
              required?: boolean;
              model: Ref<string | undefined>;
          }
        | {
              type: "textarea";
              placeholder?: string;
              required?: boolean;
              model: Ref<string | undefined>;
          }
        | {
              type: "number";
              placeholder?: string;
              required?: boolean;
              min?: number;
              max?: number;
              model: Ref<number | undefined>;
          }
        | {
              type: "color";
              placeholder?: string;
              required?: boolean;
              model: Ref<string | undefined>;
          }
        | {
              type: "select";
              placeholder?: string;
              required?: boolean;
              model: Ref<string | undefined>;
              options: { value: string; text: string }[];
          }
        | {
              type: "switch";
              model: Ref<boolean>;
          }
    );

export type FormFieldCollection = FormFieldBase & {
    type: "collection";
    required?: boolean;
    fieldGroups: FormFieldGroup[];
    labelAdd: string;
    labelRow: string;
    onAddItem: () => void;
    onRemoveItem: (itemIndex: number) => void;
};

export type FormField = FormFieldSimple | FormFieldCollection;

export type FormFieldGroup = {
    id: string;
    fields: FormFieldSimple[];
    removeDisabled: boolean;
};
