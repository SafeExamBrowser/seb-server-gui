<template>
    <v-row>
        <!-----------group selection table---------->      
        <v-col cols="7"> 

            <v-row>
                <v-col cols="6">
                    <v-text-field
                        v-model="search"
                        :label="translate('quizImportWizard.groupMain.search')"
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
                        :items="quizImportStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES"
                        :items-length="quizImportStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES.length"
                        :items-per-page="tableUtils.calcDefaultItemsPerPage(quizImportStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES)"
                        :items-per-page-options="tableUtils.calcItemsPerPage(quizImportStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES)"
                        :headers="tableHeaders"
                        :search="search"
                    >
                        <template v-slot:item="{item}">
                            <tr 
                                class="on-row-hover" 
                                @click="onTableRowClick(item)"
                                :class="[quizImportStore.selectedClientGroups.some(clientGroup => clientGroup.id == item.id) ? 'selected-row' : '']">

                                <td>{{ item.name }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-col>
        <!------------------------>


        <!-----------client group list summary---------->      
        <v-col cols="3">
            <v-row>
                <v-col>
                    <div class="text-h6">
                        {{translate('quizImportWizard.groupMain.selectedGroups')}}
                    </div>
                </v-col>
            </v-row>

            <v-row>
                <v-col>

                    <v-list select-strategy="leaf">
                        <template 
                            v-for="clientGroup in quizImportStore.selectedClientGroups"
                            :key="clientGroup.id"
                            :value="clientGroup.id">
                        
                            <v-list-item>
                                <v-list-item-title>{{ clientGroup.name }}</v-list-item-title>

                                <template v-slot:append="{ isSelected }">
                                    <v-list-item-action class="flex-column align-end">
                                        <v-spacer></v-spacer>

                                        <v-btn 
                                            @click="removeClientGroup(clientGroup.id!)"
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
        <!------------------------>

    </v-row>
</template>


<script setup lang="ts">
    import { useQuizImportStore } from "@/stores/quizImportStore";
    import * as tableUtils from "@/utils/table/tableUtils";
    import {translate} from "@/utils/generalUtils";

    
    //stores
    const quizImportStore = useQuizImportStore();

    //table
    const tableHeaders = ref([
        {title: translate("quizImportWizard.groupMain.tableHeaderName"), key: "name"}
    ]);    

    //local client group search / filter
    const search = ref<string>();


    //add exam client groups
    function onTableRowClick(selectedClientGroup: ClientGroup){
        const index: number = quizImportStore.selectedClientGroups.findIndex(clientGroup => clientGroup.id == selectedClientGroup.id);
        
        if(index != -1){
            quizImportStore.selectedClientGroups.splice(index, 1);
            return;
        }

        quizImportStore.selectedClientGroups.push(selectedClientGroup);
    }

    function removeClientGroup(groupId: number){
        const index: number = quizImportStore.selectedClientGroups.findIndex(clientGroup => clientGroup.id == groupId);
        quizImportStore.selectedClientGroups.splice(index, 1);
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