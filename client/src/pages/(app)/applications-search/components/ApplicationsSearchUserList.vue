<template>
    <v-list>
        <v-list-item
            v-for="userItem in userList"
            :key="userItem.sessionUuid"
            :subtitle="getSubtile(userItem.count)"
            :title="userItem.username"
        >
            <template #append>
                <v-btn
                    icon="mdi-movie-play"
                    variant="text"
                    @click="
                        openRouteInNewTab({
                            name: '/(app)/sp-recording/application-search/[sessionId]/',
                            params: { sessionId: userItem.sessionUuid },
                            query: {
                                ...(props.metadataApp
                                    ? { metadataApp: props.metadataApp }
                                    : {}),
                                ...(props.metadataWindow
                                    ? { metadataWindow: props.metadataWindow }
                                    : {}),
                            },
                        })
                    "
                >
                </v-btn>
                <v-btn
                    icon="mdi-video"
                    variant="text"
                    @click="
                        openRouteInNewTab({
                            name: '/(app)/sp-recording/[sessionId]/',
                            params: { sessionId: userItem.sessionUuid },
                            query: {
                                searchTimestamp:
                                    userItem.firstScreenshotCaptureTime.toString(),
                            },
                        })
                    "
                >
                </v-btn>
            </template>
        </v-list-item>
    </v-list>
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
        return null;
    }

    userList.value = userListLocal;
});

function getSubtile(count: number): string {
    return "Total: " + count;
}
</script>

<style scoped></style>
