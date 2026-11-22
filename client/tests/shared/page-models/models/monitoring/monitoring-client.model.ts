import { type Locator, type Page } from "@playwright/test";

import { notImplemented } from "../../../../utils/helpers.ts";
import { BasicPageModel } from "../../generic-models/basic-page.model.ts";

const ROUTE = "/monitoring/:examId/client/:connectionToken";
const PREFIX = "monitoring-client-detail-page";
// the route has no pageTestId meta, so expectVisible only checks the title
const PAGE_TEST_ID = "";

export type ClientAction = "lock" | "quit" | "markCancelled";

export type ClientLogTab = "all" | "info" | "warning" | "error";

export class MonitoringClientModel extends BasicPageModel {
    constructor(page: Page) {
        super(page, {
            route: ROUTE,
            testPrefix: PREFIX,
            pageTestId: PAGE_TEST_ID,
        });
    }

    async gotoClient(examId: number, connectionToken: string) {
        return notImplemented(examId, connectionToken);
    }

    async expectVisible() {
        return notImplemented();
    }

    //------------context panel-------------
    async expectClientName(sessionName: string) {
        return notImplemented(sessionName);
    }

    async expectStatus(statusLabel: string) {
        return notImplemented(statusLabel);
    }

    async expectGroups(groupNames: string[]) {
        return notImplemented(groupNames);
    }

    async expectSebInfo(chips: string[]) {
        return notImplemented(chips);
    }

    async expectIndicator(name: string, value: string) {
        return notImplemented(name, value);
    }

    async expectIndicatorsHidden() {
        return notImplemented();
    }

    //------------actions-------------
    actionButton(action: ClientAction): Locator {
        return notImplemented(action);
    }

    async expectActionEnabled(action: ClientAction, enabled: boolean) {
        return notImplemented(action, enabled);
    }

    // dialog is labelled by its title (aria-labelledby)
    instructionDialog(title: string): Locator {
        return notImplemented(title);
    }

    async lock(message: string) {
        return notImplemented(message);
    }

    async quit() {
        return notImplemented();
    }

    async markCancelled() {
        return notImplemented();
    }

    async openAndCancelDialog(action: ClientAction) {
        return notImplemented(action);
    }

    //------------notifications-------------
    notificationCard(text: string): Locator {
        return notImplemented(text);
    }

    async expectNotificationCard(text: string, visible: boolean) {
        return notImplemented(text, visible);
    }

    async resolveRaiseHand() {
        return notImplemented();
    }

    async unlockScreen() {
        return notImplemented();
    }

    //------------main area-------------
    async expectTabs(tabLabels: string[]) {
        return notImplemented(tabLabels);
    }

    async selectMainTab(label: string) {
        return notImplemented(label);
    }

    //------------logs-------------
    logRows(): Locator {
        return notImplemented();
    }

    async expectLogRows(texts: string[]) {
        return notImplemented(texts);
    }

    async selectLogTab(tab: ClientLogTab) {
        return notImplemented(tab);
    }

    async searchLogs(text: string) {
        return notImplemented(text);
    }

    async goToLogPage(pageNumber: number) {
        return notImplemented(pageNumber);
    }

    //------------navigation-------------
    async backToClientList() {
        return notImplemented();
    }
}
