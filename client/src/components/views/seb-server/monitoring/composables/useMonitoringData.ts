// // wait   ----- overview  /    / ---- usemonitoringdata
import { Exam } from "@/models/seb-server/exam.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import {
    AppSignatureKey,
    AppSignatureKeysWithGrantValues,
    GrantedAppSignatureKey,
} from "@/models/seb-server/appSignatureKey.ts";
import * as examService from "@/services/seb-server/examService";
import * as clientConnectionService from "@/services/seb-server/clientConnectionService";
import { ClientGroups } from "@/models/seb-server/clientGroup.ts";
import * as clientGroupService from "@/services/seb-server/clientGroupService.ts";

export async function getExamAndStore(examId: string) {
    const examResponse: Exam | null = await examService.getExam(examId);

    if (examResponse == null) {
        return;
    }
    useMonitoringStore().selectedExam = examResponse;
}

// wait   ----- overview ---- usemonitoringdata
export async function getAskAndStore(examId: string) {
    const store = useMonitoringStore();

    const ask: AppSignatureKey[] | null =
        await examService.getExamAppSignatureKeys(examId);

    const grantedAsk: GrantedAppSignatureKey[] | null =
        await examService.getGrantedExamAppSignatureKeys(examId);

    const grantedByKey = new Map<string, GrantedAppSignatureKey>(
        (grantedAsk ?? []).map((g) => [g.keyValue, g]),
    );

    const merged: AppSignatureKeysWithGrantValues[] = (ask ?? []).map((a) => {
        const g = grantedByKey.get(a.keyValue);
        return {
            id: g?.id,
            institutionId: a.institutionId,
            examId: a.examId,
            keyValue: a.keyValue,
            connectionIds: a.connectionIds ?? {},
            keyType: g?.keyType,
            tag: g?.tag,
        };
    });

    store.appSignatureKeys = merged;

    const ids: number[] = Array.from(
        new Set(
            merged.flatMap((k) =>
                Object.keys(k.connectionIds ?? {}).map((id) => Number(id)),
            ),
        ),
    ).filter((n) => Number.isFinite(n));

    if (ids.length === 0) {
        store.clientConnectionList = [];
        return;
    }

    // 6) Fetch connections for those IDs
    const list = await clientConnectionService.getClientConnectionList(ids);
    store.clientConnectionList = list ?? [];
}

export async function getClientGroups(examId: string) {
    const clientGroupsResponse: ClientGroups | null =
        await clientGroupService.getClientGroups(examId);
    if (clientGroupsResponse == null) {
        return;
    }

    useMonitoringStore().clientGroups = clientGroupsResponse;
}
