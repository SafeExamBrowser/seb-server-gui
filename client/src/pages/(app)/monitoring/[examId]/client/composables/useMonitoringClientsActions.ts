import { computed } from "vue";

import { ClientInstruction } from "@/models/seb-server/clientInstruction.ts";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import { InstructionEnum } from "@/models/seb-server/instructionEnum.ts";
import { MonitoringRow } from "@/models/seb-server/monitoringClients.ts";
import { MonitoringBulkActionEnum } from "@/models/seb-server/monitoringEnums.ts";
import { GUIAction, useAbilities } from "@/services/ability.ts";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as generalUtils from "@/utils/generalUtils.ts";

export const BULK_ACTION_DISPLAY_ORDER = [
    MonitoringBulkActionEnum.LOCK,
    MonitoringBulkActionEnum.UNLOCK,
    MonitoringBulkActionEnum.QUIT,
    MonitoringBulkActionEnum.CANCEL,
] as const;

const QUIT_STATUSES: string[] = [
    ConnectionStatusEnum.ACTIVE,
    ConnectionStatusEnum.READY,
    ConnectionStatusEnum.CONNECTION_REQUESTED,
];

const LOCK_STATUSES: string[] = [
    ConnectionStatusEnum.ACTIVE,
    ConnectionStatusEnum.READY,
];

export function isBulkActionEligible(
    action: MonitoringBulkActionEnum,
    row: MonitoringRow,
): boolean {
    switch (action) {
        case MonitoringBulkActionEnum.LOCK:
            return (
                !row.missing &&
                LOCK_STATUSES.includes(row.status) &&
                !row.pendingLockScreen
            );
        case MonitoringBulkActionEnum.UNLOCK:
            return row.pendingLockScreen;
        case MonitoringBulkActionEnum.QUIT:
            return !row.missing && QUIT_STATUSES.includes(row.status);
        case MonitoringBulkActionEnum.CANCEL:
            return (
                row.status === ConnectionStatusEnum.CLOSED ||
                row.status === ConnectionStatusEnum.MISSING ||
                row.missing
            );
    }
}

export const SELECTION_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

// The selection column keeps a constant width; MonitoringClientsTable slides
// the whole table left by this amount while no action is armed. Animating a
// single margin is much cheaper than animating the column width, which would
// re-layout every row on every frame.
export const SELECTION_COLUMN_WIDTH = 52;

export const SELECTION_CELL_STYLE = {
    width: `${SELECTION_COLUMN_WIDTH}px`,
    padding: "0 0 0 12px",
    overflow: "hidden",
    whiteSpace: "nowrap",
};

// rowIndex staggers the checkboxes so they cascade in top to bottom; only
// transform and opacity animate, so the table layout is never touched.
export function selectionCellInnerStyle(active: boolean, rowIndex: number) {
    const delay = `${Math.min(rowIndex, 12) * 25}ms`;
    return {
        width: "40px",
        opacity: active ? 1 : 0,
        transform: active
            ? "translateX(0) scale(1)"
            : "translateX(-12px) scale(0.5)",
        transition: `transform 0.28s ${SELECTION_EASE} ${delay}, opacity 0.22s ease ${delay}`,
    };
}

