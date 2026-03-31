import i18n from "@/i18n";
import { useExamTemplates } from "./api/useExamTemplates";
import { computed, onMounted } from "vue";

export const useExamTemplateList = () => {
    const {
        data: examTemplatesData,
        loading: isLoading,
        error,
        fetchData,
    } = useExamTemplates();

    const errors = computed(() => {
        return [error.value].filter((error) => error !== undefined);
    });

    const examTemplates = computed(
        () => examTemplatesData.value?.content ?? [],
    );

    const headers = [
        {
            title: i18n.global.t("examTemplateList.headers.name"),
            value: "name",
            width: "30%",
        },
        {
            title: i18n.global.t("examTemplateList.headers.description"),
            value: "description",
            width: "30%",
        },
        {
            title: i18n.global.t("examTemplateList.headers.examType"),
            value: "examType",
            width: "30%",
        },
        {
            title: i18n.global.t("examTemplateList.headers.actions"),
            value: "actions",
            width: "10%",
        },
    ];

    onMounted(() => {
        fetchData();
    });

    return {
        loading: isLoading,
        errors,
        examTemplates,
        headers,
        refetchData: fetchData,
    };
};
