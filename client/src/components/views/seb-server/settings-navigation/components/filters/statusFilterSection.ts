import { translate } from "@/utils/generalUtils";
import type { FilterSectionDef } from "./filterTypes";

/**
 * Returns the standard Active / Inactive status filter section definition.
 * Pass the page-level translation prefix (e.g. "userAccount.userAccountPage").
 */
export function statusFilterSection(
    translationPrefix: string,
): FilterSectionDef {
    return {
        key: "status",
        title: translate(`${translationPrefix}.filters.statusFilter`),
        options: [
            {
                value: "Active",
                label: translate(`${translationPrefix}.filters.activeSelector`),
            },
            {
                value: "Inactive",
                label: translate(
                    `${translationPrefix}.filters.inactiveSelector`,
                ),
            },
        ],
    };
}
