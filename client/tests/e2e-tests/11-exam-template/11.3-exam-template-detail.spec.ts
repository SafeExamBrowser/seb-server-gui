import { ErrorCode } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import en from "@/i18n/locales/en.json" with { type: "json" };

import { expectVuetifySwitch } from "../../utils/helpers";
import { expect, test } from "../fixtures/table-list-fixtures";
import {
    EXAM_TEMPLATE_1,
    EXAM_TEMPLATE_1_CLIENT_CONFIGURATION,
    EXAM_TEMPLATE_1_CONFIGURATION_NODE,
    EXAM_TEMPLATES,
    SUPERVISORS,
} from "../mocks/mock-data";

const EXAM_TEMPLATE_DETAIL_URL =
    /\/api\/admin-api\/v1\/exam-template\/\d+(?:$|\?)/i;
const EXAM_TEMPLATE_NAMES_URL =
    /\/api\/admin-api\/v1\/exam-template\/names(?:$|\?)/i;

test.describe("11 Exam Template - Detail", () => {
    test.use({ timezoneId: "UTC" });

    test("A shows the basic settings of the exam template", async ({
        examTemplate,
    }) => {
        await test.step("open detail page", async () => {
            await examTemplate.goto(EXAM_TEMPLATE_1.id);
            await examTemplate.expectExamTemplateTitleVisible(
                EXAM_TEMPLATE_1.name,
            );
        });

        await test.step("text settings show the template values", async () => {
            await examTemplate.expectBasicSettingText(
                en.examTemplate.fields.name.label,
                EXAM_TEMPLATE_1.name,
            );
            await examTemplate.expectBasicSettingText(
                en.examTemplate.fields.description.label,
                EXAM_TEMPLATE_1.description,
            );
            await examTemplate.expectBasicSettingText(
                en.examTemplate.fields.examType.label,
                EXAM_TEMPLATE_1.examType,
            );
            await examTemplate.expectBasicSettingText(
                en.examTemplate.fields.clientConfiguration.label,
                EXAM_TEMPLATE_1_CLIENT_CONFIGURATION.name,
            );
        });

        await test.step("flags show the template values", async () => {
            await examTemplate.expectBasicSettingFlag(
                en.examTemplate.fields.lmsIntegration.label,
                EXAM_TEMPLATE_1.lmsIntegration,
            );
            await examTemplate.expectBasicSettingFlag(
                en.examTemplate.fields.institutionalDefault.label,
                EXAM_TEMPLATE_1.institutionalDefault,
            );
            await examTemplate.expectBasicSettingFlag(
                en.screenProctoring.enabled.label,
                EXAM_TEMPLATE_1.EXAM_ATTRIBUTES.enableScreenProctoring ===
                    "true",
            );
        });
    });

    test("B shows the SEB settings box with last modified by and date", async ({
        examTemplate,
    }) => {
        await examTemplate.goto(EXAM_TEMPLATE_1.id);

        //seb settings box is loaded separately after the page, so wait for it
        await examTemplate.expectSEBSettingsLastModified(
            `${EXAM_TEMPLATE_1_CONFIGURATION_NODE.lastUpdateUserName} - ${formatDateTimeUTC(EXAM_TEMPLATE_1_CONFIGURATION_NODE.lastUpdateTime)}`,
        );
    });

    test("C shows the indicators table with name, type and thresholds", async ({
        examTemplate,
    }) => {
        await examTemplate.goto(EXAM_TEMPLATE_1.id);

        //every indicator of the template is shown with its translated type and thresholds
        for (const indicator of EXAM_TEMPLATE_1.indicatorTemplates) {
            await examTemplate.expectIndicatorRowVisible(
                indicator.name,
                en.indicators.fields.type.types[indicator.type],
                //the api delivers colors without "#", the ui adds it (see colorCodec in src/models/seb-server/examTemplate.ts)
                indicator.thresholds.map(
                    (threshold) => `${threshold.value}% / #${threshold.color}`,
                ),
            );
        }
    });

    test("D shows the assigned exam supervisors", async ({ examTemplate }) => {
        await examTemplate.goto(EXAM_TEMPLATE_1.id);

        //only the supervisors in "supporter" are shown, split into username and full name
        const assignedSupervisors = SUPERVISORS.filter((supervisor) =>
            EXAM_TEMPLATE_1.supporter.includes(supervisor.modelId),
        );

        for (const supervisor of assignedSupervisors) {
            const { username, fullName } = splitSupervisorName(supervisor.name);
            await examTemplate.expectSupervisorRowVisible(username, fullName);
        }
    });

    test("E shows only the screen proctoring fallback group when there are no client groups", async ({
        examTemplate,
    }) => {
        await examTemplate.goto(EXAM_TEMPLATE_1.id);

        //EXAM_TEMPLATE_1 has no client groups, but screen proctoring is enabled,
        //so the table shows the fallback group (named after spsCollectingGroupName) as its only row
        await examTemplate.expectClientGroupRowVisible(
            EXAM_TEMPLATE_1.EXAM_ATTRIBUTES.spsCollectingGroupName,
            en.clientGroups.fields.type.types.SCREEN_PROCTORING_FALLBACK,
        );
        await examTemplate.expectClientGroupRowCount(
            EXAM_TEMPLATE_1.CLIENT_GROUP_TEMPLATES.length + 1,
        );
    });

    test("F breadcrumb navigates back to the exam template overview", async ({
        examTemplate,
    }) => {
        await examTemplate.goto(EXAM_TEMPLATE_1.id);

        await examTemplate.clickBreadCrumb(en.titles.examTemplateList);

        await expect(examTemplate.page).toHaveURL(/\/exam-template$/);
    });

    test("G shows the not-found page when the exam template does not exist (404)", async ({
        examTemplate,
    }) => {
        await examTemplate.page.route(EXAM_TEMPLATE_DETAIL_URL, (route) =>
            route.fulfill({
                status: 404,
                contentType: "application/json",
                //the ui only shows the not-found page for a real backend error (api message array)
                body: JSON.stringify([
                    {
                        messageCode: ErrorCode.RESOURCE_NOT_FOUND,
                        systemMessage: "Not Found (forced by Playwright)",
                    },
                ]),
            }),
        );

        await examTemplate.gotoWithoutWaiting(EXAM_TEMPLATE_1.id);

        //the page renders the 404 error state with a link back to the list
        await examTemplate.errorState.expectVisible();
        await expect(examTemplate.errorState.root).toContainText(
            en.examTemplateDetail.notFound.message,
        );

        await examTemplate.errorState.root
            .getByRole("link", {
                name: en.examTemplateDetail.notFound.backToList,
            })
            .click();
        await expect(examTemplate.page).toHaveURL(/\/exam-template$/);
    });

    test("H shows error UI when the detail request fails with 500", async ({
        examTemplate,
    }) => {
        await examTemplate.page.route(EXAM_TEMPLATE_DETAIL_URL, (route) =>
            route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({
                    message: "Internal Server Error (forced by Playwright)",
                }),
            }),
        );

        await examTemplate.gotoWithoutWaiting(EXAM_TEMPLATE_1.id);

        //the query retries once before the error is shown
        await examTemplate.errorState.expectVisible();
        await expect(examTemplate.errorState.root).toContainText(
            en.general.somethingWentWrong,
        );
    });

    test("K edit basic settings dialog opens with the current values prefilled", async ({
        examTemplate,
    }) => {
        //the dialog checks the name against all template names, the global mock has this route commented out
        await examTemplate.page.route(EXAM_TEMPLATE_NAMES_URL, (route) =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(
                    EXAM_TEMPLATES.map((template) => ({
                        modelId: String(template.id),
                        entityType: "EXAM_TEMPLATE",
                        name: template.name,
                    })),
                ),
            }),
        );

        await examTemplate.goto(EXAM_TEMPLATE_1.id);

        const dialog = await examTemplate.openBasicSettingsEditDialog();

        //text fields - not exact, because required fields have a " *" behind the label
        await expect(
            dialog.getByRole("textbox", {
                name: en.examTemplate.fields.name.label,
            }),
        ).toHaveValue(EXAM_TEMPLATE_1.name);
        await expect(
            dialog.getByRole("textbox", {
                name: en.examTemplate.fields.description.label,
            }),
        ).toHaveValue(EXAM_TEMPLATE_1.description);

        //select
        //the selected value is rendered in the outer combobox, the labelled one is only the input
        await expect(
            dialog.getByRole("combobox").filter({
                has: examTemplate.page.getByRole("combobox", {
                    name: en.examTemplate.fields.examType.label,
                }),
            }),
        ).toContainText(EXAM_TEMPLATE_1.examType);

        //switches
        await expectVuetifySwitch(
            dialog,
            en.examTemplate.fields.lmsIntegration.label,
            EXAM_TEMPLATE_1.lmsIntegration,
        );
        await expectVuetifySwitch(
            dialog,
            en.examTemplate.fields.institutionalDefault.label,
            EXAM_TEMPLATE_1.institutionalDefault,
        );
        await expectVuetifySwitch(
            dialog,
            en.screenProctoring.enabled.label,
            EXAM_TEMPLATE_1.EXAM_ATTRIBUTES.enableScreenProctoring === "true",
        );
    });
});

//the browser runs in UTC (see test.use above), so the expected date has to be formatted in UTC too
//mirrors formatIsoToReadableDateTime in src/utils/timeUtils.ts
function formatDateTimeUTC(iso: string) {
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
function splitSupervisorName(name: string) {
    return {
        username: name.match(/^(.+?) \(/)?.[1] ?? name,
        fullName: name.match(/\((.*?)\)/)?.[1] ?? "",
    };
}
