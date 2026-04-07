import i18n from "@/i18n";
import { useExamTemplates } from "./api/useExamTemplates";
import { computed, ref, watch } from "vue";
import { TableOptions } from "@/components/views/seb-server/exam-template/list/types";
import { getExamTemplates } from "@/services/seb-server/examTemplateService";

export const useExamTemplateList = () => {
    const queryParams = ref<Parameters<typeof getExamTemplates>[0]>({
        pageNumber: 1,
        pageSize: 10,
        sort: { key: "name", order: "desc" },
    });

    const {
        data: examTemplatesData,
        loading: isLoading,
        error,
        fetchData,
    } = useExamTemplates(queryParams);

    watch(
        queryParams,
        () => {
            fetchData();
        },
        { deep: true },
    );

    const errors = computed(() => {
        return [error.value].filter((error) => error !== undefined);
    });

    const examTemplates = computed(
        () => examTemplatesData.value?.content ?? [],
    );

    const totalItems = computed(() => {
        if (!examTemplatesData.value) {
            return 0;
        }

        return (
            examTemplatesData.value.number_of_pages *
            examTemplatesData.value.page_size
        );
    });

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

    const handleOptionsUpdate = (options: TableOptions) => {
        queryParams.value = {
            pageNumber: options.page,
            pageSize: options.itemsPerPage,
            sort: options.sortBy[0]
                ? {
                      key: options.sortBy[0].key,
                      order: options.sortBy[0].order,
                  }
                : undefined,
        };
    };

    const handleItemsUpdate = () => {
        fetchData();
    };

    return {
        isLoading,
        errors,
        examTemplates,
        totalItems,
        headers,
        queryParams,
        handleOptionsUpdate,
        handleItemsUpdate,
    };
};
