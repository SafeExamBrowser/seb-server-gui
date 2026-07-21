import { computed } from "vue";

import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes.ts";
import { ScheduledDeleteStatusEnum } from "@/models/seb-server/scheduled-deletion";
import { translate } from "@/utils/generalUtils.ts";
import { getScheduledDeleteStatusFilterColor } from "@/utils/generalUtils.ts";

export const TRANSLATION_PREFIX = "scheduledDelete.list";
const STATUS_PREFIX = "scheduledDelete.status.";
export const STATUS_FILTER_KEY = "state";

export function useScheduledDeleteFilters() {
    return computed<FilterSectionDef[]>(() => [
        {
            key: STATUS_FILTER_KEY,
            title: translate(`${TRANSLATION_PREFIX}.filterStatus`),
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
