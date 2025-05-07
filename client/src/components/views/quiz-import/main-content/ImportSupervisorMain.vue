<template>

    <v-row>
        
        <!-----------user selection table---------->      
        <v-spacer></v-spacer>
        <v-col cols="7" xl="5"> 

            <v-row>
                <v-col cols="6">
                    <v-text-field
                        v-model="search"
                        :label="translate('quizImportWizard.supervisorsMain.search')"
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
                        :search="search">

                        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                            <TableHeaders
                                :columns="columns"
                                :is-sorted="isSorted"
                                :get-sort-icon="getSortIcon"
                                :toggle-sort="toggleSort"
                                :header-refs-prop="tableHeadersRef">
                            </TableHeaders>
                        </template>
                        
                        <template v-slot:item="{item}">
                            <tr 
                                class="on-row-hover" 
                                tabindex="0"
                                @keyup.enter="onTableRowClick(item)"
                                @click="onTableRowClick(item)"
                                :class="[quizImportStore.selectedExamSupervisors.some(userAccount => userAccount.modelId == item.modelId) ? 'selected-row' : '']">

                                <td>{{ item.name }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-col>
        <!------------------------>


        <!-----------user list summary---------->      
        <v-col cols="4" xl="2">
            <v-row>
                <v-col>
                    <div class="text-h6">
                        {{translate("quizImportWizard.supervisorsMain.selectedSupervisors")}}
                    </div>
                </v-col>
            </v-row>

            <v-row>
                <v-col>

                    <v-list select-strategy="leaf">
                        <template 
                            v-for="supervisor in quizImportStore.selectedExamSupervisors"
                            :key="supervisor.modelId"
                            :value="supervisor.modelId">
                        
                            <v-list-item>
                                <v-list-item-title>{{ supervisor.name }}</v-list-item-title>

                                <template v-slot:append="{ isSelected }">
                                    <v-list-item-action class="flex-column align-end">
                                        <v-spacer></v-spacer>

                                        <v-btn 
                                            @click="removeExamSupervisor(supervisor.modelId)"
                                            variant="flat"
                                            icon="mdi-close">
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
        <v-spacer></v-spacer>
        <!------------------------>

    </v-row>
</template>


<script setup lang="ts">
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import { useQuizImportStore } from "@/stores/quizImportStore";
    import { useUserAccountStore } from "@/stores/store";
    import * as tableUtils from "@/utils/table/tableUtils";
    import {translate} from "@/utils/generalUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    
    //stores
    const quizImportStore = useQuizImportStore();
    const userAccountStore = useUserAccountStore();

    //items
    const userAccountNames = ref<UserAccountName[]>([]);

    //table
    const tableHeadersRef = ref<any[]>();
    const tableHeaders = ref([
        {title: translate("quizImportWizard.supervisorsMain.tableHeaderName"), key: "name"}
    ]);    

    //local user search / filter
    const search = ref<string>();


    //=======================events & watchers=======================
    onBeforeMount(async () => {

        //todo: check which users should be returned
        const userAccountNamesResponse: UserAccountName[] | null = await userAccountViewService.getUserAccountNames({institutionId: userAccountStore.userAccount?.institutionId});

        if(userAccountNamesResponse == null){
            return;
        }
        userAccountNames.value = userAccountNamesResponse;

        //add supervisors from template to list
        if(quizImportStore.selectedExamTemplate?.supporter != null){
            quizImportStore.selectedExamSupervisors.push(
            ...userAccountNames.value.filter(user => 
                quizImportStore.selectedExamTemplate?.supporter.includes(user.modelId))
            );
        }
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