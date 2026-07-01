import { useFetch } from "@/composables/useFetch";
import { ScheduledDeleteReport } from "@/models/seb-server/scheduled-deletion";
import { getScheduledDeletionReport } from "@/services/seb-server/scheduledDeletionService";

export const useGetScheduledDeletionReport = (id: number) =>
    useFetch<ScheduledDeleteReport>(() => getScheduledDeletionReport(id), {
        immediate: true,
    });
