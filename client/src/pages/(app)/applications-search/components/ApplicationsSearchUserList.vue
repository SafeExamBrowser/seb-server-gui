<template>
    <div>
        <v-sheet
            v-for="userItem in userList"
            :key="userItem.sessionUuid"
            border
            rounded="lg"
            class="d-flex align-center ga-3 px-3 py-2 mb-2"
        >
            <v-avatar color="blue-lighten-5" rounded="lg" size="36">
                <span class="text-primary font-weight-bold text-caption">
                    {{ initials(userItem.username) }}
                </span>
            </v-avatar>

            <div class="flex-grow-1" :style="{ minWidth: 0 }">
                <div class="text-body-2 font-weight-bold">
                    {{ userItem.username }}
                </div>
                <div class="text-caption text-medium-emphasis text-truncate">
                    {{ $t("applicationsSearch.total") }}: {{ userItem.count }} ·
                    {{ userItem.sessionUuid }}
                </div>
            </div>

            <v-btn
                icon="mdi-movie-play"
                variant="text"
                color="primary"
                :aria-label="$t('applicationsSearch.openApplicationRecording')"
                @click="handleOpenApplicationRecording(userItem)"
            />
            <v-btn
                icon="mdi-video"
                variant="text"
                color="primary"
                :aria-label="$t('applicationsSearch.openFullRecording')"
                @click="handleOpenFullRecording(userItem)"
            />
        </v-sheet>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import * as generalUtils from "@/utils/generalUtils";
import { UserListForApplicationSearchRecord } from "@/models/screen-proctoring/applicationSearch";
import { getUserListForApplicationSearch } from "@/services/screen-proctoring/applicationsSearchService.ts";
import { openRouteInNewTab } from "@/router/openRouteInNewTab.ts";

// props
const props = defineProps<{
    metadataApp: string;
    metadataWindow: string;
    groupIds: number[];
}>();

// main data
const userList = ref<UserListForApplicationSearchRecord[]>();

onBeforeMount(async () => {
    const userListLocal: UserListForApplicationSearchRecord[] | null =
        await getUserListForApplicationSearch(
            generalUtils.createStringCommaList(props.groupIds),
            props.metadataApp,
            props.metadataWindow,
        );

    if (userListLocal == null) {
        // todo: add error handling
        return;
    }

    userList.value = userListLocal;
});

function initials(username: string): string {
    return username.slice(0, 2).toUpperCase();
}

// Open the application-search recording, scoped to the current app / window.
function handleOpenApplicationRecording(
    userItem: UserListForApplicationSearchRecord,
): void {
    openRouteInNewTab({
        name: "/(app)/sp-recording/application-search/[sessionId]/",
        params: { sessionId: userItem.sessionUuid },
        query: {
            ...(props.metadataApp ? { metadataApp: props.metadataApp } : {}),
            ...(props.metadataWindow
                ? { metadataWindow: props.metadataWindow }
                : {}),
        },
    });
}

// Open the full session recording at the user's first screenshot.
function handleOpenFullRecording(
    userItem: UserListForApplicationSearchRecord,
): void {
    openRouteInNewTab({
        name: "/(app)/sp-recording/[sessionId]/",
        params: { sessionId: userItem.sessionUuid },
        query: {
            searchTimestamp: userItem.firstScreenshotCaptureTime.toString(),
        },
    });
}
</script>
