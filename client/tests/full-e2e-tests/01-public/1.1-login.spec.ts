import { test } from "../fixtures/table-list-fixtures";


const credentials = {
    username: "testmain",
    password: "testmain",
};

const credentialsWrong = {
    username: "testmain",
    password: "testmainWrong",
};


test.describe("01 Public - LOGIN", () => {
    test.use({timezoneId: "UTC"});

    test("A login with valid credentials --> testmain / testmain", async ({
        login,
    }) => {
        await login.goto();

        //check if sign in button is visible
        await login.expectVisible();

        await login.login(
            credentials.username,
            credentials.password
        )

        await login.expectHomePage();
    });

    test("B login with invalid credentials --> testmain / testmainWrong", async ({
        login,
    }) => {
        await login.goto();

        //check if sign in button is visible
        await login.expectVisible();

        await login.login(
            credentialsWrong.username,
            credentialsWrong.password);

        await login.expectWrongCredentials();
    });
});
