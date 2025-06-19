<template>
    <tr>
        <template v-for="(column, index) in props.columns">

            <th 
                :style="{ width: column.width }" 
                :class="[column.key == 'data-table-select' ? 'pl-4' : '', column.center ? 'text-center': '']"> 
                
                <!------------------------sorting---------------------------------->
                <span 
                    v-if="column.sortable"
                    ref="headerRefs"
                    tabindex="0" 
                    class="mr-2 cursor-pointer font-weight-bold" 
                    role="button" 
                    :aria-label="getHeaderDescription(column, isSorted)"
                    @keydown="tableUtils.handleTabKeyEvent($event, 'sort', index, {headerRefs: headerRefs})" 
                    @click="() => props.toggleSort(column)">
                    {{ column.title }}  
                </span>
                <span v-else>
                    {{ column.title }}
                </span>

                <template v-if="props.isSorted(column)">
                    <v-icon :icon="props.getSortIcon(column)"></v-icon>
                </template>

                <!------------------------selection-------------------------------->
                <template v-if="column.key == 'data-table-select' && props.selectAll != null" class="ma-0 pa-0">
                    <v-checkbox-btn 
                        v-model="props.allSelected"
                        :indeterminate="someSelected && !allSelected"
                        @click="props.selectAll(props.allSelected ? false : true)">
                    </v-checkbox-btn>
                </template>

                <!------------------------sp: session search: delete----------------------->
                <template v-if="column.key == 'data-table-expand' && tableKey == 'session'">
                    <v-btn 
                        class="pr-4"
                        icon="mdi-delete" 
                        variant="text"
                        :disabled="!someSelected"
                        @click="emit('openDeleteSessionsDialog')">
                    </v-btn>
                </template>
  
                <!------------------------sp: session search: show name / ip--------------------------->
                <template v-if="column.key == 'clientName' && tableKey == 'session'">
                    <v-btn 
                        :aria-label="tableStore.isIpDisplayList[tableUtils.getSessionListIndex(props.day!)].isIp ? 'show login name' : 'show IP'"
                        :icon="tableStore.isIpDisplayList[tableUtils.getSessionListIndex(props.day!)].isIp ? 'mdi-toggle-switch-outline' : 'mdi-toggle-switch-off-outline'" 
                        rounded="sm" 
                        variant="flat" 
                        @click="toggleNameIpSwitch()">
                    </v-btn>
                </template>
                <!----------------------------------------------------------------->

                <template v-if="tableKey == 'monitoringClients' && column.key == 'status' && !tableStore.isIndicatorExpandButtonDisabled && (monitoringStore.batteryIndicatorId != null || monitoringStore.wlanIndicatorId != null)">
                    <v-btn 
                        :aria-label="tableStore.isIndicatorsExpanded ? 'hide exam details' : 'show exam details'"
                        :icon="tableStore.isIndicatorsExpanded ? 'mdi-arrow-expand-left' : 'mdi-arrow-expand-right'" 
                        rounded="sm" 
                        variant="flat" 
                        size="small"
                        @click="tableStore.isIndicatorsExpanded ? emit('removeIndicatorHeaders') : emit('addIndicatorHeaders')">
                    </v-btn>
                </template>
            </th>
        </template>

    </tr>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, onBeforeUnmount } from "vue";
    import * as tableUtils from "@/utils/table/tableUtils";
    import { useAppBarStore, useTableStore } from "@/stores/store";
    import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";

    //stores
    // const appBarStore = useAppBarStore();
    const tableStore = useTableStore();
    const monitoringStore = useMonitoringStore()

    //header reactivity
    const headerRefs = ref<any[] | null>();

    //props
    const props = defineProps<{
        columns: any[];
        isSorted: (column: any) => boolean;
        getSortIcon: any
        toggleSort: (column: any) => void;
        headerRefsProp: any;
        day?: string;
        selectAll?: (value: boolean) => void;
        allSelected?: boolean;
        someSelected?: boolean;
        tableKey?: string
    }>();

    //custom: start page
    const emit = defineEmits<{
        addIndicatorHeaders: any;
        removeIndicatorHeaders: any;
        openDeleteSessionsDialog: any;
    }>();

    onBeforeMount(() => {
        headerRefs.value = props.headerRefsProp;
    });

    onBeforeUnmount(() => {
        headerRefs.value = null;
    });

    function toggleNameIpSwitch(){
        const index: number = tableUtils.getSessionListIndex(props.day!);

        if(tableStore.isIpDisplayList[index].isIp){
            tableStore.isIpDisplayList[index].isIp = false;
            return;
        }

        tableStore.isIpDisplayList[index].isIp = true;
    }

    function getHeaderDescription(column: any, isSorted: any): any{
        let headerDesc: string = `Header: ${column.title}, sort order: `

        if(!isSorted(column)){
            return `${headerDesc} none`;
        }

        if(props.getSortIcon(column) == "$sortAsc"){
            return `${headerDesc} ascending`;
        }

        if(props.getSortIcon(column) == "$sortDesc"){
            return `${headerDesc} descending`;
        }

        return `${headerDesc} none`;
    }

</script>

<style scoped>
</style>