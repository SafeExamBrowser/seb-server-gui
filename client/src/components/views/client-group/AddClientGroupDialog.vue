<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Add Client Groups"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeAddClientGroupDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
        </v-card-text>
    </v-card>
</template>


<script setup lang="ts">
    import { useExamStore } from '@/stores/examStore';
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as clientGroupViewService from "@/services/component-services/clientGroupViewService";

    
    //stores
    const examStore = useExamStore();

    //items
    const clientGroups = ref<ClientGroup[]>([]);

    //table
    const tableHeaders = ref([
        {title: "Name", key: "name"}
    ]);    

    //local user search / filter
    const search = ref<string>();

    //emits
    const emit = defineEmits<{
        closeAddClientGroupDialog: any;
    }>();


    //=======================events & watchers=======================
    onBeforeMount(async () => {
        const clientGroupResponse: ClientGroups | null = await clientGroupViewService.getClientGroups();

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