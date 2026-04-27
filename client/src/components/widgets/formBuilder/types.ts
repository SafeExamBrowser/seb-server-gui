import { Ref } from "vue";
import type { VField, VInput, VTextField } from "vuetify/components";

type VFieldProps = InstanceType<typeof VField>["$props"];
type VInputProps = InstanceType<typeof VInput>["$props"];
type VTextFieldProps = InstanceType<typeof VTextField>["$props"];

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
    Pick<VFieldProps, "variant"> & {
        disabled?: boolean;
    };

export type FormFieldTextualProperties = Pick<VTextFieldProps, "placeholder">;

type FormFieldBase = {
    name: string;
    label: string;
    rules?: VInputProps["rules"];
    info?: string;
    validationDependsOn?: string[];
    disabled?: boolean;
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
              unit?: string;
              model: Ref<number | undefined>;
          }
        | {
              type: "color";
              placeholder?: string;
              required?: boolean;
              model: Ref<string | undefined>;
          }
        | {
              type: "password";
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
        | {
              type: "file";
              required?: boolean;
              model: Ref<File | undefined>;
              acceptExtensions: string[];
              icon?: string;
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

export type FormFieldsComponentProps = {
    fields: FormField[];
    layout?: "vertical" | "horizontal";
};
