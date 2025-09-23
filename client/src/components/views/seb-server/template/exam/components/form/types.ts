import { Ref } from "vue";

export type FormField = {
    name: string;
    label: string;
    placeholder: string;
} & (
    | {
          type: "text";
          model: Ref<string>;
      }
    | {
          type: "textarea";
          model: Ref<string>;
      }
);
