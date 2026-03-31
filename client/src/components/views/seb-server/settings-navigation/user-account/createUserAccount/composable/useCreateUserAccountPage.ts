import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import moment from "moment-timezone";
import { useAppBarStore } from "@/stores/store";
import { useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/userAccountStore";
import { GUIComponent, useAbilities } from "@/services/ability";
import { navigateTo } from "@/router/navigation";
import * as constants from "@/utils/constants";
import { translate } from "@/utils/generalUtils";
import { getInstitutions } from "@/services/seb-server/institutionService";
import { createUserAccount } from "@/services/seb-server/userAccountService";
import { UserRoleEnum } from "@/models/userRoleEnum";
import { Institution } from "@/models/seb-server/institution";
import { CreateUserPar, SingleUserAccountResponse } from "@/models/userAccount";
import { useCreateUserAccountStore } from "../store/useCreateUserAccountStore";
import { useCreateUserAccountFormFields } from "./useCreateUserAccountFormFields";

type RoleOption = {
    label: string;
    value: string;
};

export const useCreateUserAccountPage = () => {
    const ability = useAbilities();
    const i18n = useI18n();
    const appBarStore = useAppBarStore();
    const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();

    const store = useCreateUserAccountStore();

    const {
        isFormValid,
        selectedInstitution,
        username,
        name,
        surname,
        email,
        timezone,
        password,
        confirmPassword,
        selectedUserRole,
    } = storeToRefs(store);

    const institutions = ref<Institution[]>([]);
    const availableRoles = ref<RoleOption[]>([]);

    const createdUserName = ref("");
    const createdSuccess = ref(false);

    const timezoneOptions = ref<string[]>(moment.tz.names());

    const allRoles: RoleOption[] = Object.values(UserRoleEnum).map((role) => ({
        label: translate(`general.userRoles.${role}`),
        value: role,
    }));

    const selectedUserRoleDescription = computed(() => {
        if (!selectedUserRole.value) {
            return translate("userAccount.general.role.pleaseselect");
        }

        return translate(
            `userAccount.general.role.info.${selectedUserRole.value}`,
            i18n,
        );
    });

    function getAvailableRolesForUser(userRoles: string[]): RoleOption[] {
        const hasSebServerAdmin = userRoles.includes(
            UserRoleEnum.SEB_SERVER_ADMIN,
        );
        const hasInstitutionalAdmin = userRoles.includes(
            UserRoleEnum.INSTITUTIONAL_ADMIN,
        );

        if (hasSebServerAdmin) {
            return allRoles.filter((role) =>
                [
                    UserRoleEnum.SEB_SERVER_ADMIN,
                    UserRoleEnum.INSTITUTIONAL_ADMIN,
                    UserRoleEnum.EXAM_ADMIN,
                    UserRoleEnum.EXAM_SUPPORTER,
                ].includes(role.value as UserRoleEnum),
            );
        }

        if (hasInstitutionalAdmin) {
            return allRoles.filter((role) =>
                [
                    UserRoleEnum.INSTITUTIONAL_ADMIN,
                    UserRoleEnum.EXAM_ADMIN,
                    UserRoleEnum.EXAM_SUPPORTER,
                ].includes(role.value as UserRoleEnum),
            );
        }

        return [];
    }

    const { formFields } = useCreateUserAccountFormFields(
        institutions,
        availableRoles,
        timezoneOptions,
    );

    const initialize = async () => {
        if (!ability.canView(GUIComponent.UserAccounts)) {
            navigateTo(constants.HOME_PAGE_ROUTE);
            return;
        }

        appBarStore.title = translate("titles.createUserAccount");

        timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const user = authenticatedUserAccountStore.userAccount;
        const roles = user?.userRoles ?? [];

        const result: Institution[] | null = await getInstitutions();
        institutions.value = result ?? [];

        availableRoles.value = getAvailableRolesForUser(roles);

        if (roles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN)) {
            const userInstitutionId = String(user?.institutionId);

            const matchedInstitution = institutions.value.find(
                (institution) => institution.modelId === userInstitutionId,
            );

            if (matchedInstitution) {
                selectedInstitution.value = matchedInstitution.modelId;
                institutions.value = [matchedInstitution];
            } else {
                console.warn(
                    "User's institution not found in fetched institutions.",
                );
            }
        }
    };

    const submit = async () => {
        const selectedRole = selectedUserRole.value;

        if (!isFormValid.value || !selectedRole) {
            return;
        }

        const userRoles: string[] =
            selectedRole === UserRoleEnum.INSTITUTIONAL_ADMIN
                ? [
                      UserRoleEnum.INSTITUTIONAL_ADMIN,
                      UserRoleEnum.EXAM_ADMIN,
                      UserRoleEnum.EXAM_SUPPORTER,
                  ]
                : selectedRole === UserRoleEnum.EXAM_ADMIN
                  ? [UserRoleEnum.EXAM_ADMIN, UserRoleEnum.EXAM_SUPPORTER]
                  : [selectedRole];

        const createUserAccountParams: CreateUserPar = {
            institutionId: selectedInstitution.value ?? "",
            name: name.value ?? "",
            surname: surname.value ?? "",
            username: username.value ?? "",
            newPassword: password.value ?? "",
            confirmNewPassword: confirmPassword.value ?? "",
            timezone: timezone.value ?? "",
            language: "en",
            email: email.value ?? "",
            userRoles,
        };

        const createdUserAccountResponse: SingleUserAccountResponse | null =
            await createUserAccount(createUserAccountParams);

        if (createdUserAccountResponse == null) {
            return;
        }

        createdUserName.value = createdUserAccountResponse.name;
        createdSuccess.value = true;

        setTimeout(() => {
            createdSuccess.value = false;
            navigateTo(constants.USER_ACCOUNTS_ROUTE);
        }, 1500);
    };

    return {
        isFormValid,
        formFields,
        selectedUserRoleDescription,
        createdUserName,
        createdSuccess,
        initialize,
        submit,
    };
};
