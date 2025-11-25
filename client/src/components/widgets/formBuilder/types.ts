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
    Pick<VFieldProps, "variant">;

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

export type FormFieldCollection<TCollectionItem = unknown> = FormFieldBase & {
    type: "collection";
    required?: boolean;
    model: Ref<TCollectionItem[]>;
    fieldGroups: FormFieldGroup[];
};

export type FormField = FormFieldSimple | FormFieldCollection<unknown>;

export type FormFieldGroup = FormFieldSimple[];
