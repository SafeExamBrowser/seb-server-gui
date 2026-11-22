import { type Locator, type Page } from "@playwright/test";

import { notImplemented } from "../../../../utils/helpers.ts";
import { BasicPageModel } from "../../generic-models/basic-page.model.ts";

const ROUTE = "/monitoring/:id";
const PREFIX = "monitoring-detail-page";
const PAGE_TEST_ID = "monitoring-detail-page";

export class MonitoringOverviewModel extends BasicPageModel {
    constructor(page: Page) {
        super(page, {
            route: ROUTE,
            testPrefix: PREFIX,
            pageTestId: PAGE_TEST_ID,
        });
    }

    //------------header-------------
    async expectConnectionsTotal(total: number) {
        return notImplemented(total);
    }

    //------------client states box-------------
    // a state row is "<dot> <label> <count>" inside the "Client States" box
    stateRow(label: string): Locator {
        return notImplemented(label);
    }

    async expectStateCount(label: string, count: number) {
        return notImplemented(label, count);
    }

    async clickState(label: string) {
        return notImplemented(label);
    }

    //------------notifications / indicators box-------------
    async expectNotificationCount(label: string, count: number) {
        return notImplemented(label, count);
    }

    async clickNotification(label: string) {
        return notImplemented(label);
    }

    //------------groups-------------
    groupTile(groupName: string): Locator {
        return notImplemented(groupName);
    }

    async expectGroupClients(
        groupName: string,
        activeClients: number,
        clientAmount: number,
    ) {
        return notImplemented(groupName, activeClients, clientAmount);
    }

    async clickGroupList(groupName: string) {
        return notImplemented(groupName);
    }

    //------------quit all-------------
    async openQuitAllDialog(): Promise<Locator> {
        return notImplemented();
    }

    async confirmQuitAll(confirmText: string) {
        return notImplemented(confirmText);
    }

    async expectQuitAllSubmitDisabled() {
        return notImplemented();
    }

    //------------monitoring not possible-------------
    async expectMonitoringDisabledWarning(text: string) {
        return notImplemented(text);
    }
}
