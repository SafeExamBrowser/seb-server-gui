import * as indicatorService from "@/services/seb-server/api-services/indicatorService.ts";
import { Indicators } from "@/models/seb-server/indicators";

export async function getIndicators(
    examId: string,
): Promise<Indicators | null> {
    try {
        return await indicatorService.getIndicators(examId);
    } catch {
        return null;
    }
}
