import { expect, Locator, Page, TestInfo } from "@playwright/test";

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
