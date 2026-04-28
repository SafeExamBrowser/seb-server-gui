import { useFetch } from "@/composables/useFetch";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import * as sebSettingsService from "@/services/seb-server/sebSettingsService";

export const useFetchViewValues = (
    isExam: boolean,
    containerId: string,
    view: ViewType,
) =>
    useFetch(() => sebSettingsService.getView(view, containerId, isExam), {
        immediate: true,
    });
