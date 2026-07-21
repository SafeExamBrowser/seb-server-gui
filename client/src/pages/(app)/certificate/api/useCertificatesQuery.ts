import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { getCertificatesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { GetCertificatesData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getCertificates } from "@/services/seb-server/certificateService.ts";

export const useCertificatesQuery = (
    query: Readonly<Ref<GetCertificatesData["query"]>>,
) =>
    useQuery({
        queryKey: computed(() =>
            getCertificatesQueryKey({
                client: heySebServerClient,
                query: query.value,
            }),
        ),
        queryFn: () => getCertificates(query.value),
        placeholderData: keepPreviousData,
    });
