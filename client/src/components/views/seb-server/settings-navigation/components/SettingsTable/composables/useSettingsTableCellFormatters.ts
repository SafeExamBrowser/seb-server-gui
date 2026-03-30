import { computed, watch, type ComputedRef, type Ref } from "vue";
import type {
    HeaderTranslateType,
    SettingsTableHeader,
} from "@/components/views/seb-server/settings-navigation/components/SettingsTable/settingsTableTypes";
import { useInstitutionNameMap } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useInstitutionNameMap.ts";
import { translate } from "@/utils/generalUtils";
import * as timeUtils from "@/utils/timeUtils";

type TableItem = Record<string, unknown>;
type CellFormatter = (value: unknown, item: TableItem) => string;

type UseSettingsTableCellFormattersParams = {
    headers: Ref<SettingsTableHeader[]> | ComputedRef<SettingsTableHeader[]>;
};

function toDisplayString(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value);
}

export function useSettingsTableCellFormatters(
    params: UseSettingsTableCellFormattersParams,
) {
    const needsInstitutionNames = computed(() =>
        params.headers.value.some(
            (header) => header.translateType === "institutionName",
        ),
    );

    const {
        fetchInstitutions,
        getInstitutionName,
        loading,
        error,
        hasFetched,
    } = useInstitutionNameMap();

    watch(
        needsInstitutionNames,
        async (enabled) => {
            if (enabled) {
                await fetchInstitutions();
            }
        },
        { immediate: true },
    );

    const formatterMap: Record<HeaderTranslateType, CellFormatter> = {
        institutionName: (value: unknown) => getInstitutionName(value),

        dateTime: (value: unknown) =>
            value ? timeUtils.formatIsoToReadableDateTime(String(value)) : "",

        assessmentToolType: (value: unknown) =>
            value
                ? translate(
                      `assessmentToolConnections.lmsTypes.${String(value)}`,
                  )
                : "",

        certificateTypes: (value: unknown) => {
            if (!Array.isArray(value) || value.length === 0) {
                return "";
            }

            return value
                .map((type) => translate(`certificates.types.${String(type)}`))
                .join(" | ");
        },
    };

    const cellFormatters = computed<Record<string, CellFormatter>>(() => {
        const result: Record<string, CellFormatter> = {};

        params.headers.value.forEach((header) => {
            if (!header.translateType) return;

            result[header.key] =
                formatterMap[header.translateType] ??
                ((value: unknown) => toDisplayString(value));
        });

        return result;
    });

    const formattersReady = computed(() => {
        if (!needsInstitutionNames.value) {
            return true;
        }

        return hasFetched.value;
    });

    return {
        cellFormatters,
        loading,
        error,
        formattersReady,
    };
}