export function useMonitoringClientsActions(examId: string) {
    const monitoringStore = useMonitoringStore();
    const ability = useAbilities();

    const displayedRows = computed<MonitoringRow[]>(() => {
        const searchName = monitoringStore.searchName;
        return Array.from(monitoringStore.monitoringData.values()).filter(
            (row) => {
                if (searchName == null) {
                    return true;
                }
                return row.nameOrSession
                    .toLowerCase()
                    .includes(searchName.toLowerCase());
            },
        );
    });

    const armedAction = computed(() => monitoringStore.armedBulkAction);

    const availableActions = computed(() =>
        BULK_ACTION_DISPLAY_ORDER.filter((action) => {
            if (
                action === MonitoringBulkActionEnum.QUIT &&
                !ability.canDo(GUIAction.QUIT_CLIENTS)
            ) {
                return false;
            }
            return displayedRows.value.some((row) =>
                isBulkActionEligible(action, row),
            );
        }),
    );

    const eligibleRows = computed<MonitoringRow[]>(() => {
        const action = armedAction.value;
        if (action == null) {
            return [];
        }
        return displayedRows.value.filter((row) =>
            isBulkActionEligible(action, row),
        );
    });

    // Rows can lose eligibility while an action is armed (live refresh), so
    // the selection is always intersected with the currently eligible rows.
    const selectedEligibleRows = computed(() =>
        eligibleRows.value.filter((row) =>
            monitoringStore.selectedMonitoringIds.includes(row.id),
        ),
    );

    const allEligibleSelected = computed(
        () =>
            eligibleRows.value.length > 0 &&
            selectedEligibleRows.value.length === eligibleRows.value.length,
    );

    const someEligibleSelected = computed(
        () => selectedEligibleRows.value.length > 0,
    );

    function arm(action: MonitoringBulkActionEnum) {
        monitoringStore.selectedMonitoringIds = [];
        monitoringStore.armedBulkAction = action;
    }

    function disarm() {
        monitoringStore.armedBulkAction = undefined;
        monitoringStore.selectedMonitoringIds = [];
    }

    function isRowEligible(row: MonitoringRow): boolean {
        const action = armedAction.value;
        if (action == null) {
            return false;
        }
        return isBulkActionEligible(action, row);
    }

    function isRowSelected(row: MonitoringRow): boolean {
        return (
            isRowEligible(row) &&
            monitoringStore.selectedMonitoringIds.includes(row.id)
        );
    }

    function toggleRowSelection(row: MonitoringRow) {
        if (!isRowEligible(row)) {
            return;
        }
        const selected = monitoringStore.selectedMonitoringIds;
        monitoringStore.selectedMonitoringIds = selected.includes(row.id)
            ? selected.filter((id) => id !== row.id)
            : [...selected, row.id];
    }

    function toggleSelectAll(value: boolean) {
        monitoringStore.selectedMonitoringIds = value
            ? eligibleRows.value.map((row) => row.id)
            : [];
    }

    async function applyArmedAction(lockMessage: string) {
        const action = armedAction.value;
        const rows = selectedEligibleRows.value;
        if (action == null || rows.length === 0) {
            return;
        }

        const connectionTokens = generalUtils.createStringCommaList(
            rows.map((row) => row.connectionToken),
        );

        switch (action) {
            case MonitoringBulkActionEnum.LOCK: {
                const clientInstruction: ClientInstruction = {
                    examId: parseInt(examId),
                    connectionToken: connectionTokens,
                    type: InstructionEnum.SEB_FORCE_LOCK_SCREEN,
                    attributes: { message: lockMessage },
                };
                await monitoringService.registerInstruction(
                    examId,
                    clientInstruction,
                );
                break;
            }
            case MonitoringBulkActionEnum.QUIT: {
                const clientInstruction: ClientInstruction = {
                    examId: parseInt(examId),
                    connectionToken: connectionTokens,
                    type: InstructionEnum.SEB_QUIT,
                };
                await monitoringService.registerInstruction(
                    examId,
                    clientInstruction,
                );
                break;
            }
            case MonitoringBulkActionEnum.UNLOCK: {
                await monitoringService.unlockScreens(examId, connectionTokens);
                break;
            }
            case MonitoringBulkActionEnum.CANCEL: {
                await monitoringService.disableConnections(
                    examId,
                    connectionTokens,
                );
                break;
            }
        }

        disarm();
    }

    return {
        armedAction,
        availableActions,
        eligibleRows,
        selectedEligibleRows,
        allEligibleSelected,
        someEligibleSelected,
        arm,
        disarm,
        isRowEligible,
        isRowSelected,
        toggleRowSelection,
        toggleSelectAll,
        applyArmedAction,
    };
}
