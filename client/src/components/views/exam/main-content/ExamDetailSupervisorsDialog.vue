<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Edit Supervisors"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeSupervisorsDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <!-----------user selection table---------->      
                <v-col cols="7"> 
    
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
                                :items="userAccountNames"
                                :items-length="userAccountNames.length"
                                :items-per-page="tableUtils.calcDefaultItemsPerPage(userAccountNames)"
                                :items-per-page-options="tableUtils.calcItemsPerPage(userAccountNames)"
                                :headers="tableHeaders"
                                :search="search"
                            >
                                <template v-slot:item="{item}">
                                    <tr 
                                        class="on-row-hover" 
                                        @click="onTableRowClick(item)"
                                        :class="[examStore.selectedExamSupervisors.some(userAccount => userAccount.uuid == item.modelId) ? 'selected-row' : '']">
    
                                        <td>{{ item.name }}</td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-col>
                <!------------------------>
    
    
                <!-----------user list summary---------->      
                <v-col cols="3">
                    <v-row>
                        <v-col>
                            <div class="text-h6">Selected Supervisors</div>
                        </v-col>
                    </v-row>
    
                    <v-row>
                        <v-col>
    
                            <v-list select-strategy="leaf">
                                <template 
                                    v-for="supervisor in examStore.selectedExamSupervisors"
                                    :key="supervisor.uuid"
                                    :value="supervisor.uuid">
                                
                                    <v-list-item>
                                        <v-list-item-title>{{ supervisor.name }}</v-list-item-title>
    
                                        <template v-slot:append="{ isSelected }">
                                            <v-list-item-action class="flex-column align-end">
                                                <v-spacer></v-spacer>
    
                                                <v-btn 
                                                    @click="removeExamSupervisor(supervisor.uuid)"
                                                    variant="flat"
                                                    icon="mdi-checkbox-marked">
                                                </v-btn>
    
                                            </v-list-item-action>
                                        </template>
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
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import * as tableUtils from "@/utils/table/tableUtils";
    
    //stores
    const examStore = useExamStore();

    //items
    const userAccountNames = ref<UserAccountName[]>([]);

    //table
    const tableHeaders = ref([
        {title: "Name", key: "name"}
    ]);    

    //local user search / filter
    const search = ref<string>();

    //emits
    const emit = defineEmits<{
        closeSupervisorsDialog: any;
    }>();


    //=======================events & watchers=======================
    onBeforeMount(async () => {
        const userAccountNamesResponse: UserAccountName[] | null = await userAccountViewService.getUserAccountNames();

        if(userAccountNamesResponse == null){
            return;
        }
        userAccountNames.value = userAccountNamesResponse;
    });

    //add exam supervisor
    async function onTableRowClick(selectedUserAccount: UserAccountName){
        const index: number = examStore.selectedExamSupervisors.findIndex(userAccount => userAccount.uuid == selectedUserAccount.modelId);
        
        if(index != -1){
            examStore.selectedExamSupervisors.splice(index, 1);
            return;
        }

        const userAccountFull: UserAccount | null = await userAccountViewService.getUserAccountById(selectedUserAccount.modelId);

        if(userAccountFull == null){
            return;
        }

        examStore.selectedExamSupervisors.push(userAccountFull);
    }

    function removeExamSupervisor(supervisorId: string){
        const index: number = examStore.selectedExamSupervisors.findIndex(userAccount => userAccount.uuid == supervisorId);
        examStore.selectedExamSupervisors.splice(index, 1);
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