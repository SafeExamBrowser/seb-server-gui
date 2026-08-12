import { useQuery } from "@tanstack/vue-query";

import { getExamTemplatesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getExamTemplateSelectionPage } from "@/services/seb-server/examTemplateService.ts";

// The wizard shows every available exam template in a single, non-paginated
// list. We request a page size equal to the backend's maximum page size
// (`sebserver.webservice.api.pagination.maxPageSize`, default 500), so all
// templates are returned in one request.
const ALL_TEMPLATES_PAGE_SIZE = 500;

const query = { page_size: ALL_TEMPLATES_PAGE_SIZE };

export const useExamTemplates = () =>
    useQuery({
        queryKey: getExamTemplatesQueryKey({
            client: heySebServerClient,
            query,
        }),
        queryFn: () => getExamTemplateSelectionPage(query),
    });
