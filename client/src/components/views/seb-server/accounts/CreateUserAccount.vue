<template>
    <div
        class="text-white text-h5 font-weight-black ml-10 mt-5"
        data-testid="createUserAccount-page-title"
    >
        {{ translate("titles.settings") }}
    </div>
    <v-row class="mt-10 w-98 h-100">
        <!-- settings navigation -->
        <SettingsNavigation
            data-testid="createUserAccount-settingsNavigation-component"
        />

        <v-col
            class="bg-white rounded-lg"
            cols="9"
            data-testid="createUserAccount-form-container"
            elevation="4"
        >
            <v-row class="d-flex align-center justify-space-between px-6 pt-6">
                <div
                    class="text-primary text-h5 font-weight-bold"
                    data-testid="createUserAccount-form-title"
                >
                    {{ translate("userAccount.createUserAccountPage.title") }}
                </div>
            </v-row>

            <v-divider
                class="custom-divider mx-6 my-4 mt-7"
                data-testid="createUserAccount-divider-top"
            />

            <v-row class="px-8 mt-2">
                <div
                    class="text-body-2 text-grey-darken-1"
                    data-testid="createUserAccount-form-infoText"
                >
                    {{
                        translate(
                            "userAccount.createUserAccountPage.info.accountCreationInfo",
                        )
                    }}
                </div>
            </v-row>

            <!-- Form -->
            <v-sheet class="rounded-lg mt-4">
                <v-col class="pa-0 mb-4 h-100" cols="12" md="12">
                    <v-card-text>
                        <v-form
                            ref="formRef"
                            data-testid="createUserAccount-form"
                            @keyup.enter="submit()"
                        >
                            <v-row dense>
                                <v-col>
                                    <!-- Institution -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-select
                                            v-model="selectedInstitution"
                                            data-testid="createUserAccount-institution-select"
                                            density="compact"
                                            :disabled="
                                                institutionSelectDisabled
                                            "
                                            item-title="name"
                                            item-value="modelId"
                                            :items="institutions"
                                            :label="
                                                translate(
                                                    'userAccount.createUserAccountPage.labels.institutionLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Username -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="username"
                                            data-testid="createUserAccount-username-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'userAccount.createUserAccountPage.labels.usernameLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Name -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="name"
                                            data-testid="createUserAccount-name-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'userAccount.createUserAccountPage.labels.nameLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Surname -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="surname"
                                            data-testid="createUserAccount-surname-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'userAccount.createUserAccountPage.labels.surnameLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Email -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="email"
                                            data-testid="createUserAccount-email-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'userAccount.createUserAccountPage.labels.emailLabel',
                                                )
                                            "
                                            :rules="[emailRule]"
                                            validate-on="blur"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Timezone -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-select
                                            v-model="timezone"
                                            data-testid="createUserAccount-timezone-select"
                                            density="compact"
                                            :items="timezoneOptions"
                                            :label="
                                                translate(
                                                    'userAccount.createUserAccountPage.labels.timeZoneLabel',
                                                )
                                            "
                                            required
                                            :return-object="false"
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Password -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="password"
                                            data-testid="createUserAccount-password-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'userAccount.createUserAccountPage.labels.passwordLabel',
                                                )
                                            "
                                            required
                                            :rules="[
                                                requiredRule,
                                                passwordRule,
                                            ]"
                                            :type="
                                                passwordVisible
                                                    ? 'text'
                                                    : 'password'
                                            "
                                            validate-on="blur"
                                            variant="outlined"
                                        >
                                            <template #append-inner>
                                                <v-btn
                                                    data-testid="createUserAccount-password-toggle"
                                                    density="compact"
                                                    :icon="
                                                        passwordVisible
                                                            ? 'mdi-eye-off'
                                                            : 'mdi-eye'
                                                    "
                                                    variant="text"
                                                    @click="
                                                        passwordVisible =
                                                            !passwordVisible
                                                    "
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>

                                    <!-- Confirm Password -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            ref="confirmPasswordFieldRef"
                                            v-model="confirmPassword"
                                            class="mb-2"
                                            data-testid="createUserAccount-confirmPassword-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'userAccount.createUserAccountPage.labels.confirmPasswordLabel',
                                                )
                                            "
                                            required
                                            :rules="[
                                                requiredRule,
                                                confirmPasswordRule,
                                            ]"
                                            :type="
                                                confirmPasswordVisible
                                                    ? 'text'
                                                    : 'password'
                                            "
                                            validate-on="blur"
                                            variant="outlined"
                                            @blur="
                                                confirmPasswordTouched = true
                                            "
                                        >
                                            <template #append-inner>
                                                <v-btn
                                                    data-testid="createUserAccount-confirmPassword-toggle"
                                                    density="compact"
                                                    :icon="
                                                        confirmPasswordVisible
                                                            ? 'mdi-eye-off'
                                                            : 'mdi-eye'
                                                    "
                                                    variant="text"
                                                    @click="
                                                        confirmPasswordVisible =
                                                            !confirmPasswordVisible
                                                    "
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                </v-col>

                                <!-- user circle and roles -->
                                <v-col>
                                    <v-col
                                        class="d-flex justify-center mb-6"
                                        cols="12"
                                        data-testid="createUserAccount-userCircle"
                                    >
                                        <div
                                            class="rounded-circle d-flex align-center justify-center"
                                            style="
                                                background-color: transparent;
                                                border: 0.5rem solid #215caf;
                                                width: 13rem;
                                                height: 13rem;
                                                min-width: 13rem;
                                                font-weight: 600;
                                                font-size: 4rem;
                                                color: #215caf;
                                            "
                                        >
                                            {{
                                                (name?.[0] || "") +
                                                (surname?.[0] || "")
                                            }}
                                        </div>
                                    </v-col>

                                    <!-- roles -->
                                    <v-col class="pt-16">
                                        <v-select
                                            v-model="selectedUserRole"
                                            data-testid="createUserAccount-role-select"
                                            density="compact"
                                            :disabled="roleSelectDisabled"
                                            item-title="label"
                                            item-value="value"
                                            :items="availableRoles"
                                            :label="
                                                translate(
                                                    'userAccount.createUserAccountPage.labels.selectRolesLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>
                                    <v-col>
                                        <v-card
                                            variant="tonal"
                                            :text="selectedUserRoleDescription"
                                        >
                                        </v-card>
                                    </v-col>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-col>
            </v-sheet>

            <!-- Buttons -->
            <v-row class="px-6 pt-0">
                <v-col class="pa-0 mb-4" cols="12" md="12">
                    <div class="d-flex justify-end">
                        <v-btn
                            color="black"
                            data-testid="createUserAccount-cancel-button"
                            rounded="sm"
                            variant="outlined"
                            @click="navigateTo(constants.USER_ACCOUNTS_ROUTE)"
                        >
                            {{ translate("general.cancelButton") }}
                        </v-btn>

                        <v-btn
                            class="ml-2"
                            color="primary"
                            data-testid="createUserAccount-save-button"
                            rounded="sm"
                            variant="flat"
                            @click="submit()"
                        >
                            {{ translate("general.saveButton") }}
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useAppBarStore, useLayoutStore } from "@/stores/store";
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils";
import * as constants from "@/utils/constants";
import { watch } from "vue";
import moment from "moment-timezone";
import { getInstitutions } from "@/services/seb-server/component-services/registerAccountViewService";
import { createUserAccount } from "@/services/seb-server/component-services/userAccountViewService";
import { navigateTo } from "@/router/navigation";
import { UserRoleEnum } from "@/models/userRoleEnum";
import { useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/authenticationStore";
import { GUIComponent, useAbilities } from "@/services/ability";

const ability = useAbilities();
const appBarStore = useAppBarStore();
const layoutStore = useLayoutStore();

const i18n = useI18n();

// fields
const selectedInstitution = ref<string | null>(null);
const name = ref<string>("");
const surname = ref<string>("");
const username = ref<string>("");
const email = ref<string>();
const timezone = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");
const createdUserName = ref("");
const formRef = ref();

//const rolesTouched = ref(false);
const createdSuccess = ref(false);
const passwordVisible = ref<boolean>(false);
const confirmPasswordVisible = ref<boolean>(false);
const confirmPasswordFieldRef = ref();
const confirmPasswordTouched = ref(false);
const institutionSelectDisabled = ref(false);

const institutions = ref<Institution[]>([]);

const timezoneOptions = moment.tz.names();
const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();

// validation rules
const requiredMessage = translate("userAccount.general.validation.required");
const passwordTooShortMessage = translate(
    "userAccount.general.validation.passwordTooShort",
);
const passwordsDontMatchMessage = translate(
    "userAccount.general.validation.passwordsDontMatch",
);
const invalidEmailMessage = translate(
    "userAccount.general.validation.invalidEmail",
);

const requiredRule = (v: string) => !!v || requiredMessage;
const passwordRule = (v: string) =>
    (v && v.length >= 8) || passwordTooShortMessage;
const confirmPasswordRule = (v: string) =>
    v === password.value || passwordsDontMatchMessage;
const emailRule = (v: string) =>
    !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || invalidEmailMessage;

// user roles
const selectedUserRole = ref<string | null>(null);
const availableRoles = ref<{ label: string; value: string }[]>([]);
const allRoles = Object.values(UserRoleEnum).map((role) => ({
    label: translate(`general.userRoles.${role}`),
    value: role,
}));
const selectedUserRoleDescription = ref<string>("");
const roleSelectDisabled = ref(false);

function getAvailableRolesForUser(userRoles: string[]): typeof allRoles {
    const hasSebServerAdmin = userRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN);
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
            ].includes(role.value),
        );
    }
    if (hasInstitutionalAdmin) {
        return allRoles.filter((role) =>
            [
                UserRoleEnum.INSTITUTIONAL_ADMIN,
                UserRoleEnum.EXAM_ADMIN,
                UserRoleEnum.EXAM_SUPPORTER,
            ].includes(role.value),
        );
    }
    return [];
}

