<template>

    <v-row>
        <v-col class="text-subtitle-1">
            Filter
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-checkbox-btn label="Active URL Filtering"></v-checkbox-btn>
        </v-col>
        <v-col>
            <v-checkbox-btn label="Filter also embedded content"></v-checkbox-btn>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-data-table 
                hide-default-footer
                item-value="id" 
                class="rounded-lg elevation-4"
                density="compact"
                :headers="urlFiltersHeaders" 
                :items="urlFilters">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                    <TableHeaders
                        :columns="columns"
                        :is-sorted="isSorted"
                        :get-sort-icon="getSortIcon"
                        :toggle-sort="toggleSort"
                        :header-refs-prop="urlFiltersHeadersRef">
                    </TableHeaders>
                </template>
            </v-data-table>
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="6">
            <div class="text-subtitle-1"> 
                Proxies
            </div>

            <v-radio-group>
                <v-radio label="Use system proxy setting" value="one"></v-radio>
                <v-radio label="Use SEB proxy settings" value="two"></v-radio>
            </v-radio-group>

            <v-checkbox-btn label="Exclude simple hostnames"></v-checkbox-btn>

            <v-text-field
                hide-details
                label="Bypass proxy settings for these hosts and domains"
                density="compact"
                type="text"
                variant="outlined">
            </v-text-field>

            <v-checkbox-btn label="Use Passive FTP Mode (PASV)"></v-checkbox-btn>
        </v-col>

        <v-col cols="6">
            <div class="text-subtitle-1"> 
                Double click a protocol to configure:
            </div>

            <v-data-table 
                hide-default-footer
                item-value="id" 
                class="rounded-lg elevation-4"
                density="compact"
                :headers="protocolsHeaders" 
                :items="protocols">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                    <TableHeaders
                        :columns="columns"
                        :is-sorted="isSorted"
                        :get-sort-icon="getSortIcon"
                        :toggle-sort="toggleSort"
                        :header-refs-prop="protocolsHeadersRef">
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





    const urlFiltersHeadersRef = ref<any[]>();
    const urlFiltersHeaders = ref([
        {title: "Active", key: "active"},
        {title: "Protocol", key: "protocol"},
    ]);

    const urlFilters: {active: boolean, protocol: string}[] = [
        {
            active: false,
            protocol: "Streaming Proxy (RTSP)",
        },
        {
            active: true,
            protocol: "Auto Proxy Discovery",
        },
        {
            active: false,
            protocol: "SOCKS Proxy",
        },
        {
            active: true,
            protocol: "FTP Proxy",
        }
    ];



    const protocolsHeadersRef = ref<any[]>();
    const protocolsHeaders = ref([
        {title: "Active", key: "active"},
        {title: "Regex", key: "regex"},
        {title: "Expression", key: "expression"},
        {title: "Action", key: "action"},
    ]);

    const protocols: {active: boolean, regex: boolean, expression: string, action: string}[] = [
        {
            active: true,
            regex: true,
            expression: "test1",
            action: "allow"
        },
        {
            active: false,
            regex: true,
            expression: "test2",
            action: "allow"
        },
        {
            active: true,
            regex: false,
            expression: "test3",
            action: "block"
        },
        {
            active: false,
            regex: true,
            expression: "test4",
            action: "block"
        },
        {
            active: true,
            regex: false,
            expression: "test5",
            action: "allow"
        }
    ];

</script>