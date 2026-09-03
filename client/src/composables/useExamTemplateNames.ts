import { useQuery } from "@tanstack/vue-query";

import { getExamTemplateNamesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getExamTemplateNames } from "@/services/seb-server/examTemplateService.ts";

// Spread rather than `staleTime: options?.staleTime`: an explicit `undefined`
// key overwrites the query client's default instead of falling back to it.
export const useExamTemplateNames = (options?: { staleTime?: number }) =>
    useQuery({
        queryKey: getExamTemplateNamesQueryKey({ client: heySebServerClient }),
        queryFn: () => getExamTemplateNames(),
        ...options,
    });
