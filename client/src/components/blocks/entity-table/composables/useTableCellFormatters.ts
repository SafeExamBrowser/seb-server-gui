import { computed, watch } from "vue";
import type {
    CellFormatter,
    HeaderTranslateType,
    UseSettingsTableCellFormattersParams,
} from "@/components/blocks/entity-table/types.ts";
import { translate } from "@/utils/generalUtils.ts";
import * as timeUtils from "@/utils/timeUtils.ts";
import { useInstitutionNameMap } from "@/composables/useInstitutionNameMap.ts";

function toDisplayString(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value);
}

export function useTableCellFormatters(
    params: UseSettingsTableCellFormattersParams,
) {
    const needsInstitutionNames = computed(() =>
        params.headers.value.some(
            (header) => header.translateType === "institutionName",
        ),
    );

    const { fetchInstitutions, getInstitutionName, hasFetched } =
        useInstitutionNameMap();

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
        formattersReady,
    };
}
