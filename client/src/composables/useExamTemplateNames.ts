import { useQuery } from "@tanstack/vue-query";

import { getExamTemplateNamesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getExamTemplateNames } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplateNames = (options?: { staleTime?: number }) =>
    useQuery({
        queryKey: getExamTemplateNamesQueryKey({ client: heySebServerClient }),
        queryFn: () => getExamTemplateNames(),
        staleTime: options?.staleTime,
    });
