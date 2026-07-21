import { computed, reactive, ref } from "vue";

import { useMultiRowSelection } from "@/components/widgets/entity-table/composables/useMultiRowSelection";
import type {
    CellFormatter,
    TableHeader,
} from "@/components/widgets/entity-table/types";
import i18n from "@/i18n";
import { SPExam } from "@/models/screen-proctoring/exam";
import type { ServerTablePaging } from "@/models/types";
import type {
    ApplicationsSearchQuery,
    ExamMetadataObject,
} from "@/pages/(app)/applications-search/types";
import * as applicationsSearchService from "@/services/screen-proctoring/applicationsSearchService";
import * as generalUtils from "@/utils/generalUtils";
import * as timeUtils from "@/utils/timeUtils";

const DEFAULT_ITEMS_PER_PAGE = 5;

export function useApplicationsSearch() {
    // exam list state
    const exams = ref<SPExam[]>([]);
    const activeSummary = ref<string>("");

    // request state
    const loading = ref<boolean>(false);
    const errorAvailable = ref<boolean>(false);
    const noResultsFound = ref<boolean>(false);

    // metadata drill-down state
    const examObjects = ref<ExamMetadataObject[]>([]);
    const metadataAvailable = ref<boolean>(false);
    const metadataLoading = ref<boolean>(false);
    // number of exams submitted for the current metadata view (may exceed
    // examObjects.length when some selected exams have no metadata)
    const submittedCount = ref<number>(0);

    // client-side paging/sorting for the EntityTable
    const options = ref<ServerTablePaging>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        sortBy: [{ key: "startTime", order: "desc" }],
    });

    const sortedExams = computed<SPExam[]>(() => {
        const sort = options.value.sortBy[0];
        const list = [...exams.value];
        if (!sort) {
            return list;
        }

        const direction = sort.order === "desc" ? -1 : 1;
        return list.sort((a, b) => {
            const left = a[sort.key as keyof SPExam];
            const right = b[sort.key as keyof SPExam];
            if (typeof left === "number" && typeof right === "number") {
                return (left - right) * direction;
            }
            return (
                String(left ?? "").localeCompare(String(right ?? "")) *
                direction
            );
        });
    });

    const pageCount = computed<number>(() =>
        Math.max(
            1,
            Math.ceil(sortedExams.value.length / options.value.itemsPerPage),
        ),
    );

    const pagedItems = computed<SPExam[]>(() => {
        const start = (options.value.page - 1) * options.value.itemsPerPage;
        return sortedExams.value.slice(
            start,
            start + options.value.itemsPerPage,
        );
    });

    const headers: TableHeader[] = [
        {
            title: i18n.global.t("applicationsSearch.examColumn"),
            key: "name",
            width: "55%",
            sortable: true,
        },
        {
            title: i18n.global.t("applicationsSearch.examStartTime"),
            key: "startTime",
            width: "45%",
            sortable: true,
        },
    ];

    const cellFormatters: Record<string, CellFormatter> = {
        startTime: (value) =>
            timeUtils.formatTimestampToFullDate(Number(value)),
    };

    const selection = useMultiRowSelection({
        key: "id",
        // Every exam is selectable; an explicit `false` is required so the
        // EntityTable renders the selection checkboxes.
        rowSelectionDisabled: () => false,
    });

    const selectedCount = computed<number>(
        () => selection.value.selectionModel.value.length,
    );

    const examCount = computed<number>(() => exams.value.length);

    function loadItems(newOptions: ServerTablePaging) {
        options.value = newOptions;
    }

    function resetTableState() {
        selection.value.selectionModel.value = [];
        examObjects.value = [];
        metadataAvailable.value = false;
        options.value = {
            page: 1,
            itemsPerPage: options.value.itemsPerPage,
            sortBy: options.value.sortBy,
        };
    }

    async function runSearch(query: ApplicationsSearchQuery) {
        loading.value = true;
        errorAvailable.value = false;
        noResultsFound.value = false;
        activeSummary.value = query.summary;
        resetTableState();

        // The service rejects (throws) on any API error, so a try/finally is
        // required to surface the error state and always clear the spinner.
        try {
            const examList = await applicationsSearchService.getExamsStarted({
                fromTime: query.fromTime,
                toTime: query.toTime,
            });
            exams.value = examList;
            noResultsFound.value = examList.length === 0;
        } catch {
            errorAvailable.value = true;
            exams.value = [];
        } finally {
            loading.value = false;
        }
    }

    async function viewApplications() {
        const selectedIds = selection.value.selectionModel.value.map(String);
        const selectedExams: SPExam[] = exams.value.filter((exam) =>
            selectedIds.includes(String(exam.id)),
        );
        if (selectedExams.length === 0) {
            return;
        }

        submittedCount.value = selectedExams.length;
        metadataLoading.value = true;
        const nextExamObjects: ExamMetadataObject[] = [];

        try {
            for (const exam of selectedExams) {
                try {
                    const groupIds =
                        await applicationsSearchService.getGroupIdsForExam(
                            exam.id,
                        );
                    const metadataAppList =
                        await applicationsSearchService.getDistinctMetadataAppForExam(
                            generalUtils.createStringCommaList(groupIds),
                        );
                    if (metadataAppList.length === 0) {
                        continue;
                    }

                    nextExamObjects.push({ exam, metadataAppList, groupIds });
                } catch {
                    // skip exams whose metadata could not be loaded
                    continue;
                }
            }

            examObjects.value = nextExamObjects;
            metadataAvailable.value = true;
        } finally {
            metadataLoading.value = false;
        }
    }

    function changeSelection() {
        metadataAvailable.value = false;
        examObjects.value = [];
    }

    // A single flat reactive object (like the monitoring/archive overviews):
    // template access unwraps the state refs, while `selection.selectionModel`
    // stays a Ref so the EntityTable can drive the checkbox selection.
    return reactive({
        exams,
        examCount,
        activeSummary,
        loading,
        errorAvailable,
        noResultsFound,
        headers,
        cellFormatters,
        items: pagedItems,
        options,
        pageCount,
        selection,
        loadItems,
        selectedCount,
        metadataLoading,
        metadataAvailable,
        submittedCount,
        examObjects,
        runSearch,
        viewApplications,
        changeSelection,
    });
}
