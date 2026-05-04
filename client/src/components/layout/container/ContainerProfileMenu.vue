<template>
    <div aria-label="Profile" class="d-flex align-center">
        <div class="d-flex flex-column align-end mr-2">
            <span class="text-body-2">
                {{ userAccount?.username }}
            </span>

            <v-chip
                v-if="primaryRole"
                color="primary"
                label
                size="small"
                variant="flat"
            >
                {{ translateUserRole(primaryRole) }}
            </v-chip>
        </div>

        <v-menu :close-on-content-click="false" location="bottom end">
            <template #activator="{ props: menuProps }">
                <div class="d-flex align-center">
                    <v-btn
                        v-bind="menuProps"
                        class="rounded-circle px-0 text-none"
                        color="primary"
                        size="large"
                        variant="outlined"
                    >
                        {{ initials }}
                    </v-btn>

                    <v-icon class="ml-1" color="grey-darken-1" size="18">
                        mdi-chevron-down
                    </v-icon>
                </div>
            </template>

            <v-list density="comfortable">
                <v-list-subheader>
                    {{ translate("navigation.loggedInAs") }}
                </v-list-subheader>

                <v-list-item
                    :title="fullName"
                    :subtitle="userAccount?.username ?? ''"
                />

                <div
                    v-if="translatedRoles.length > 0"
                    class="d-flex flex-wrap ga-2 px-4 py-2"
                >
                    <v-chip
                        v-for="role in translatedRoles"
                        :key="role"
                        color="primary"
                        label
                        size="small"
                        variant="flat"
                    >
                        {{ role }}
                    </v-chip>
                </div>

                <v-divider class="my-2" />

                <v-list-item
                    prepend-icon="mdi-account-cog-outline"
                    :title="translate('titles.profileSettings')"
                    :to="typedTo({ name: '/(app)/user-account/profile/' })"
                />

                <v-list-item
                    prepend-icon="mdi-file-document-outline"
                    title="Documentation"
                />

                <v-list-item
                    prepend-icon="mdi-logout"
                    title="Log out"
                    @click="$emit('logout')"
                />
            </v-list>
        </v-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { UserAccount } from "@/models/userAccount";
import { typedTo } from "@/router/routeNavigation";
import { translate } from "@/utils/generalUtils";

const props = defineProps<{
    userAccount: UserAccount | null | undefined;
}>();

defineEmits<{
    logout: [];
}>();

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

const primaryRole = computed(() => sortedUserRoles.value[0]);

const translatedRoles = computed(() =>
    sortedUserRoles.value.map((role) => translateUserRole(role)),
);

const initials = computed(() => {
    const nameInitial = props.userAccount?.name?.[0] ?? "";
    const surnameInitial = props.userAccount?.surname?.[0] ?? "";
    return nameInitial + surnameInitial;
});

const fullName = computed(() => {
    const name = props.userAccount?.name ?? "";
    const surname = props.userAccount?.surname ?? "";
    return `${name} ${surname}`.trim();
});

function translateUserRole(role: string): string {
    const translationKey = `general.userRoles.${role}`;
    const translatedRole = translate(translationKey);
    return translatedRole === translationKey ? role : translatedRole;
}
</script>
