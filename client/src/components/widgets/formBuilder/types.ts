import { Ref } from "vue";
import type { VField, VInput, VTextField } from "vuetify/components";

type VFieldProps = InstanceType<typeof VField>["$props"];
type VInputProps = InstanceType<typeof VInput>["$props"];
type VTextFieldProps = InstanceType<typeof VTextField>["$props"];

export type FormFieldBaseProperties = Pick<
    VInputProps,
    "ref" | "label" | "density" | "rules" | "hint" | "persistentHint"
> &
    Pick<VFieldProps, "variant">;

export type FormFieldTextualProperties = Pick<VTextFieldProps, "placeholder">;

export type FormField = {
    name: string;
    label: string;
    rules?: VInputProps["rules"];
    info?: string;
    validationDependsOn?: string[];
} & (
    | {
          type: "text";
          placeholder?: string;
          required?: boolean;
          model: Ref<string>;
      }
    | {
          type: "textarea";
          placeholder?: string;
          required?: boolean;
          model: Ref<string>;
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
