import { Ref } from "vue";
import type { VField, VInput, VTextField } from "vuetify/components";

type VFieldProps = InstanceType<typeof VField>["$props"];
type VInputProps = InstanceType<typeof VInput>["$props"];
type VTextFieldProps = InstanceType<typeof VTextField>["$props"];

export type FormFieldBaseProperties = Pick<VInputProps, "label" | "density"> &
    Pick<VFieldProps, "variant"> &
    Pick<VTextFieldProps, "placeholder"> & {
        required: boolean;
    };

export type FormField = {
    name: string;
    label: string;
    placeholder: string;
    required?: boolean;
} & (
    | {
          type: "text";
          model: Ref<string>;
      }
    | {
          type: "textarea";
          model: Ref<string>;
      }
    | {
          type: "select";
          model: Ref<string>;
          options: { value: string; text: string }[];
      }
);
