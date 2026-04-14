import { computed, watch } from "vue";
import type { ComputedRef, Ref } from "vue";
import type { CellFormatter } from "@/components/blocks/entity-table/types.ts";
import type {
    SebTableHeader,
    SebHeaderTranslateType,
} from "@/components/views/seb-server/composables/sebServerTableHeaderTypes.ts";
import { translate } from "@/utils/generalUtils.ts";
import * as timeUtils from "@/utils/timeUtils.ts";
import { useInstitutionNameMap } from "@/composables/useInstitutionNameMap.ts";

export function useSebServerCellFormatters(
    headers: Ref<SebTableHeader[]> | ComputedRef<SebTableHeader[]>,
) {
    const needsInstitutionNames = computed(() =>
        headers.value.some((h) => h.translateType === "institutionName"),
    );

    const { fetchInstitutions, getInstitutionName, hasFetched } =
        useInstitutionNameMap();

    watch(
        needsInstitutionNames,
        async (needed) => {
            if (needed) await fetchInstitutions();
        },
        { immediate: true },
    );

    const formatterMap: Record<SebHeaderTranslateType, CellFormatter> = {
        institutionName: (value) => getInstitutionName(value),

        dateTime: (value) =>
            value ? timeUtils.formatIsoToReadableDateTime(String(value)) : "",

        assessmentToolType: (value) =>
            value
                ? translate(
                      `assessmentToolConnections.lmsTypes.${String(value)}`,
                  )
                : "",

        examType: (value) => (value ? translate(String(value)) : ""),

        examStatus: (value) => (value ? translate(String(value)) : ""),

        certificateTypes: (value) => {
            if (!Array.isArray(value) || value.length === 0) return "";
            return value
                .map((type) => translate(`certificates.types.${String(type)}`))
                .join(" | ");
        },
    };

    const cellFormatters = computed<Record<string, CellFormatter>>(() => {
        const result: Record<string, CellFormatter> = {};
        for (const header of headers.value) {
            if (header.translateType) {
                result[header.key] = formatterMap[header.translateType];
            }
        }
        return result;
    });

    const formattersReady = computed(
        () => !needsInstitutionNames.value || hasFetched.value,
    );

    return { cellFormatters, formattersReady };
}
