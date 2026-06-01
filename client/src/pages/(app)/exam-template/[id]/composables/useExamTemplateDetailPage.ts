import { computed } from "vue";
import { z } from "zod";
import { useRoute } from "vue-router";
import i18n from "@/i18n";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";
import { IndicatorExisting } from "@/models/seb-server/examTemplate.ts";
import { useExamTemplate } from "./api/useExamTemplate.ts";

const idSchema = z.coerce.number().int().positive();

export const useExamTemplateDetailPage = () => {
    const route = useRoute("/(app)/exam-template/[id]/");
    const parseResult = idSchema.safeParse(route.params.id);
    const examTemplateId = parseResult.success ? parseResult.data : undefined;

    const {
        data: examTemplate,
        loading,
        error: fetchError,
    } = useExamTemplate(examTemplateId);

    const errors = computed(() => {
        const messages = [];
        if (!parseResult.success) {
            messages.push(
                i18n.global.t("examTemplateDetail.errors.invalidId", {
                    id: route.params.id,
                }),
            );
        }

        if (fetchError.value) {
            messages.push(fetchError.value);
        }

        return messages;
    });

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
        ...(examTemplate.value ? [{ label: title.value }] : []),
    ]);

    const indicators = computed<IndicatorExisting[]>(
        () => examTemplate.value?.indicators ?? [],
    );

    return {
        examTemplateId,
        examTemplate,
        loading,
        errors,
        title,
        breadCrumb,
        indicators,
    };
};
