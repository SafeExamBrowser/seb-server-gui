<template>
    <v-row>
        <v-col>
            <v-checkbox-btn label="Allow switching to third party application (Mac)"></v-checkbox-btn>
        </v-col>
        <v-col>
            <v-checkbox-btn label="Allow Flash to switch to fullscreen mode (Mac)"></v-checkbox-btn>
        </v-col>
    </v-row>

    <v-row>
        <v-col class="text-subtitle-1">
            Permitted Processes
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-data-table 
                hide-default-footer
                item-value="id" 
                class="rounded-lg elevation-4"
                density="compact"
                :items-per-page="tableUtils.calcDefaultItemsPerPage(permittedProcesess)" 
                :items-per-page-options="tableUtils.calcItemsPerPage(permittedProcesess)"
                :headers="permittedProcesessHeaders" 
                :items="permittedProcesess">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                    <TableHeaders
                        :columns="columns"
                        :is-sorted="isSorted"
                        :get-sort-icon="getSortIcon"
                        :toggle-sort="toggleSort"
                        :header-refs-prop="permittedProcesessHeadersRef">
                    </TableHeaders>
                </template>
            </v-data-table>
        </v-col>
    </v-row>

    <v-row class="mt-10">
        <v-col class="text-subtitle-1">
            Prohibited Processes
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-data-table 
                hide-default-footer
                item-value="id" 
                class="rounded-lg elevation-4"
                density="compact"
                :headers="prohibitedProcesessHeaders" 
                :items="prohibitedProcesess">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                    <TableHeaders
                        :columns="columns"
                        :is-sorted="isSorted"
                        :get-sort-icon="getSortIcon"
                        :toggle-sort="toggleSort"
                        :header-refs-prop="prohibitedProcesessHeadersRef">
                    </TableHeaders>
                </template>
            </v-data-table>
        </v-col>
    </v-row>



</template>

<script setup lang="ts">
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as timeUtils from "@/utils/timeUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";



    const permittedProcesessHeadersRef = ref<any[]>();
    const permittedProcesessHeaders = ref([
        {title: "Active", key: "active"},
        {title: "OS", key: "os"},
        {title: "Executable", key: "executable"},
        {title: "Title", key: "title"},
    ]);

    const permittedProcesess: {active: boolean, os: string, executable: string, title: string}[] = [
        {
            active: true,
            os: "Windows",
            executable: "windows.exe",
            title: "Windows process"
        },
        {
            active: true,
            os: "Mac",
            executable: "",
            title: "Windows process"
        },
        {
            active: false,
            os: "Windows",
            executable: "windows.exe",
            title: "Windows process"
        },
        {
            active: true,
            os: "Windows",
            executable: "windows.exe",
            title: "Windows process"
        },
        {
            active: true,
            os: "Mac",
            executable: "",
            title: "Windows process"
        },
        {
            active: false,
            os: "Windows",
            executable: "windows.exe",
            title: "Windows process"
        }
    ];


    const prohibitedProcesessHeadersRef = ref<any[]>();
    const prohibitedProcesessHeaders = ref([
        {title: "Active", key: "active"},
        {title: "OS", key: "os"},
        {title: "Executable", key: "executable"},
        {title: "Description", key: "description"},
    ]);

    const prohibitedProcesess: {active: boolean, os: string, executable: string, description: string}[] = [
        {
            active: true,
            os: "Windows",
            executable: "windows.exe",
            description: "Windows process"
        },
        {
            active: true,
            os: "Mac",
            executable: "",
            description: "Windows process"
        },
        {
            active: false,
            os: "Windows",
            executable: "windows.exe",
            description: "test1324"
        }
    ];






</script>