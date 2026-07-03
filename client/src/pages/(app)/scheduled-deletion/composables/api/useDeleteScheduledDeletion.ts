import { useMutation } from "@/composables/useMutation.ts";
import { deleteScheduledDeletion } from "@/services/seb-server/scheduledDeletionService";

export const useDeleteScheduledDeletion = () =>
    useMutation((id: number) => deleteScheduledDeletion(id));
