import { useMutation } from "@/composables/useMutation.ts";
import {
    ConfigurationKey,
    SEBSettingsImport,
} from "@/models/seb-server/configurationNode";
import { importSEBSettings } from "@/services/seb-server/configurationNodeService";

export const useSEBSettingsImport = () =>
    useMutation<[SEBSettingsImport], ConfigurationKey>((params) =>
        importSEBSettings(params),
    );
