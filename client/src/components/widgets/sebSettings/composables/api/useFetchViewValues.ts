import { useFetch } from "@/composables/useFetch.ts";
import { ViewType } from "@/models/seb-server/sebSettingsEnums.ts";
import * as sebSettingsService from "@/services/seb-server/sebSettingsService.ts";

export const useFetchViewValues = (
    isExam: boolean,
    containerId: string,
    view: ViewType,
) =>
    useFetch(() => sebSettingsService.getView(view, containerId, isExam), {
        immediate: true,
    });
