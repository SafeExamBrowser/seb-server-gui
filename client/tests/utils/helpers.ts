import { expect, Locator, Page, TestInfo } from "@playwright/test";

import en from "@/i18n/locales/en.json" with { type: "json" };

export function generateUniqueUsername(prefix = "e2e") {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const ts = [
        d.getUTCFullYear(),
        pad(d.getUTCMonth() + 1),
        pad(d.getUTCDate()),
        "-",
        pad(d.getUTCHours()),
        pad(d.getUTCMinutes()),
        pad(d.getUTCSeconds()),
        "-",
        d.getUTCMilliseconds(),
    ].join("");
    return `${prefix}-${ts}`;
}

function activeListbox(page: Page) {
    return page
        .locator(".v-overlay--active [role='listbox']")
        .filter({ has: page.locator("[role='option']") })
        .last();
}
export async function selectVuetifyOptionByName(
    page: Page,
    selectRoot: Locator,
    optionName: string,
) {
    await selectRoot.scrollIntoViewIfNeeded();
    await selectRoot.click({ force: true });

    const listbox = activeListbox(page);
    await expect(listbox).toBeVisible();

    const option = listbox.getByRole("option", {
        name: optionName,
        exact: true,
    });

    await option.scrollIntoViewIfNeeded();
    await expect(option).toBeVisible();
    await expect(option).toBeEnabled();

    await option.click({ trial: true });
    await option.click();

    await expect(listbox).toBeHidden({ timeout: 10_000 });
}

export async function selectVuetifyFirstOption(
    page: Page,
    selectRoot: Locator,
) {
    await selectRoot.click();

    const listbox = activeListbox(page);
    await expect(listbox).toBeVisible();

    const firstOption = listbox.getByRole("option").first();
    await expect(firstOption).toBeVisible();

    await firstOption.click();
    await expect(listbox).toBeHidden();
}

export async function expectVuetifySwitch(
    container: Locator,
    label: string,
    checked: boolean,
) {
    //vuetify renders v-switch as a checkbox
    await expect(
        container.getByRole("checkbox", { name: label, exact: true }),
    ).toBeChecked({ checked });
}

//navigate
export async function navigateTo(page: Page, route: string) {
    await page.goto(route);
}

export async function clearLocalAndSessionStorage(page: Page) {
    await page.addInitScript(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
}

export async function expectToHaveUrl(page: Page, path: string) {
    const regex = new RegExp(`\\/${path}(?:$|[?#])`, "i");

    await expect(page).toHaveURL(regex, {
        timeout: 10_000,
    });
}

export function suffixForProject(projectName: string) {
    return projectName.toLowerCase();
}

export function addBrowserSuffixToText(
    text: string,
    testInfo: TestInfo,
): string {
    const browserSuffix = suffixForProject(testInfo.project.name).toLowerCase();
    return `${text}-${browserSuffix}`;
}

//the browser runs in UTC (the specs set timezoneId: "UTC"), so the expected date has to be formatted in UTC too
//mirrors formatIsoToReadableDateTime in src/utils/timeUtils.ts
export function formatDateTimeUTC(iso: string) {
    const date = new Date(iso);
    const datePart = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
    const timePart = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
    });
    return `${datePart} • ${timePart}`;
}

//"jdoe (Doe John)" -> username "jdoe", full name "Doe John" (same as src/utils/userAccount.ts)
export function splitSupervisorName(name: string) {
    return {
        username: name.match(/^(.+?) \(/)?.[1] ?? name,
        fullName: name.match(/\((.*?)\)/)?.[1] ?? "",
    };
}

//the label the exam detail page shows for an exam type (useBasicSettingsItems in src)
export const EXAM_TYPE_LABELS: Record<string, string> = {
    MANAGED: en.MANAGED,
    BYOD: en.BYOD,
    VDI: en.VDI,
};
