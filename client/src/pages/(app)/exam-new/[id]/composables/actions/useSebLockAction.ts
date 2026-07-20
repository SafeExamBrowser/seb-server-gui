import * as examService from "@/services/seb-server/examService.ts";
import { useMutation } from "@/composables/useMutation.ts";
import { useSebLockCheck } from "@/pages/(app)/exam-new/[id]/composables/api/useSebLockCheck.ts";

export const useSebLockAction = (examId?: number) => {
    const { data: sebLockActive, fetchData: refreshSebLockActive } =
        useSebLockCheck(examId);

    const sebLockMutation = useMutation(async (id: number, enable: boolean) => {
        if (enable) {
            await examService.addSEBLock(String(id));
            return;
        }

        await examService.removeSEBLock(String(id));
    });

    const handleSebLockToggle = async () => {
        if (examId === undefined) {
            return;
        }

        await sebLockMutation.mutateData(examId, !sebLockActive.value);

        if (sebLockMutation.error.value) {
            return;
        }

        await refreshSebLockActive();
    };

    return { sebLockActive, handleSebLockToggle };
};
