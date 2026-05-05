import { useMutation } from "@/composables/useMutation.ts";
import { copyExamTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useCopyExamTemplate = () =>
    useMutation((id: number) => copyExamTemplate(id));
