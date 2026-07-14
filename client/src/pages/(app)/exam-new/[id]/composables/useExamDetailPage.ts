import { computed } from "vue";
import { z } from "zod";
import { useRoute } from "vue-router";
import i18n from "@/i18n";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";
import { useExam } from "./api/useExam.ts";

const idSchema = z.coerce.number().int().positive();

export const useExamDetailPage = () => {
    const route = useRoute("/(app)/exam-new/[id]/");
    const parseResult = idSchema.safeParse(route.params.id);
    const examId = parseResult.success ? parseResult.data : undefined;

    const { data: exam, loading, error: examError } = useExam(examId);

    const notFound = computed(
        () =>
            examError.value?.kind === "backend" &&
            examError.value.status === 404,
    );

    const errors = computed(() => {
        const messages = [];

        if (!parseResult.success) {
            messages.push(
                i18n.global.t("examDetail.errors.invalidId", {
                    id: route.params.id,
                }),
            );
        }

        if (examError.value && !notFound.value) {
            messages.push(examError.value);
        }

        return messages;
    });

    const title = computed(() => {
        if (exam.value) {
            return exam.value.quizName;
        }

        if (loading.value) {
            return "";
        }

        return i18n.global.t("titles.examDetails");
    });

    const breadCrumb = computed<BreadCrumbItem[]>(() => [
        {
            label: i18n.global.t("titles.exams"),
            link: { name: "/(app)/exam/" },
        },
        ...(exam.value ? [{ label: title.value }] : []),
    ]);

    return {
        examId,
        exam,
        loading,
        notFound,
        errors,
        title,
        breadCrumb,
    };
};
