import { useExamTemplates } from "./api/useExamTemplates";
import { computed, onMounted } from "vue";

export const useExamTemplateList = () => {
    const {
        data: examTemplatesData,
        loading: isLoading,
        error,
        fetchData,
    } = useExamTemplates();

    const examTemplates = computed(
        () => examTemplatesData.value?.content ?? [],
    );

    // TODO @alain: translate labels
    // TODO @alain: exam type value: use enum translation
    // TODO @alain: add correct action content
    const headers = [
        {
            title: "Name",
            value: "name",
            width: "30%",
        },
        {
            title: "Description",
            value: "description",
            width: "30%",
        },
        {
            title: "Exam Type",
            value: "examType",
            width: "30%",
        },
        {
            title: "Actions",
            value: "actions",
            width: "10%",
        },
    ];

    onMounted(() => {
        fetchData();
    });

    return {
        loading: isLoading,
        error,
        examTemplates,
        headers,
    };
};
