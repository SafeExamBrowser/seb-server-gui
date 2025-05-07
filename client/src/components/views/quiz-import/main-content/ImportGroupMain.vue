<template>
    <v-row>
        <!-----------group selection table---------->      
        <v-spacer></v-spacer>
        <v-col cols="7" xl="5"> 

            <v-row>
                <v-col cols="6">
                    <v-text-field
                        v-model="search"
                        :aria-label="translate('quizImportWizard.groupMain.search')"
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
                    <!--@vue-ignore-->
                    <v-data-table
                        item-value="quiz_id" 
                        :hover="true"
                        :items="quizImportStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES"
                        :items-length="quizImportStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES.length"
                        :items-per-page="tableUtils.calcDefaultItemsPerPage(quizImportStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES)"
                        :items-per-page-options="tableUtils.calcItemsPerPage(quizImportStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES)"
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
                                :class="[quizImportStore.selectedClientGroups.some(clientGroup => clientGroup.id == item.id) ? 'selected-row' : '']">

                                <td>{{ item.name }}</td>
                                <td align="center">
                                    <v-icon :icon="quizImportStore.availableSpClientGroupIds.includes(item.id!) ? 'mdi-check' : ''"></v-icon>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-col>
        <!------------------------>


        <!-----------client group list summary---------->      
        <v-col cols="4" xl="2">
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
        <v-spacer></v-spacer>
        <!------------------------>

    </v-row>
</template>


<script setup lang="ts">
    import { useQuizImportStore } from "@/stores/quizImportStore";
    import * as tableUtils from "@/utils/table/tableUtils";
    import {translate} from "@/utils/generalUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";

    
    //stores
    const quizImportStore = useQuizImportStore();

    //table
    const tableHeadersRef = ref<any[]>();
    const tableHeaders = ref([
        {title: translate("quizImportWizard.groupMain.tableHeaderName"), key: "name"},
        {title: translate("quizImportWizard.groupMain.tableHeaderScreenProctoring"), key: "sp", center: true, align: "center"}
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