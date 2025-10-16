<template>
    <v-list>
        <v-list-item
            v-for="userItem in userList"
            :key="userItem.sessionUuid"
            :subtitle="getSubtile(userItem.count)"
            :title="userItem.username"
        >
            <template #append>
                <!--todo: maybe move openProctoringView to general utils file-->
                <v-btn
                    icon="mdi-movie-play"
                    variant="text"
                    @click="
                        searchViewService.openProctoringApplicationSearch(
                            userItem.sessionUuid,
                            props.metadataApp,
                            props.metadataWindow,
                        )
                    "
                >
                </v-btn>
                <v-btn
                    icon="mdi-video"
                    variant="text"
                    @click="
                        searchViewService.openProctoringView(
                            userItem.sessionUuid,
                            userItem.firstScreenshotCaptureTime.toString(),
                        )
                    "
                >
                </v-btn>
            </template>
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import * as applicationsSearchViewService from "@/services/screen-proctoring/component-services/applicationsSearchViewService";
import * as generalUtils from "@/utils/generalUtils";
import * as searchViewService from "@/services/screen-proctoring/component-services/searchViewService";
import { UserListForApplicationSearchRecord } from "@/models/screen-proctoring/applicationSearch";

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
        await applicationsSearchViewService.getUserListForApplicationSearch(
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
