import { computed } from "vue";
import { translate } from "@/utils/generalUtils";
import type { SettingsTableHeader } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/settingsTableTypes";
import { useShowInstitutionColumn } from "@/components/views/seb-server/settings-navigation/composables/useShowInstitutionColumn";

export const useUserAccountsTableHeaders = () => {
    const showInstitutionColumn = useShowInstitutionColumn();

    return computed<SettingsTableHeader[]>(() => {
        const headers: SettingsTableHeader[] = [];

        if (showInstitutionColumn.value) {
            headers.push({
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderInstitution",
                ),
                key: "institutionId",
                width: "6%",
                sortable: true,
            });
        }

        headers.push(
            {
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderSurname",
                ),
                key: "surname",
                width: "8%",
                sortable: true,
            },
            {
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderName",
                ),
                key: "name",
                width: "8%",
                sortable: true,
            },
            {
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderUsername",
                ),
                key: "username",
                width: "8%",
                sortable: true,
            },
            {
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderEmail",
                ),
                key: "email",
                width: "12%",
                sortable: true,
            },
            {
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderStatus",
                ),
                key: "active",
                width: "6%",
                sortable: false,
            },
            {
                title: "",
                key: "actions",
                width: "1%",
                sortable: false,
            },
        );

        return headers;
    });
};
