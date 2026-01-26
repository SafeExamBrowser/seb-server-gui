import { expect, Locator, Page } from "@playwright/test";

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

//select specific item from select
export async function selectVuetifyOptionByName(
    page: Page,
    selectRoot: Locator,
    optionName: string,
) {
    const input = selectRoot.locator(".v-field__input").first();
    await input.click();

    const option = page.getByRole("option", { name: optionName });
    await option.click();

    await page.keyboard.press("Escape").catch(() => {});
}

//select first item from select
export async function selectVuetifyFirstOption(
    page: Page,
    selectRoot: Locator,
) {
    const input = selectRoot.locator(".v-field__input").first();
    await input.click();

    await expect(page.getByRole("option").first()).toBeVisible({
        timeout: 10000,
    });

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Escape").catch(() => {});
}
