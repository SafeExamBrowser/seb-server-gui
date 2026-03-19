import { computed } from "vue";
import { translate } from "@/utils/generalUtils";

export const useUserAccountsTableHeaders = () =>
    computed(() => [
        {
            title: translate(
                "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderSurname",
            ),
            key: "surname",
            width: "12%",
            sortable: true,
        },
        {
            title: translate(
                "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderName",
            ),
            key: "name",
            width: "10%",
            sortable: true,
        },
        {
            title: translate(
                "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderUsername",
            ),
            key: "username",
            width: "12%",
            sortable: true,
        },
        {
            title: translate(
                "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderEmail",
            ),
            key: "email",
            width: "10%",
            sortable: true,
        },
        {
            title: translate(
                "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderStatus",
            ),
            key: "active",
            width: "8%",
            sortable: false,
        },
        {
            title: "",
            key: "actions",
            width: "1%",
            sortable: false,
        },
    ]);
