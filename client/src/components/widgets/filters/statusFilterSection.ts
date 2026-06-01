import { translate } from "@/utils/generalUtils.ts";
import type { FilterSectionDef } from "./filterTypes.ts";

export const STATUS_FILTER_KEY = "status";

export function getStatusFilterSection(
    translationPrefix: string,
): FilterSectionDef {
    return {
        key: STATUS_FILTER_KEY,
        title: translate(`${translationPrefix}.filters.statusFilter`),
        testIdSuffix: "statusFilter",
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
