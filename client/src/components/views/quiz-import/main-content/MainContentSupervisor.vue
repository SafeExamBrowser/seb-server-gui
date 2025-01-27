<template>

    <v-row>
        <v-col cols="7"> 
            <v-data-table
                item-value="quiz_id" 
                :hover="true"
                :items="userAccountNames"
                :items-length="userAccountNames.length"
                :items-per-page="tableUtils.calcDefaultItemsPerPage(userAccountNames)"
                :items-per-page-options="tableUtils.calcItemsPerPage(userAccountNames)"
                :headers="tableHeaders"
            >

                <template v-slot:item="{item}">
                    <tr 
                        class="on-row-hover" 
                        @click="onTableRowClick(item)"
                        :class="[quizImportStore.selectedExamSupervisors.some(userAccount => userAccount.modelId == item.modelId) ? 'selected-row' : '']">

                        <td>{{ item.name }}</td>
                    </tr>
                </template>
            
            
            </v-data-table>

        </v-col>

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
                            v-for="supervisors in quizImportStore.selectedExamSupervisors"
                            :key="supervisors.modelId"
                            :value="supervisors.modelId">
                        
                            <v-list-item>

                                <v-list-item-title>{{ supervisors.name }}</v-list-item-title>

                                <template v-slot:append="{ isSelected }">
                                    <v-list-item-action class="flex-column align-end">
                                        <v-spacer></v-spacer>

                                        <v-btn 
                                            @click="removeExamSupervisor(supervisors.modelId)"
                                            variant="flat"
                                            icon="mdi-checkbox-marked">
                                        </v-btn>

                                    </v-list-item-action>
                                </template>

                            </v-list-item>

                            <v-divider></v-divider>

                        </template>
                    </v-list>
                
                </v-col>
            </v-row>



        </v-col>
    
    
    </v-row>


</template>


<script setup lang="ts">
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import { useQuizImportStore } from "@/stores/quizImportStore";
    import * as tableUtils from "@/utils/table/tableUtils";
    
    //stores
    const quizImportStore = useQuizImportStore();

    //items
    const userAccountNames = ref<UserAccountName[]>([]);

    //table
    const tableHeaders = ref([
        {title: "Name", key: "name"}
    ]);    


    //=======================events & watchers=======================
    onBeforeMount(async () => {
        const userAccountNamesResponse: UserAccountName[] | null = await userAccountViewService.getUserAccountNames();

        if(userAccountNamesResponse == null){
            //todo: add error handling
            return;
        }
        console.log(userAccountNamesResponse)
        userAccountNames.value = userAccountNamesResponse;
    });

    //add exam supervisor
    function onTableRowClick(selectedUserAccountName: UserAccountName){
        const index: number = quizImportStore.selectedExamSupervisors.findIndex(userAccount => userAccount.modelId == selectedUserAccountName.modelId);
        
        if(index != -1){
            quizImportStore.selectedExamSupervisors.splice(index, 1);
            return;
        }

        quizImportStore.selectedExamSupervisors.push(selectedUserAccountName);
    }

    function removeExamSupervisor(supervisorId: string){
        const index: number = quizImportStore.selectedExamSupervisors.findIndex(userAccount => userAccount.modelId == supervisorId);
        quizImportStore.selectedExamSupervisors.splice(index, 1);
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