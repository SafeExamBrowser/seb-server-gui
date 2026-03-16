import { OptionalParSearchSessions } from "@/models/screen-proctoring/optionalParamters.ts";
import { ServerTablePaging } from "@/models/types.ts";
import * as timeUtils from "@/utils/timeUtils.ts";
import * as tableUtils from "@/utils/table/tableUtils.ts";

export function prepareSessionSearchParameters(
    day: string,
    searchParameters: OptionalParSearchSessions,
    serverTablePaging: ServerTablePaging,
): OptionalParSearchSessions {
    const dayTime: { start: string; end: string } =
        timeUtils.getStartAndEndTimestampOfDay(day);
    searchParameters.fromTime = dayTime.start;
    searchParameters.toTime = dayTime.end;

    return tableUtils.assignPagingOptions(serverTablePaging, searchParameters);
}
