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
                <!-----------client group selection table---------->      
                <v-col cols="6"> 
    
                    <v-row>
                        <v-col cols="6">
                            <v-text-field
                                v-model="search"
                                label="Search"
                                prepend-inner-icon="mdi-magnify"
                                variant="outlined"
                                density="compact"
                                hide-details
                                single-line>
                            </v-text-field>
                        </v-col>
                    </v-row>
    
                    <v-row>
                        <v-col>
                            <v-data-table
                                item-value="quiz_id" 
                                :hover="true"
                                :items="clientGroups"
                                :items-length="clientGroups"
                                :items-per-page="tableUtils.calcDefaultItemsPerPage(clientGroups)"
                                :items-per-page-options="tableUtils.calcItemsPerPage(clientGroups)"
                                :headers="tableHeaders"
                                :search="search"
                            >
                                <template v-slot:item="{item}">
                                    <tr 
                                        class="on-row-hover" 
                                        @click="onTableRowClick(item)"
                                        :class="[examStore.selectedClientGroups.some(clientGroup => clientGroup.id == item.id) ? 'selected-row' : '']">
    
                                        <td>{{ item.name }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-col>
                <!------------------------>
    
    
                <!-----------selected client groups summary---------->      
                <v-col>
                    <v-row>
                        <v-col>
                            <div class="text-h6">Selected Client Groups</div>
                        </v-col>
                    </v-row>
    
                    <v-row>
                        <v-col>
    
                            <v-list select-strategy="leaf">

                                <v-list-item>
                                    <v-row>
                                        <v-col cols="6"></v-col>
                                        <v-col cols="5">
                                            Screen Proctoring
                                        </v-col>
                                        <v-col cols="1"></v-col>
                                    </v-row>
                                </v-list-item>

                                <template 
                                    v-for="clientGroup in examStore.selectedClientGroups"
                                    :key="clientGroup.id"
                                    :value="clientGroup.id">
                                
                                    <v-list-item>
                                        <v-row align="center">
                                            <v-col cols="6">
                                                {{ clientGroup.name }}
                                            </v-col>
                                            <v-col cols="5">
                                                <v-switch 
                                                    hide-details
                                                    color="primary">
                                                </v-switch>
                                            </v-col>
                                            <v-col cols="1">
                                                <v-btn 
                                                    @click="removeClientGroup(clientGroup.id!)"
                                                    variant="flat"
                                                    icon="mdi-close">
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-list-item>
    
                                    <v-divider class="border-opacity-25" :thickness="2"></v-divider>
    
                                </template>
                            </v-list>
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
        closeClientGroupDialog: any;
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