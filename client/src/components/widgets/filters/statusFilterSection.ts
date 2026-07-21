import { STATUS_FILTER } from "@/components/widgets/filters/filterContracts.ts";
import { translate } from "@/utils/generalUtils.ts";

import type { FilterSectionDef } from "./filterTypes.ts";

export const STATUS_FILTER_KEY = STATUS_FILTER.key;

export function getStatusFilterSection(
    translationPrefix: string,
): FilterSectionDef {
    return {
        key: STATUS_FILTER.key,
        title: translate(`${translationPrefix}.filters.statusFilter`),
        testIdSuffix: STATUS_FILTER.testIdSuffix,
        options: [
            {
                value: "Active",
                label: translate(`${translationPrefix}.filters.activeSelector`),
                color: "success",
            },
            {
                value: "Inactive",
                label: translate(
                    `${translationPrefix}.filters.inactiveSelector`,
                ),
                color: "error",
            },
        ],
    };
}
