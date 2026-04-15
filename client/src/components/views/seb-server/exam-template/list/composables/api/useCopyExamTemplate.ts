import { useMutation } from "@/composables/useMutation";
import { copyExamTemplate } from "@/services/seb-server/examTemplateService";

export const useCopyExamTemplate = () =>
    useMutation((id: number) => copyExamTemplate(id));
