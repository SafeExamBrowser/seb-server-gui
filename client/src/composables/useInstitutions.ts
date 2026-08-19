import { useQuery } from "@tanstack/vue-query";

import { getInstitutionInfoQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getInstitutions } from "@/services/seb-server/institutionInfoService.ts";

export const useInstitutions = () =>
    useQuery({
        queryKey: getInstitutionInfoQueryKey({ client: heySebServerClient }),
        queryFn: () => getInstitutions(),
    });
