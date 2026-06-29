import { useFetch } from "@/composables/useFetch.ts";
import { getExamTemplates } from "@/services/seb-server/examTemplateService.ts";

// The wizard shows every available exam template in a single, non-paginated
// list. We request a page size equal to the backend's maximum page size
// (`sebserver.webservice.api.pagination.maxPageSize`, default 500), so all
// templates are returned in one request.
const ALL_TEMPLATES_PAGE_SIZE = 500;

export const useExamTemplates = () =>
    useFetch(
        () =>
            getExamTemplates({
                basicListParams: { pageSize: ALL_TEMPLATES_PAGE_SIZE },
            }),
        { immediate: true },
    );
