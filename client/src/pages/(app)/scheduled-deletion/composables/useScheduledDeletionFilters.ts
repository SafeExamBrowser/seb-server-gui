import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes.ts";

import { getScheduledDeleteStatusFilterColor } from "@/utils/generalUtils.ts";
import { ScheduledDeleteStatusEnum } from "@/models/seb-server/sheduled-deletion";

export const TRANSLATION_PREFIX = "scheduledDelete.list";
const STATUS_PREFIX = TRANSLATION_PREFIX + ".status.";
export const STATUS_FILTER_KEY = "status";

export function useScheduledDeleteFilters() {
    return computed<FilterSectionDef[]>(() => [
        {
            key: STATUS_FILTER_KEY,
            title: translate(`${TRANSLATION_PREFIX}.examState`),
            multiple: true,
            options: [
                {
                    value: ScheduledDeleteStatusEnum.PENDING,
                    label: translate(
                        STATUS_PREFIX + ScheduledDeleteStatusEnum.PENDING,
                    ),
                    color: getScheduledDeleteStatusFilterColor(
                        ScheduledDeleteStatusEnum.PENDING,
                    ),
                },
                {
                    value: ScheduledDeleteStatusEnum.RUNNING,
                    label: translate(
                        STATUS_PREFIX + ScheduledDeleteStatusEnum.RUNNING,
                    ),
                    color: getScheduledDeleteStatusFilterColor(
                        ScheduledDeleteStatusEnum.RUNNING,
                    ),
                },
                {
                    value: ScheduledDeleteStatusEnum.SPS_RUNNING,
                    label: translate(
                        STATUS_PREFIX + ScheduledDeleteStatusEnum.SPS_RUNNING,
                    ),
                    color: getScheduledDeleteStatusFilterColor(
                        ScheduledDeleteStatusEnum.SPS_RUNNING,
                    ),
                },
                {
                    value: ScheduledDeleteStatusEnum.FINISHED,
                    label: translate(
                        STATUS_PREFIX + ScheduledDeleteStatusEnum.FINISHED,
                    ),
                    color: getScheduledDeleteStatusFilterColor(
                        ScheduledDeleteStatusEnum.FINISHED,
                    ),
                },
            ],
        },
    ]);
}
