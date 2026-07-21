import { ref } from "vue";

import { Quizzes } from "@/models/seb-server/quiz.ts";
import type { ServerTablePaging } from "@/models/types.ts";
import { getQuizzes } from "@/services/seb-server/quizService.ts";
import { wait } from "@/utils/generalUtils.ts";
import { toServerPageQuery } from "@/utils/table/tableUtils.ts";

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 30;

export type FetchQuizzesFilters = {
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
        options: ServerTablePaging,
        filters: FetchQuizzesFilters,
        forceNewSearch = false,
    ) => {
        const requestId = ++currentRequestId;
        loading.value = true;
        error.value = undefined;

        const buildParams = (force: boolean) => ({
            ...toServerPageQuery(options),
            name: filters.name || undefined,
            start_timestamp_millis: filters.startTimestampMillis,
            lms_setup: filters.lmsSetupId.toString(),
            force_new_search: force,
        });

        try {
            let response: Quizzes = await getQuizzes(
                buildParams(forceNewSearch),
            );

            if (requestId !== currentRequestId) {
                return;
            }
            data.value = response;

            // The quiz lookup runs asynchronously on the backend: while
            // `complete` is false, only a partial result set is available, so we
            // keep polling the same page until the lookup finished.
            let attempts = 0;
            while (!response.complete && attempts < POLL_MAX_ATTEMPTS) {
                await wait(POLL_INTERVAL_MS);
                if (requestId !== currentRequestId) {
                    return;
                }

                response = await getQuizzes(buildParams(false));

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
