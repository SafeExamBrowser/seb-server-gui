import { useMutation } from "@/composables/useMutation";
import { deleteExamTemplate } from "@/services/seb-server/examTemplateService";

export const useDeleteExamTemplate = () =>
    useMutation((id: number) => deleteExamTemplate(id));
