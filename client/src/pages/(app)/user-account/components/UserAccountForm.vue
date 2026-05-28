<template>
    <BasicSettingsPage :title="title" :data-testid="`${dataTestPrefix}-page`">
        <template #PanelMain>
            <HintText
                :text-identifier="`userAccount.hints.${mode}`"
                class="px-6 py-2"
                :data-testid="`${dataTestPrefix}-info-text`"
            />

            <v-row class="px-6 mt-2" no-gutters>
                <v-col cols="6" class="pe-3">
                    <LoadingFallbackComponent
                        :loading="loading"
                        :errors="errors"
                    >
                        <FormBuilder
                            ref="leftFormRef"
                            :fields="leftFormFields"
                            :data-testid="`${dataTestPrefix}-form`"
                        />

                        <v-text-field
                            v-if="mode !== 'create'"
                            :label="
                                $t(
                                    'userAccount.fields.passwordPlaceholder.label',
                                )
                            "
                            append-inner-icon="mdi-pencil"
                            class="cursor-pointer mt-2"
                            density="compact"
                            model-value="••••••••••••"
                            readonly
                            variant="outlined"
                            :data-testid="`${dataTestPrefix}-password-opener`"
                            @click="changePasswordDialogOpen = true"
                        />
                    </LoadingFallbackComponent>
                </v-col>

                <v-col class="d-flex flex-column align-center ps-3" cols="6">
                    <UserAccountPreviewCard
                        :name="name"
                        :surname="surname"
                        :selected-user-role-description="roleDescription"
                        :data-testid="`${dataTestPrefix}-preview-card`"
                    />
                    <div class="w-100 pt-4">
                        <LoadingFallbackComponent
                            :loading="loading"
                            :errors="[]"
                        >
                            <FormBuilder
                                ref="rightFormRef"
                                :fields="rightFormFields"
                                :data-testid="`${dataTestPrefix}-role-form`"
                            />
                        </LoadingFallbackComponent>
                    </div>
                </v-col>
            </v-row>

            <div
                v-if="mode !== 'create' && initialUser?.creationDate"
                class="px-6 text-body-medium text-grey-darken-1"
                :data-testid="`${dataTestPrefix}-createdAt`"
            >
                {{ $t("userAccount.hints.createdAt")
                }}{{ formatDate(initialUser.creationDate) }}
            </div>

            <div class="d-flex justify-end ga-2 px-6 pb-4">
                <CancelButton
                    :data-testid="`${dataTestPrefix}-cancel-button`"
                    text="general.cancelButton"
                    @click="emit('cancel')"
                />
                <ConfirmButton
                    :data-testid="`${dataTestPrefix}-save-button`"
                    text="general.saveButton"
                    :disabled="mode !== 'create' && !isDirty"
                    @click="submit"
                />
            </div>

            <ChangePasswordDialog
                v-if="mode !== 'create' && initialUser?.username"
                ref="changePasswordDialogRef"
                v-model="changePasswordDialogOpen"
                :username="initialUser.username"
                :loading="changePasswordLoading"
                @submit="emitChangePassword"
            />
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import moment from "moment-timezone";
import i18n from "@/i18n";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import HintText from "@/components/widgets/HintText.vue";
import UserAccountPreviewCard from "@/components/layout/pages/widgets/UserAccountPreviewCard.vue";
import ChangePasswordDialog from "./ChangePasswordDialog.vue";
import { useDirtyTracking } from "@/composables/useDirtyTracking.ts";
import {
    useUserAccountFormFields,
    type UserAccountFormMode,
} from "@/pages/(app)/user-account/composables/useUserAccountFormFields.ts";
import { UserRoleEnum } from "@/models/userRoleEnum.ts";
import type { BackendFieldAliasMap } from "@/services/errors/types.ts";
import {
    applyBackendFieldErrors,
    type ApplyBackendErrorsResult,
} from "@/services/errors/formErrorMapping.ts";
import type {
    UserAccountCreateRequest,
    UserAccountRole,
} from "@/models/userAccount.ts";
import type { UserInfo } from "@/api/seb-server/generated/hey-api/types.gen.ts";

const USER_ACCOUNT_ROLES: ReadonlySet<string> = new Set(
    Object.values(UserRoleEnum),
);
const isUserAccountRole = (role: string): role is UserAccountRole =>
    USER_ACCOUNT_ROLES.has(role);
const toUserAccountRole = (role: string): UserAccountRole | undefined =>
    isUserAccountRole(role) ? role : undefined;

const USER_ACCOUNT_FIELD_ALIASES = {
    timeZone: "timezone",
    userRoles: "role",
    confirmNewPassword: "confirmPassword",
} satisfies BackendFieldAliasMap;

