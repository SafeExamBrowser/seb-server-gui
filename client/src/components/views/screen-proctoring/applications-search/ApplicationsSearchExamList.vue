<template>
    <v-expansion-panels v-model="panels">
        <v-expansion-panel class="rounded-lg" value="panel">
            <v-expansion-panel-title class="font-weight-bold">
                Exams
            </v-expansion-panel-title>

            <v-expansion-panel-text>
                <v-data-table
                    v-model="selectedExamIds"
                    class="rounded-lg mt-4 form-container"
                    :headers="headers"
                    :items="exams"
                    items-per-page="5"
                    :items-per-page-options="tableUtils.calcItemsPerPage(exams)"
                    select-strategy="page"
                    show-select
                    :sort-by="[{ key: 'startTime', order: 'desc' }]"
                >
                    <template
                        #headers="{
                            columns,
                            isSorted,
                            getSortIcon,
                            toggleSort,
                            selectAll,
                            allSelected,
                            someSelected,
                        }"
                    >
                        <TableHeaders
                            :all-selected="allSelected"
                            :columns="columns"
                            :get-sort-icon="getSortIcon"
                            :header-refs-prop="headerRefs"
                            :is-sorted="isSorted"
                            :select-all="selectAll"
                            :some-selected="someSelected"
                            :toggle-sort="toggleSort"
                        >
                        </TableHeaders>
                    </template>

                    <template #item.startTime="{ item }">
                        <td>
                            <div>
                                {{
                                    timeUtils.formatTimestampToFullDate(
                                        item.startTime,
                                    )
                                }}
                            </div>
                        </td>
                    </template>
                </v-data-table>

                <v-row>
                    <v-col align="right">
                        <div class="form-container">
                            <v-btn
                                class="mt-2"
                                color="primary"
                                :disabled="
                                    selectedExamIds == null ||
                                    selectedExamIds?.length == 0
                                "
                                rounded="sm"
                                variant="flat"
                                @click="getGroupIdsForExam()"
                            >
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
import { ref, watchEffect } from "vue";
import * as timeUtils from "@/utils/timeUtils";
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import { SPExam } from "@/models/screen-proctoring/exam";

// props
const props = defineProps<{
    exams: SPExam[];
}>();

// emits (parent functions)
const emit = defineEmits<{
    getGroupIdsForExam: [selectedExams: SPExam[]];
}>();

// panel
const panels = ref<string[]>(["panel"]);

// table
const selectedExamIds = ref<number[]>();
const headerRefs = ref<any[]>();
const headers = ref([
    { title: "Exam", key: "name", width: "50%" },
    { title: "Exam Start-Time", key: "startTime", width: "50%" },
]);

watchEffect(() => {
    selectedExamIds.value = [];
    panels.value = ["panel"];
});

async function getGroupIdsForExam() {
    if (selectedExamIds.value == null) return;

    panels.value = [];

    const selectedExams: SPExam[] = props.exams.filter((exam) =>
        selectedExamIds.value!.includes(exam.id),
    );

    emit("getGroupIdsForExam", selectedExams);
}
</script>

<style scoped>
.form-container {
    padding-left: 20%;
    padding-right: 20%;
}
</style>
