import { test, expect } from "../shared/fixtures/table-list-fixtures";

// The header chip reflects the logged-in admin (testmain / Server Administrator).
const currentUser = {
    username: "testmain",
    fullName: "Test Main",
    roleLabel: "Server Administrator",
};

test.describe("01 User Accounts - HEADER PROFILE MENU", () => {
    test("A the chip shows the current user's name and primary role", async ({
        profileMenu,
    }) => {
        await profileMenu.page.goto("/navigation-overview");
        await profileMenu.expectChipShows(
            currentUser.fullName,
            currentUser.roleLabel,
        );
    });

    test("B the menu shows the username and role and links to profile settings", async ({
        profileMenu,
    }) => {
        await profileMenu.page.goto("/navigation-overview");
        await profileMenu.open();

        await expect(profileMenu.username).toHaveText(currentUser.username);
        await profileMenu.expectRole(currentUser.roleLabel);

        await profileMenu.gotoProfileSettings();
        await expect(profileMenu.page).toHaveURL(/\/profile(?:$|[?#])/);
    });

    test("C logging out from the menu returns to the login page", async ({
        profileMenu,
    }) => {
        await profileMenu.page.goto("/navigation-overview");
        await profileMenu.open();
        await profileMenu.logout();

        await expect(profileMenu.page).toHaveURL(/\/login(?:$|[?#])/);
    });
});
