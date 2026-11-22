import { type Locator, type Page } from "@playwright/test";

import { MonitoringBulkActionEnum } from "@/models/seb-server/monitoringEnums.ts";

import { notImplemented } from "../../../../utils/helpers.ts";
import { BasicPageModel } from "../../generic-models/basic-page.model.ts";
import { SearchBarModel } from "../../widgets/search-bar.model.ts";

const ROUTE = "/monitoring/:id/client";
const PREFIX = "monitoring-clients";
const PAGE_TEST_ID = "monitoring-detail-clients-page";

// the testIdSuffix of the filter sections in useMonitoringClientsFilters.ts
export const MONITORING_CLIENTS_FILTER = {
    groups: "groups",
    states: "states",
    notifications: "notifications",
    indicators: "indicators",
} as const;

export type MonitoringClientsFilterSection =
    (typeof MONITORING_CLIENTS_FILTER)[keyof typeof MONITORING_CLIENTS_FILTER];

export class MonitoringClientsModel extends BasicPageModel {
    readonly searchBar: SearchBarModel;

    constructor(page: Page) {
        super(page, {
            route: ROUTE,
            testPrefix: PREFIX,
            pageTestId: PAGE_TEST_ID,
        });
        this.searchBar = new SearchBarModel(page, PREFIX);
    }

    // query e.g. { "show-states": "ACTIVE,MISSING" }
    async gotoWithQuery(examId: number, query: Record<string, string>) {
        return notImplemented(examId, query);
    }

    //------------table-------------
    // the rows have no test ids, they are located by the user name / session column
    rows(): Locator {
        return notImplemented();
    }

    row(sessionName: string): Locator {
        return notImplemented(sessionName);
    }

    async expectRowNames(sessionNames: string[]) {
        return notImplemented(sessionNames);
    }

    async expectRowStatus(sessionName: string, statusLabel: string) {
        return notImplemented(sessionName, statusLabel);
    }

    async expectRowGroups(sessionName: string, groupNames: string[]) {
        return notImplemented(sessionName, groupNames);
    }

    async expectLockPendingIcon(sessionName: string, visible: boolean) {
        return notImplemented(sessionName, visible);
    }

    async expectRaiseHandIcon(sessionName: string, visible: boolean) {
        return notImplemented(sessionName, visible);
    }

    // the chevron is the last button of the row
    async openClient(sessionName: string) {
        return notImplemented(sessionName);
    }

    //------------filters / search-------------
    async toggleFilter(section: MonitoringClientsFilterSection, value: string) {
        return notImplemented(section, value);
    }

    async clearAllFilters() {
        return notImplemented();
    }

    async search(text: string) {
        return notImplemented(text);
    }

    //------------bulk actions-------------
    actionButton(action: MonitoringBulkActionEnum): Locator {
        return notImplemented(action);
    }

    async expectActionButtonVisible(
        action: MonitoringBulkActionEnum,
        visible: boolean,
    ) {
        return notImplemented(action, visible);
    }

    async armAction(action: MonitoringBulkActionEnum) {
        return notImplemented(action);
    }

    async expectRowSelectable(sessionName: string, selectable: boolean) {
        return notImplemented(sessionName, selectable);
    }

    async selectRow(sessionName: string) {
        return notImplemented(sessionName);
    }

    async setLockMessage(message: string) {
        return notImplemented(message);
    }

    async expectConfirmActionEnabled(enabled: boolean) {
        return notImplemented(enabled);
    }

    async confirmAction() {
        return notImplemented();
    }

    async cancelAction() {
        return notImplemented();
    }
}
