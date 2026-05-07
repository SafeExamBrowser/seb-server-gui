import { useMutation } from "@/composables/useMutation.ts";
import { importSEBSettings } from "@/services/seb-server/configurationNodeService";
import {
    ConfigurationKey,
    SEBSettingsImport,
} from "@/models/seb-server/configurationNode";

export const useSEBSettingsImport = () =>
    useMutation<[SEBSettingsImport], ConfigurationKey>((params) =>
        importSEBSettings(params),
    );
