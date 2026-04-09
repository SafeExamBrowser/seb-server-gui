import { computed } from "vue";
import { translate } from "@/utils/generalUtils";
import { useInstitutionNameMap } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useInstitutionNameMap";
import { useShowInstitutionColumn } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useShowInstitutionColumn";
import type { FilterSectionDef } from "./filterTypes";

/**
 * Returns a reactive institution filter section.
 *
 * The fetch is kicked off immediately so chips are never stuck empty due to
 * lazy initialisation. While data is loading the section is still present in
 * the layout (occupying its grid column) but renders no chips — they appear
 * reactively once the fetch resolves. If the current user role does not
 * include SEB_SERVER_ADMIN the section is null and the caller should omit it.
 *
 * Pass the page-level translation prefix (e.g. "userAccount.userAccountPage").
 */
export function useInstitutionFilterSection(translationPrefix: string) {
    const showInstitution = useShowInstitutionColumn();
    const { institutionFilterOptions, fetchInstitutions } =
        useInstitutionNameMap();

    // Kick off immediately — no lazy detection, no header sniffing.
    void fetchInstitutions();

    const section = computed<FilterSectionDef | null>(() => {
        if (!showInstitution.value) return null;

        return {
            key: "institutionId",
            title: translate(`${translationPrefix}.filters.institutionFilter`),
            // Options are reactive: empty while fetching, populated once resolved.
            options: institutionFilterOptions.value.map((opt) => ({
                value: opt.value,
                label: opt.label,
            })),
        };
    });

    return { section };
}
