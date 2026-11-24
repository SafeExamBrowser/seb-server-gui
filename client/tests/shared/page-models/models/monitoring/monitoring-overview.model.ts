import { expect, type Locator, type Page } from "@playwright/test";

import en from "@/i18n/locales/en.json" with { type: "json" };

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
        await expect(
            this.page.getByTestId(`${PREFIX}-connections-total`),
        ).toHaveText(
            new RegExp(
                `^${total}\\s*${en.monitoringOverview.infos.connections}$`,
            ),
        );
    }

    //------------client states box-------------
    private clientStatesBox(): Locator {
        return this.page.locator(".v-card").filter({
            has: this.page.getByRole("heading", {
                name: en.monitoringOverview.clientStates.clientStates,
            }),
        });
    }

    // a state row is "<dot> <label> <count>" inside the "Client States" box
    stateRow(label: string): Locator {
        return this.clientStatesBox()
            .getByText(label, { exact: true })
            .locator("..");
    }

    async expectStateCount(label: string, count: number) {
        await expect(this.stateRow(label).locator("span").last()).toHaveText(
            String(count),
        );
    }

    async clickState(label: string) {
        await this.stateRow(label).click();
    }

    //------------notifications / indicators box-------------
    async expectNotificationCount(label: string, count: number) {
        return notImplemented(label, count);
    }

    async clickNotification(label: string) {
        await this.page
            .locator(".v-card")
            .filter({
                has: this.page.getByRole("heading", {
                    name: en.monitoringOverview.notifications.notifications,
                }),
            })
            .getByText(label, { exact: true })
            .click();
    }

    //------------groups-------------
    groupTile(groupName: string): Locator {
        return this.page
            .getByRole("heading", { name: groupName, exact: true, level: 3 })
            .locator("xpath=ancestor::div[contains(@class, 'v-sheet')][1]");
    }

    // the tile only shows the active clients, not the total
    async expectGroupClients(groupName: string, activeClients: number) {
        await expect(this.groupTile(groupName).locator(".v-chip")).toHaveText(
            new RegExp(
                `^${activeClients}\\s*${en.monitoringOverview.groups.clients.trim()}$`,
            ),
        );
    }

    async clickGroupList(groupName: string) {
        await this.groupTile(groupName)
            .getByRole("button", {
                name: en.monitoringOverview.groups.buttons.viewList,
            })
            .click();
    }

    //------------quit all-------------
    async openQuitAllDialog(): Promise<Locator> {
        await this.page
            .getByRole("button", { name: en.monitoringOverview.quitAll.button })
            .click();
        const dialog = this.page.getByRole("dialog", {
            name: en.monitoringOverview.quitAll.title,
        });
        await expect(dialog).toBeVisible();
        return dialog;
    }

    async confirmQuitAll(confirmText: string) {
        const dialog = this.page.getByRole("dialog", {
            name: en.monitoringOverview.quitAll.title,
        });
        await dialog.getByRole("textbox").fill(confirmText);
        await dialog
            .getByRole("button", { name: en.monitoringOverview.quitAll.doQuit })
            .click();
    }

    //------------monitoring not possible-------------
    async expectMonitoringDisabledWarning(text: string) {
        await expect(this.page.getByText(text, { exact: true })).toBeVisible();
        await expect(this.pageTitle).toBeHidden();
    }
}
