import { ref } from "vue";
import { getQuizzes } from "@/services/seb-server/quizService.ts";
import { Quizzes } from "@/models/seb-server/quiz.ts";
import { wait } from "@/utils/generalUtils.ts";

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 30;

export type FetchQuizzesParams = {
    pageNumber: number;
    pageSize: number;
    sort?: string;
    name?: string;
    startTimestampMillis?: number;
    lmsSetupId: number;
};

export const useQuizzes = () => {
    const data = ref<Quizzes>();
    const loading = ref(false);
    const error = ref<string>();
    let currentRequestId = 0;

    const fetch = async (
        params: FetchQuizzesParams,
        forceNewSearch = false,
    ) => {
        const requestId = ++currentRequestId;
        loading.value = true;
        error.value = undefined;
        data.value = undefined;

        try {
            let response: Quizzes = await getQuizzes({
                page_number: params.pageNumber,
                page_size: params.pageSize,
                sort: params.sort,
                name: params.name || undefined,
                start_timestamp_millis: params.startTimestampMillis,
                lms_setup: params.lmsSetupId.toString(),
                force_new_search: forceNewSearch,
            });

            if (requestId !== currentRequestId) {
                return;
            }
            data.value = response;

            let attempts = 0;
            while (!response.complete && attempts < POLL_MAX_ATTEMPTS) {
                await wait(POLL_INTERVAL_MS);
                if (requestId !== currentRequestId) {
                    return;
                }

                response = await getQuizzes({
                    page_number: params.pageNumber,
                    page_size: params.pageSize,
                    sort: params.sort,
                    name: params.name || undefined,
                    start_timestamp_millis: params.startTimestampMillis,
                    lms_setup: params.lmsSetupId.toString(),
                    force_new_search: false,
                });

                if (requestId !== currentRequestId) {
                    return;
                }
                data.value = response;
                attempts++;
            }
        } catch (err) {
            if (requestId !== currentRequestId) {
                return;
            }
            error.value = err instanceof Error ? err.message : "Unknown error";
        } finally {
            if (requestId === currentRequestId) {
                loading.value = false;
            }
        }
    };

    return {
        data,
        loading,
        error,
        fetch,
    };
};
