import { useFetch } from "@/composables/useFetch.ts";
import { checkSEBLock } from "@/services/seb-server/examService.ts";

export const useSebLockCheck = (id?: number) =>
    useFetch(() => checkSEBLock(String(id)), {
        immediate: id !== undefined,
    });
