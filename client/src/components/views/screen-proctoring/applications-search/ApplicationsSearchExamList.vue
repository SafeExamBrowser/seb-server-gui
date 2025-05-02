<template>

    <v-expansion-panels v-model="panels">
        <v-expansion-panel class="rounded-lg" value="panel">

            <v-expansion-panel-title class="font-weight-bold">
                Exams
            </v-expansion-panel-title>
            
            <v-expansion-panel-text>
                <v-data-table
                    show-select
                    v-model="selectedExamIds"
                    select-strategy="page"
                    class="rounded-lg mt-4 form-container"
                    :sort-by="[{key: 'startTime', order: 'desc'}]"
                    items-per-page="5"
                    :items-per-page-options="tableUtils.calcItemsPerPage(exams)"
                    :headers="headers"
                    :items="exams">

                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort, selectAll, allSelected, someSelected }">
                        <TableHeaders
                            :columns="columns"
                            :is-sorted="isSorted"
                            :get-sort-icon="getSortIcon"
                            :toggle-sort="toggleSort"
                            :header-refs-prop="headerRefs"
                            :selectAll="selectAll"
                            :allSelected="allSelected"
                            :someSelected="someSelected">
                        </TableHeaders>
                    </template>

                    <template v-slot:item.startTime="{item}">
                        <td>
                            <div>
                                {{timeUtils.formatTimestampToFullDate(item.startTime)}}
                            </div>
                        </td>
                    </template>
                </v-data-table>

                <v-row>
                    <v-col align="right">
                        <div class="form-container">
                            <v-btn 
                                :disabled="selectedExamIds == null || selectedExamIds?.length == 0"
                                rounded="sm" 
                                color="primary" 
                                variant="flat" 
                                class="mt-2"
                                @click="getGroupIdsForExam()">
                                Go!
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>

            </v-expansion-panel-text>

        </v-expansion-panel>
    </v-expansion-panels>

</template>


<script setup lang="ts">
    import { ref, watch, watchEffect } from "vue";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/table/tableUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";

    //props
    const props = defineProps<{
        exams: SPExam[]
    }>();

    //emits (parent functions)
    const emit = defineEmits<{
        getGroupIdsForExam: [
            selectedExams: SPExam[],
        ];
    }>();

    //panel
    const panels = ref<string[]>(["panel"]);

    //table
    const selectedExamIds = ref<number[]>();
    const headerRefs = ref<any[]>();
    const headers = ref([
        {title: "Exam", key: "name", width: "50%"},
        {title: "Exam Start-Time", key: "startTime", width: "50%"}
    ]);

    watchEffect(() => {
        //props.exam has to be accessed to make sure the panel always opens
        const placeHolderVar = props.exams;
        selectedExamIds.value = [];
        panels.value = ["panel"];
    });

    async function getGroupIdsForExam(){
        if(selectedExamIds.value == null) return;

        panels.value = [];

        const selectedExams: SPExam[] = props.exams.filter(exam => selectedExamIds.value!.includes(exam.id));

        emit("getGroupIdsForExam", selectedExams);
    }

</script>


<style scoped>

    .form-container{
        padding-left: 20%;
        padding-right: 20%;
    }

</style>