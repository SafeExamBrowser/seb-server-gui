import { useMutation } from "@/composables/useMutation.ts";
import { deleteExamTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useDeleteExamTemplate = () =>
    useMutation((id: number) => deleteExamTemplate(id));