onMounted(async () => {
    // check user rights and go back to home if not allowed to view this page
    if (!ability.canView(GUIComponent.UserAccounts)) {
        navigateTo(constants.HOME_PAGE_ROUTE);
        return;
    }

    appBarStore.title = translate("titles.createUserAccount");
    layoutStore.setBlueBackground(true);
    timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;

    selectedUserRoleDescription.value = translate(
        "userAccount.general.role.pleaseselect",
    );

    const user = authenticatedUserAccountStore.userAccount;
    const roles = user?.userRoles ?? [];

    const result: Institution[] | null = await getInstitutions();
    institutions.value = result ?? [];

    availableRoles.value = getAvailableRolesForUser(roles);

    if (roles.includes(UserRoleEnum.SEB_SERVER_ADMIN)) {
        institutionSelectDisabled.value = false;
    } else if (roles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN)) {
        const userInstitutionId = String(user?.institutionId);
        const matchedInstitution = institutions.value.find(
            (inst) => inst.modelId === userInstitutionId,
        );

        if (matchedInstitution) {
            selectedInstitution.value = matchedInstitution.modelId;
            institutionSelectDisabled.value = true;
            institutions.value = [matchedInstitution];
        } else {
            console.warn(
                "User's institution not found in fetched institutions.",
            );
        }
    }
});

