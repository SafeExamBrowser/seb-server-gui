import { Ref } from "vue";
import type { VField, VInput, VTextField } from "vuetify/components";

import type { BackendFieldErrorMap } from "@/services/errors/types.ts";

export type { BackendFieldErrorMap } from "@/services/errors/types.ts";

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
    | "errorMessages"
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
              type: "date";
              placeholder?: string;
              required?: boolean;
              model: Ref<Date | undefined>;
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
              hint?: string;
              icon?: string;
          }
        | {
              type: "image";
              required?: boolean;
              model: Ref<File | string | undefined>;
              dropTitle: string;
              acceptExtensions?: string[];
              hint?: string;
              maxFileSizeMB?: number;
          }
        | {
              type: "date-time";
              required?: boolean;
              model: Ref<DateTime | undefined>;
          }
        | {
              type: "time-range";
              required?: boolean;
              model: Ref<TimeRange | undefined>;
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
    backendErrors?: BackendFieldErrorMap;
};

export type DateTime = {
    date: Date;
    time: string;
};

export type TimeRange = {
    fromDate: Date;
    fromTime: string;
    toDate: Date;
    toTime: string;
};
