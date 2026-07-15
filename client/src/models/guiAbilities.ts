import { z } from "zod";
import { zGuiAbilities } from "@/api/seb-server/generated/hey-api/zod.gen.ts";

export const guiAbilitiesSchema = zGuiAbilities.pick({
    components: true,
    actions: true,
});
export type GuiAbilities = z.infer<typeof guiAbilitiesSchema>;

export const GUIComponent = guiAbilitiesSchema.shape.components.element.enum;
export type GUIComponent = (typeof GUIComponent)[keyof typeof GUIComponent];

export const GUIAction = guiAbilitiesSchema.shape.actions.element.enum;
export type GUIAction = (typeof GUIAction)[keyof typeof GUIAction];