export type ChangePasswordPayload = {
    adminPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

const props = defineProps<{
    title: string;
    mode: UserAccountFormMode;
    initialUser?: UserInfo;
    dataTestPrefix: string;
    changePasswordLoading?: boolean;
}>();

const emit = defineEmits<{
    createSubmit: [payload: UserAccountCreateRequest];
    editSubmit: [payload: UserInfo];
    cancel: [];
    changePassword: [payload: ChangePasswordPayload];
}>();

const leftFormRef = ref<InstanceType<typeof FormBuilder>>();
const rightFormRef = ref<InstanceType<typeof FormBuilder>>();
const changePasswordDialogRef =
    ref<InstanceType<typeof ChangePasswordDialog>>();
const changePasswordDialogOpen = ref(false);

const {
    leftFormFields,
    rightFormFields,
    loading,
    errors,
    institutionId,
    username,
    name,
    surname,
    email,
    timezone,
    password,
    confirmPassword,
    role,
} = useUserAccountFormFields(props.mode);

const roleDescription = computed(() => {
    if (!role.value) {
        return i18n.global.t("userAccount.general.role.pleaseselect");
    }
    return i18n.global.t(`userAccount.general.role.info.${role.value}`);
});

const getHighestRole = (
    roles: ReadonlyArray<UserAccountRole>,
): UserAccountRole | undefined => {
    if (roles.includes(UserRoleEnum.SEB_SERVER_ADMIN)) {
        return UserRoleEnum.SEB_SERVER_ADMIN;
    }
    if (roles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN)) {
        return UserRoleEnum.INSTITUTIONAL_ADMIN;
    }
    if (roles.includes(UserRoleEnum.EXAM_ADMIN)) {
        return UserRoleEnum.EXAM_ADMIN;
    }
    if (roles.includes(UserRoleEnum.TEACHER)) {
        return UserRoleEnum.TEACHER;
    }
    return roles.length > 0 ? UserRoleEnum.EXAM_SUPPORTER : undefined;
};

const { isDirty, snapshot } = useDirtyTracking(() => ({
    institutionId: institutionId.value ?? "",
    username: username.value ?? "",
    name: name.value ?? "",
    surname: surname.value ?? "",
    email: email.value ?? "",
    timezone: timezone.value ?? "",
    role: role.value ?? "",
}));

const hydrate = (user: UserInfo) => {
    institutionId.value = user.institutionId.toString();
    username.value = user.username;
    name.value = user.name;
    surname.value = user.surname;
    email.value = user.email ?? "";
    timezone.value = user.timezone;
    role.value = getHighestRole(user.userRoles);
    snapshot();
};

onMounted(() => {
    if (props.initialUser) {
        hydrate(props.initialUser);
    }
});

watch(
    () => props.initialUser,
    (user) => {
        if (user) {
            hydrate(user);
        }
    },
);

const formatDate = (iso?: string): string => {
    if (!iso) return "";
    return moment(iso).format("MMM D, YYYY");
};

const buildUserRoles = (
    selectedRole: string,
): UserInfo["userRoles"] | undefined => {
    const userAccountRole = toUserAccountRole(selectedRole);
    if (!userAccountRole) {
        return undefined;
    }

    if (selectedRole === UserRoleEnum.INSTITUTIONAL_ADMIN) {
        return [
            UserRoleEnum.INSTITUTIONAL_ADMIN,
            UserRoleEnum.EXAM_ADMIN,
            UserRoleEnum.EXAM_SUPPORTER,
        ];
    }
    if (selectedRole === UserRoleEnum.EXAM_ADMIN) {
        return [UserRoleEnum.EXAM_ADMIN, UserRoleEnum.EXAM_SUPPORTER];
    }
    return [userAccountRole];
};

const submit = async () => {
    const [leftResult, rightResult] = await Promise.all([
        leftFormRef.value?.validate(),
        rightFormRef.value?.validate(),
    ]);
    if (!leftResult?.valid || !rightResult?.valid) return;

    if (
        !institutionId.value ||
        !username.value ||
        !name.value ||
        !surname.value ||
        !timezone.value ||
        !role.value
    ) {
        return;
    }

    const selectedUserRoles = buildUserRoles(role.value);
    if (!selectedUserRoles) {
        return;
    }

    const baseUserAccount = {
        institutionId: Number(institutionId.value),
        username: username.value,
        name: name.value,
        surname: surname.value,
        email: email.value,
        language: "en",
        timezone: timezone.value,
    };

    if (props.mode === "create") {
        if (!password.value || !confirmPassword.value) {
            return;
        }

        emit("createSubmit", {
            ...baseUserAccount,
            userRoles: selectedUserRoles,
            newPassword: password.value,
            confirmNewPassword: confirmPassword.value,
        });
        return;
    }

    if (!props.initialUser) {
        return;
    }

    emit("editSubmit", {
        ...props.initialUser,
        ...baseUserAccount,
        userRoles:
            props.mode === "profile"
                ? props.initialUser.userRoles
                : selectedUserRoles,
    });
};

const emitChangePassword = (payload: ChangePasswordPayload) => {
    emit("changePassword", payload);
};

function applyBackendErrors(error: unknown): ApplyBackendErrorsResult {
    return applyBackendFieldErrors(error, {
        aliases: USER_ACCOUNT_FIELD_ALIASES,
        forms: [
            {
                form: leftFormRef.value,
                fields: leftFormFields.value.map((field) => field.name),
            },
            {
                form: rightFormRef.value,
                fields: rightFormFields.value.map((field) => field.name),
            },
        ],
    });
}

function applyChangePasswordBackendErrors(
    error: unknown,
): ApplyBackendErrorsResult | undefined {
    return changePasswordDialogRef.value?.applyBackendErrors(error);
}

defineExpose({
    snapshot,
    applyBackendErrors,
    applyChangePasswordBackendErrors,
});
</script>