watch(password, () => {
    if (confirmPasswordTouched.value) {
        confirmPasswordFieldRef.value?.validate?.();
    }
});

watch(selectedUserRole, () => {
    if (selectedUserRole.value == null) {
        selectedUserRoleDescription.value = "";
        return;
    }
    selectedUserRoleDescription.value = translate(
        `userAccount.general.role.info.${selectedUserRole.value}`,
        i18n,
    );
});

async function submit() {
    // Always validate the form
    const { valid } = await formRef.value.validate();

    // Manually check roles
    const selectedRole = selectedUserRole.value;

    // If anything is invalid, stop
    if (!valid || selectedRole === null) {
        return;
    }

    // apply role inclusion for INSTITUTIONAL_ADMIN and EXAM_ADMIN
    const userRoles: string[] =
        selectedRole === "INSTITUTIONAL_ADMIN"
            ? ["INSTITUTIONAL_ADMIN", "EXAM_ADMIN", "EXAM_SUPPORTER"]
            : selectedRole === "EXAM_ADMIN"
              ? ["EXAM_ADMIN", "EXAM_SUPPORTER"]
              : [selectedRole];

    // Prepare the request
    const createUserAcccountParams: CreateUserPar = {
        institutionId: selectedInstitution.value!,
        name: name.value,
        surname: surname.value,
        username: username.value,
        newPassword: password.value,
        confirmNewPassword: confirmPassword.value,
        timezone: timezone.value,
        language: "en",
        email: email.value || "",
        userRoles: userRoles,
    };

    // Call the service
    const createdUserAccountResponse: SingleUserAccountResponse | null =
        await createUserAccount(createUserAcccountParams);

    if (createdUserAccountResponse == null) {
        // ToDo display error
    } else {
        createdUserName.value = createdUserAccountResponse.name;
        createdSuccess.value = true;
        setTimeout(() => {
            createdSuccess.value = false;
            navigateTo(constants.USER_ACCOUNTS_ROUTE);
        }, 1500);
    }
}

onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});
onMounted(() => {
    appBarStore.title = translate("titles.createUserAccount");
    layoutStore.setBlueBackground(true);
});
</script>

<style scoped>
.nav-hover:hover .nav-link {
    color: #215caf;
}

.w-98 {
    width: 98% !important;
}

.custom-divider {
    background-color: #dcdcdc !important;
    height: 1px;
    width: 100%;
}

.custom-padding-textbox {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
}

.custom-role-checkbox input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #215cae;
    border-radius: 50%;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    flex-shrink: 0;
}

.custom-role-checkbox input[type="checkbox"]:checked {
    border-width: 6px;
}

.custom-role-checkbox label {
    color: #215caf;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    font-family: Roboto, sans-serif;
    letter-spacing: 0.15px;
    cursor: pointer;
}
</style>
