<template>
    <v-menu
        v-model="isOpen"
        :close-on-content-click="false"
        location="bottom end"
        :offset="[20, 8]"
        transition="fade-transition"
    >
        <template #activator="{ props: menuProps }">
            <v-btn
                v-bind="menuProps"
                :active="false"
                :aria-label="t('navigation.screenReader.profile')"
                class="text-none rounded-lg overflow-hidden pa-0 pe-2 ps-1"
                :color="isOpen ? 'primary' : 'surface'"
                data-testid="layout-profile-button"
                :ripple="false"
                size="large"
                :variant="isOpen ? 'tonal' : 'flat'"
            >
                <div class="d-flex align-center ga-3">
                    <UserAvatar
                        :name="userAccount?.name"
                        :surname="userAccount?.surname"
                        class="text-body-medium"
                    />

                    <div class="text-left">
                        <div class="text-body-medium font-weight-bold">
                            {{ fullName }}
                        </div>
                        <div class="text-body-small text-medium-emphasis">
                            {{ primaryRoleLabel }}
                        </div>
                    </div>

                    <v-icon
                        :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                        size="small"
                    />
                </div>
            </v-btn>
        </template>

        <v-card
            class="overflow-hidden rounded-lg"
            elevation="4"
            max-width="24rem"
        >
            <div class="bg-primary pa-5 text-white">
                <div class="d-flex align-center ga-4">
                    <v-avatar
                        class="font-weight-black rounded-lg text-title-large text-white border-sm"
                        border
                        color="white"
                        density="comfortable"
                        size="x-large"
                        variant="tonal"
                    >
                        {{ initials }}
                    </v-avatar>

                    <div>
                        <div class="text-title-large font-weight-black">
                            {{ userAccount?.username }}
                        </div>
                        <div class="text-body-small opacity-80">
                            {{ fullName }}
                        </div>
                    </div>
                </div>

                <div
                    v-if="translatedRoles.length > 0"
                    class="d-flex flex-wrap ga-2 mt-3"
                >
                    <v-chip
                        v-for="role in translatedRoles"
                        :key="role"
                        class="font-weight-bold h-auto py-1 text-wrap text-white border-sm"
                        color="white"
                        label
                        size="small"
                        variant="tonal"
                        border
                    >
                        <span class="text-break">
                            {{ role }}
                        </span>
                    </v-chip>
                </div>
            </div>

            <div class="d-flex border-b-thin">
                <template
                    v-for="(action, idx) in quickActions"
                    :key="action.label"
                >
                    <v-divider v-if="idx > 0" vertical />
                    <v-btn
                        :active="false"
                        class="flex-1-1-0 text-none"
                        color="primary"
                        :prepend-icon="action.icon"
                        size="small"
                        stacked
                        :href="action.href"
                        :rel="action.rel"
                        :target="action.target"
                        :to="action.to"
                        variant="text"
                        @click="closeMenu"
                    >
                        <span class="font-weight-medium text-body-medium">
                            {{ action.label }}
                        </span>
                    </v-btn>
                </template>
            </div>

            <div class="py-1">
                <v-btn
                    :active="false"
                    block
                    class="justify-start text-none"
                    color="error"
                    prepend-icon="mdi-logout"
                    variant="text"
                    @click="handleLogout"
                >
                    <span class="font-weight-bold text-body-medium">{{
                        t("navigation.profileMenu.logout")
                    }}</span>
                </v-btn>
            </div>
        </v-card>
    </v-menu>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { isTeacherOnlyAccount, type UserAccount } from "@/models/userAccount";
import { typedTo } from "@/router/typedTo";
import UserAvatar from "@/components/widgets/UserAvatar.vue";

const props = defineProps<{
    userAccount?: UserAccount;
}>();

const emit = defineEmits<{
    logout: [];
}>();

const { t } = useI18n();

const isOpen = ref(false);

const rolePriority = [
    "SEB_SERVER_ADMIN",
    "INSTITUTIONAL_ADMIN",
    "EXAM_ADMIN",
    "EXAM_SUPPORTER",
    "TEACHER",
];

const sortedUserRoles = computed(() => {
    const userRoles = props.userAccount?.userRoles ?? [];

    return [...userRoles].sort((a, b) => {
        const indexA = rolePriority.indexOf(a);
        const indexB = rolePriority.indexOf(b);
        return indexA - indexB;
    });
});

const primaryRoleLabel = computed(() => {
    const primaryRole = sortedUserRoles.value[0];
    return primaryRole ? translateUserRole(primaryRole) : "";
});

const translatedRoles = computed(() =>
    sortedUserRoles.value.map((role) => translateUserRole(role)),
);

const initials = computed(() => {
    const nameInitial = props.userAccount?.name?.[0] ?? "";
    const surnameInitial = props.userAccount?.surname?.[0] ?? "";
    return (nameInitial + surnameInitial).toUpperCase();
});

const fullName = computed(() => {
    const name = props.userAccount?.name ?? "";
    const surname = props.userAccount?.surname ?? "";
    return `${name} ${surname}`.trim();
});

// Teacher accounts are auto-generated and cannot be edited, so they have no
// profile settings to manage.
const isTeacherAccount = computed(() =>
    isTeacherOnlyAccount(props.userAccount?.userRoles),
);

const quickActions = computed(() => {
    const profileSettings = {
        icon: "mdi-account-cog-outline",
        label: t("titles.profileSettings"),
        href: undefined,
        rel: undefined,
        target: undefined,
        to: typedTo({ name: "/(app)/profile/" }),
    };
    const docs = {
        icon: "mdi-file-document-outline",
        label: t("navigation.profileMenu.docs"),
        href: "https://seb-server.readthedocs.io/en/latest/index.html",
        rel: "noopener noreferrer",
        target: "_blank",
        to: undefined,
    };
    return isTeacherAccount.value ? [docs] : [profileSettings, docs];
});

function translateUserRole(role: string): string {
    const translationKey = `general.userRoles.${role}`;
    const translatedRole = t(translationKey);
    return translatedRole === translationKey ? role : translatedRole;
}

function closeMenu() {
    isOpen.value = false;
}

function handleLogout() {
    closeMenu();
    emit("logout");
}
</script>
