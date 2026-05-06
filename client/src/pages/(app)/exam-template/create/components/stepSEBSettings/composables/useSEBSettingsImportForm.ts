import { computed, Ref } from "vue";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useSEBSettingsImport } from "./api/useSEBSettingsImport";
import {
    SEBSettingsImportItemTransient,
    toCSEBSettingsImportItem,
} from "../types";

export const useSEBSettingsImportForm = (
    configurationTemplateId: string,
    {
        onSuccess,
    }: {
        onSuccess: () => void;
    },
) => {
    const { mutateData: importSEBSettings, error: uploadError } =
        useSEBSettingsImport();

    const getEmptyItem = (): SEBSettingsImportItemTransient => ({
        file: undefined,
        password: "",
        quitPassword: "",
    });

    const getFormFields = (
        item: Ref<SEBSettingsImportItemTransient>,
    ): FormField[] => {
        const file = computed<File | undefined>({
            get: () => item.value.file,
            set: (value) => {
                item.value = { ...item.value, file: value };
            },
        });

        const password = computed<string | undefined>({
            get: () => item.value.password,
            set: (value) => {
                item.value = { ...item.value, password: value ?? "" };
            },
        });

        const quitPassword = computed<string | undefined>({
            get: () => item.value.quitPassword,
            set: (value) => {
                item.value = { ...item.value, quitPassword: value ?? "" };
            },
        });

        return [
            {
                type: "file" as const,
                name: "file",
                model: file,
                label: i18n.global.t(
                    "sebSettings.importDialog.fields.file.label",
                ),
                hint: i18n.global.t(
                    "sebSettings.importDialog.fields.file.hint",
                ),
                acceptExtensions: [".seb"],
                icon: "mdi-file-certificate-outline",
                required: true,
            },
            {
                type: "password" as const,
                name: "password",
                model: password,
                label: i18n.global.t(
                    "sebSettings.importDialog.fields.password.label",
                ),
            },
            {
                type: "password" as const,
                name: "quitPassword",
                model: quitPassword,
                label: i18n.global.t(
                    "sebSettings.importDialog.fields.quitPassword.label",
                ),
            },
        ];
    };

    const handleImportSEBSettings = async (
        itemTransient: SEBSettingsImportItemTransient,
    ): Promise<void> => {
        const item = toCSEBSettingsImportItem(itemTransient);

        await importSEBSettings({
            file: item.file,
            fileName: item.file.name,
            configurationTemplateId: configurationTemplateId,
            password: item.password,
            quitPassword: item.quitPassword,
        });

        if (uploadError.value) {
            throw new Error(
                i18n.global.t("sebSettings.importDialog.errors.generic"),
            );
        }

        onSuccess();
    };

    return {
        getEmptyItem,
        getFormFields,
        handleImportSEBSettings,
    };
};
