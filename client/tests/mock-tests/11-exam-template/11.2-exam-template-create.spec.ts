import en from "@/i18n/locales/en.json" with { type: "json" };

import { test } from "../fixtures/table-list-fixtures";
import { CLIENT_CONFIGURATIONS } from "../mocks/mock-data";

const EXAM_TEMPLATE_NAME = "NadimTest5";

const examTemplateCreateNamingValid1 = {
    name: EXAM_TEMPLATE_NAME,
    description: "test",
    examType: en.BYOD,
    clientConfiguration: CLIENT_CONFIGURATIONS[0].name,
    lmsIntegration: true,
    institutionalDefault: true,
    screenProctoringEnabled: true,
};

const supervisor1 = { username: "jdoe", fullName: "Doe John" };
const supervisor2 = { username: "msmith", fullName: "Smith Maria" };

const EXAM_TEMPLATE_NAME_2 = "NadimTest6";

const examTemplateCreateNamingValid2 = {
    name: EXAM_TEMPLATE_NAME_2,
    description: "template with indicators, groups and seb settings",
    examType: en.MANAGED,
    clientConfiguration: CLIENT_CONFIGURATIONS[0].name,
    lmsIntegration: false,
    institutionalDefault: false,
    screenProctoringEnabled: false,
};

const indicators = [
    {
        name: "Battery Low",
        type: en.indicators.fields.type.types.BATTERY_STATUS,
    },
    {
        name: "Wifi Weak",
        type: en.indicators.fields.type.types.WLAN_STATUS,
    },
];

const ipRangeGroup = {
    name: "Room HG E 1",
    ipRangeStart: "192.168.1.1",
    ipRangeEnd: "192.168.1.254",
};

const clientOSGroup = {
    name: "Windows Clients",
    clientOS: en.clientGroups.fields.clientOS.types.WINDOWS,
};

