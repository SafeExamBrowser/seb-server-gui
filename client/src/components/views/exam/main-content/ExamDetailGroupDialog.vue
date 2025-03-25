<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Edit Client Groups"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeClientGroupDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
    
                <!-----------selected client groups summary---------->      
                <v-col>
                    <v-row>
                        <v-col>
                            <!--@vue-ignore-->
                            <v-data-table 
                                hide-default-footer
                                item-value="id" 
                                class="rounded-lg elevation-4"
                                :headers="tableHeaders" 
                                :items="clientGroups">

                                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                                    <TableHeaders
                                        :columns="columns"
                                        :is-sorted="isSorted"
                                        :get-sort-icon="getSortIcon"
                                        :toggle-sort="toggleSort"
                                        :header-refs-prop="tableHeadersRef">
                                    </TableHeaders>
                                </template>

                                <template v-slot:item.isScreenProctoring="{ item }">
                                    <v-btn 
                                        @click="enableScreenProctoringTemp(item)"
                                        variant="flat"
                                        :icon="item.isScreenProctoringTemp ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'">
                                    </v-btn>
                                </template>
                                <template v-slot:item.edit="{ item }">
                                    <v-btn 
                                        variant="text" 
                                        icon="mdi-pencil-outline">
                                    </v-btn>
                                </template>

                                <template v-slot:item.delete="{ item }">
                                    <v-btn 
                                        variant="text" 
                                        icon="mdi-delete-outline">
                                    </v-btn>
                                </template>
                                
                            </v-data-table>
    
                        </v-col>
                    </v-row>
    
                </v-col>
                <!------------------------>
    
            </v-row>
        </v-card-text>
    </v-card>
</template>


<script setup lang="ts">
    import { useExamStore } from '@/stores/examStore';
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as clientGroupViewService from "@/services/component-services/clientGroupViewService";
    import TableHeaders from "@/utils/table/TableHeaders.vue";

    //stores
    const examStore = useExamStore();

    //items
    const clientGroups = ref<ClientGroup[]>([]);

    //table
    const tableHeadersRef = ref<any[]>();
    const tableHeaders = ref([
        {title: "Name", key: "name", width: "70%"},
        {title: "Screen Proctoring", key: "isScreenProctoring", sortable: false, width: "20%", center: true, align: "center"},
        {title: "Edit", key: "edit", sortable: false, width: "5%", center: true, align: "center"},
        {title: "Delete", key: "delete", sortable: false, width: "5%", center: true, align: "center"}
    ]);    


    //local user search / filter
    const search = ref<string>();

    //emits
    const emit = defineEmits<{
        closeClientGroupDialog: any;
    }>();



    //=======================events & watchers=======================
    onBeforeMount(async () => {
        if(examStore.selectedExam == null){
            return;
        }

        const clientGroupResponse: ClientGroups | null = await clientGroupViewService.getClientGroups(examStore.selectedExam.id.toString());

        if(clientGroupResponse == null){
            return;
        }

        clientGroups.value = clientGroupResponse.content;
    });

    //add client group
    async function onTableRowClick(selectedClientGroup: ClientGroup){
        const index: number = examStore.selectedClientGroups.findIndex(clientGroup => clientGroup.id == selectedClientGroup.id);
        
        if(index != -1){
            examStore.selectedClientGroups.splice(index, 1);
            return;
        }

        // const userAccountFull: UserAccount | null = await userAccountViewService.getUserAccountById(selectedClientGroup.id);

        // if(userAccountFull == null){
        //     return;
        // }

        examStore.selectedClientGroups.push(selectedClientGroup);
    }

    function removeClientGroup(id: number){
        const index: number = examStore.selectedClientGroups.findIndex(clientGroup => clientGroup.id == id);
        examStore.selectedClientGroups.splice(index, 1);
    }


    function enableScreenProctoringTemp(clientGroup: ClientGroup){
        clientGroup.isScreenProctoringTemp = !clientGroup.isScreenProctoringTemp;
    }

    

</script>

<style scoped>

    .on-row-hover:hover{
        background: #e4e4e4 !important;
        cursor: pointer;
    }

    .selected-row {
        background-color: #e4e4e4 !important;
    }


</style>