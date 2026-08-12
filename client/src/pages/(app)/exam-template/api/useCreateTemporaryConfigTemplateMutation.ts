import { useMutation } from "@tanstack/vue-query";

import { createTemporaryConfigTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useCreateTemporaryConfigTemplateMutation = () =>
    useMutation({
        mutationFn: () => createTemporaryConfigTemplate(),
    });