test.describe("11 Exam Template - Create", () => {
    test.use({ timezoneId: "UTC" });

    test("A create basic exam template", async ({
        examTemplateCreate,
        examTemplate,
    }) => {
        //step 1 - naming
        await examTemplateCreate.goto();

        await examTemplateCreate.expectStepVisible(1);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.fillFormNaming(examTemplateCreateNamingValid1);
        await examTemplateCreate.goToNextStep();

        //step 2 - seb settings
        await examTemplateCreate.expectStepVisible(2);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.goToNextStep();

        //step 3 - exam supervisors
        await examTemplateCreate.expectStepVisible(3);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.expectSupervisorRowVisible(
            supervisor1.username,
        );
        await examTemplateCreate.selectSupervisorRow(supervisor1.username);

        await examTemplateCreate.goToNextStep();

        //step 4 - indicators
        await examTemplateCreate.expectStepVisible(4);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.goToNextStep();

        //step 5 - groups
        await examTemplateCreate.expectStepVisible(5);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.goToNextStep();

        //step 6 - overview
        await examTemplateCreate.expectStepVisible(6);
        await examTemplateCreate.expectStepperSaveButtonVisible();

        await examTemplateCreate.saveExamTemplate();

        //successful creation
        await examTemplate.expectExamTemplateTitleVisible(EXAM_TEMPLATE_NAME);

        await test.step("detail page shows what was created", async () => {
            //reload, so the page shows what the backend stored and not what is left in the wizard state
            await examTemplate.page.reload();
            await examTemplate.expectExamTemplateTitleVisible(
                EXAM_TEMPLATE_NAME,
            );

            await examTemplate.expectBasicSettings(
                examTemplateCreateNamingValid1,
            );

            await examTemplate.expectSupervisorRowVisible(
                supervisor1.username,
                supervisor1.fullName,
            );

            //no groups were added, screen proctoring adds its fallback group as the only row
            await examTemplate.expectClientGroupRowVisible(
                en.clientGroups.fields.type.types.SCREEN_PROCTORING_FALLBACK,
                en.clientGroups.fields.type.types.SCREEN_PROCTORING_FALLBACK,
            );
            await examTemplate.expectClientGroupRowCount(1);
        });
    });

    test("B create exam template with indicators, groups and seb settings", async ({
        examTemplateCreate,
        examTemplate,
    }) => {
        //step 1 - naming
        await examTemplateCreate.goto();

        await examTemplateCreate.expectStepVisible(1);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.fillFormNaming(examTemplateCreateNamingValid2);
        await examTemplateCreate.goToNextStep();

        //step 2 - seb settings
        await examTemplateCreate.expectStepVisible(2);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.openSEBSettingsTab(
            en.sebSettings.views.general,
        );
        await examTemplateCreate.setSEBSettingCheckbox(
            en.sebSettings.generalView.allowQuit,
            false,
        );
        await examTemplateCreate.setSEBSettingCheckbox(
            en.sebSettings.generalView.configuration.allowPreferencesWindow,
            true,
        );

        await examTemplateCreate.goToNextStep();

        //step 3 - exam supervisors
        await examTemplateCreate.expectStepVisible(3);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.expectSupervisorRowVisible(
            supervisor2.username,
        );
        await examTemplateCreate.selectSupervisorRow(supervisor2.username);

        await examTemplateCreate.goToNextStep();

        //step 4 - indicators
        await examTemplateCreate.expectStepVisible(4);
        await examTemplateCreate.expectStepperNextButtonVisible();

        for (const indicator of indicators) {
            await examTemplateCreate.addIndicator(
                indicator.name,
                indicator.type,
            );
            await examTemplateCreate.expectIndicatorRowVisible(
                indicator.name,
                indicator.type,
            );
        }

        await examTemplateCreate.goToNextStep();

        //step 5 - groups
        await examTemplateCreate.expectStepVisible(5);
        await examTemplateCreate.expectStepperNextButtonVisible();

        await examTemplateCreate.addIPRangeGroup(ipRangeGroup);
        await examTemplateCreate.expectGroupRowVisible(ipRangeGroup.name);

        await examTemplateCreate.addClientOSGroup(clientOSGroup);
        await examTemplateCreate.expectGroupRowVisible(clientOSGroup.name);

        await examTemplateCreate.goToNextStep();

        //step 6 - overview
        await examTemplateCreate.expectStepVisible(6);
        await examTemplateCreate.expectStepperSaveButtonVisible();

        await examTemplateCreate.expectSummaryContains([
            EXAM_TEMPLATE_NAME_2,
            ...indicators.map((indicator) => indicator.name),
            ipRangeGroup.name,
            clientOSGroup.name,
        ]);

        await examTemplateCreate.saveExamTemplate();

        //successful creation
        await examTemplate.expectExamTemplateTitleVisible(EXAM_TEMPLATE_NAME_2);

        await test.step("detail page shows what was created", async () => {
            //reload, so the page shows what the backend stored and not what is left in the wizard state
            await examTemplate.page.reload();
            await examTemplate.expectExamTemplateTitleVisible(
                EXAM_TEMPLATE_NAME_2,
            );

            await examTemplate.expectBasicSettings(
                examTemplateCreateNamingValid2,
            );
            await examTemplate.expectSupervisorRowVisible(
                supervisor2.username,
                supervisor2.fullName,
            );

            //indicators were added without thresholds
            for (const indicator of indicators) {
                await examTemplate.expectIndicatorRowVisible(
                    indicator.name,
                    indicator.type,
                    [],
                );
            }

            await examTemplate.expectClientGroupRowVisible(
                ipRangeGroup.name,
                en.clientGroups.fields.type.types.IP_V4_RANGE,
            );
            await examTemplate.expectClientGroupRowVisible(
                clientOSGroup.name,
                en.clientGroups.fields.type.types.CLIENT_OS,
            );
            await examTemplate.expectClientGroupRowCount(2);
        });
    });
});
