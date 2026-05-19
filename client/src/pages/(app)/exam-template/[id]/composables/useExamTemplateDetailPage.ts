import { computed } from "vue";
import i18n from "@/i18n";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";
import { useExamTemplate } from "./api/useExamTemplate.ts";

export const useExamTemplateDetailPage = (id: string) => {
    const { data: examTemplate, loading, error } = useExamTemplate(id);

    const title = computed(() => {
        if (examTemplate.value) {
            return examTemplate.value.name;
        }

        if (loading.value) {
            return "";
        }

        return i18n.global.t("titles.examTemplateDetail");
    });

    const breadCrumb = computed<BreadCrumbItem[]>(() => [
        {
            label: i18n.global.t("titles.examTemplateList"),
            link: { name: "/(app)/exam-template/" },
        },
        ...(loading.value ? [] : [{ label: title.value }]),
    ]);

    return {
        loading,
        error,
        examTemplate,
        title,
        breadCrumb,
    };
};
