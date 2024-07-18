<template>
    <tr>
        <template v-for="(column, index) in props.columns">
            
            <!-- <th :aria-label="getHeaderDescription(column, isSorted)">  -->
            <th> 
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
            </th>
        </template>
    </tr>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, onBeforeUnmount } from "vue";
    import * as tableUtils from "@/utils/table/tableUtils";


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
    }>();

    //custom: start page
    const emit = defineEmits<{
        addAddtionalExamHeaders: any;
        removeAddtionalExamHeaders: any;
    }>();

    onBeforeMount(() => {
        headerRefs.value = props.headerRefsProp;
    });

    onBeforeUnmount(() => {
        headerRefs.value = null;
    });

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