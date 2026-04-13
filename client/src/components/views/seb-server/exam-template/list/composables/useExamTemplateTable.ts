import { computed, ref } from "vue";
import type { Ref } from "vue";
import i18n from "@/i18n";
import { useExamTemplates } from "./api/useExamTemplates";
import type { TableOptions } from "../types";

const headers = [
    {
        title: i18n.global.t("examTemplateList.headers.name"),
        value: "name",
        width: "30%",
        sortable: true,
    },
    {
        title: i18n.global.t("examTemplateList.headers.description"),
        value: "description",
        width: "30%",
        sortable: true,
    },
    {
        title: i18n.global.t("examTemplateList.headers.examType"),
        value: "examType",
        width: "30%",
        sortable: true,
    },
    {
        title: i18n.global.t("examTemplateList.headers.actions"),
        value: "actions",
        width: "10%",
        sortable: false,
    },
];

export const useExamTemplateTable = (
    searchQuery: Readonly<Ref<string | undefined>>,
    examType: Readonly<Ref<string | undefined>>,
) => {
    const options = ref<TableOptions>({
        page: 1,
        itemsPerPage: 10,
        sortBy: [{ key: "name", order: "asc" }],
    });

    const {
        data,
        loading: isLoading,
        error,
        fetchData: fetchExamTemplates,
    } = useExamTemplates(options, searchQuery, examType);

    const examTemplates = computed(() => data.value?.content ?? []);

    const totalItems = computed(() => {
        if (!data.value) {
            return 0;
        }

        return data.value.number_of_pages * data.value.page_size;
    });

    const sortBy = computed(() => options.value.sortBy);

    const errors = computed(() => [error.value].filter((e) => e !== undefined));

    const fetchFromFirstPage = () => {
        options.value = { ...options.value, page: 1 };
        fetchExamTemplates();
    };

    const updateOptions = (newOptions: TableOptions) => {
        options.value = newOptions;
        fetchExamTemplates();
    };

    return {
        headers,
        examTemplates,
        totalItems,
        isLoading,
        errors,
        sortBy,
        fetchFromFirstPage,
        updateOptions,
        fetchExamTemplates,
    };
};
