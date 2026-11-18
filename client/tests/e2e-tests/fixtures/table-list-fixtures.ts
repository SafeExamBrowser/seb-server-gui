import { test as base } from "@playwright/test";

import { SERVER_ADMIN_STORAGE_STATE } from "../../config/auth.ts";
import { NotFoundPageModel } from "../../shared/page-models/layout/not-found-page.model.ts";
import { ProfileMenuModel } from "../../shared/page-models/layout/profile-menu.model.ts";
import { AnalyzeListModel } from "../../shared/page-models/models/analyze/analyze-list.model.ts";
import { ArchiveListModel } from "../../shared/page-models/models/archive/archive-list.model.ts";
import { AssessmentToolCreateModel } from "../../shared/page-models/models/assessment-tool/assessment-tool-create.model.ts";
import { AssessmentToolEditModel } from "../../shared/page-models/models/assessment-tool/assessment-tool-edit.model.ts";
import { AssessmentToolsListModel } from "../../shared/page-models/models/assessment-tool/assessment-tools-list.model.ts";
import { CertificatesListModel } from "../../shared/page-models/models/certificate/certificates-list.model.ts";
import { ConnectionConfigurationCreateModel } from "../../shared/page-models/models/connection-configuration/connection-configuration-create.model.ts";
import { ConnectionConfigurationEditModel } from "../../shared/page-models/models/connection-configuration/connection-configuration-edit.model.ts";
import { ConnectionConfigurationsListModel } from "../../shared/page-models/models/connection-configuration/connection-configurations-list.model.ts";
import { ExamModel } from "../../shared/page-models/models/exam/exam.model.ts";
import { ExamCreateModel } from "../../shared/page-models/models/exam/exam-create.model.ts";
import { ExamsListModel } from "../../shared/page-models/models/exam/exams-list.model.ts";
import { ExamTemplateModel } from "../../shared/page-models/models/exam-template/exam-template.model.ts";
import { ExamTemplateCreateModel } from "../../shared/page-models/models/exam-template/exam-template-create.model.ts";
import { ExamTemplateListModel } from "../../shared/page-models/models/exam-template/exam-template-list.model.ts";
import { InstitutionsListModel } from "../../shared/page-models/models/institution/institutions-list.model.ts";
import { MonitoringListModel } from "../../shared/page-models/models/monitoring/monitoring-list.model.ts";
import { UserAccountCreateModel } from "../../shared/page-models/models/user-account/user-account-create.model.ts";
import { UserAccountEditModel } from "../../shared/page-models/models/user-account/user-account-edit.model.ts";
import { UserAccountProfileModel } from "../../shared/page-models/models/user-account/user-account-profile.model.ts";
import { UserAccountRegisterModel } from "../../shared/page-models/models/user-account/user-account-register.model.ts";
import { UserAccountsListModel } from "../../shared/page-models/models/user-account/user-accounts-list.model.ts";
import { installMockBackend } from "../mocks/mock-backend.ts";

type Fixtures = {
    userAccounts: UserAccountsListModel;
    userAccountCreate: UserAccountCreateModel;
    userAccountEdit: UserAccountEditModel;
    userAccountRegister: UserAccountRegisterModel;
    userAccountProfile: UserAccountProfileModel;
    profileMenu: ProfileMenuModel;
    notFoundPage: NotFoundPageModel;
    institutions: InstitutionsListModel;
    connectionConfigurations: ConnectionConfigurationsListModel;
    connectionConfigurationCreate: ConnectionConfigurationCreateModel;
    connectionConfigurationEdit: ConnectionConfigurationEditModel;
    certificates: CertificatesListModel;
    assessmentTools: AssessmentToolsListModel;
    assessmentToolCreate: AssessmentToolCreateModel;
    assessmentToolEdit: AssessmentToolEditModel;
    exams: ExamsListModel;
    examCreate: ExamCreateModel;
    exam: ExamModel;
    monitoringExams: MonitoringListModel;
    analyzeExams: AnalyzeListModel;
    archiveExams: ArchiveListModel;

    examTemplates: ExamTemplateListModel;
    examTemplate: ExamTemplateModel;
    examTemplateCreate: ExamTemplateCreateModel;

    // installed for every test, so the app never reaches a real backend
    mockBackend: undefined;
};

export const test = base.extend<Fixtures>({
    // every test starts logged in as server admin (see tests/config/auth.setup.ts);
    // specs that need a logged-out visitor override this with LOGGED_OUT_STORAGE_STATE
    storageState: SERVER_ADMIN_STORAGE_STATE,

    mockBackend: [
        async ({ page }, use, testInfo) => {
            await installMockBackend(page, testInfo.project.name);
            await use(undefined);
        },
        { auto: true },
    ],

    // Register is a public page; its spec runs logged out (LOGGED_OUT_STORAGE_STATE).
    userAccountRegister: async ({ page }, use) => {
        await use(new UserAccountRegisterModel(page));
    },

    userAccounts: async ({ page }, use) => {
        await use(new UserAccountsListModel(page));
    },
    userAccountCreate: async ({ page }, use) => {
        await use(new UserAccountCreateModel(page));
    },
    userAccountEdit: async ({ page }, use) => {
        await use(new UserAccountEditModel(page));
    },
    userAccountProfile: async ({ page }, use) => {
        await use(new UserAccountProfileModel(page));
    },
    profileMenu: async ({ page }, use) => {
        await use(new ProfileMenuModel(page));
    },
    notFoundPage: async ({ page }, use) => {
        await use(new NotFoundPageModel(page));
    },
    institutions: async ({ page }, use) => {
        await use(new InstitutionsListModel(page));
    },
    connectionConfigurations: async ({ page }, use) => {
        await use(new ConnectionConfigurationsListModel(page));
    },
    connectionConfigurationCreate: async ({ page }, use) => {
        await use(new ConnectionConfigurationCreateModel(page));
    },
    connectionConfigurationEdit: async ({ page }, use) => {
        await use(new ConnectionConfigurationEditModel(page));
    },
    certificates: async ({ page }, use) => {
        await use(new CertificatesListModel(page));
    },
    assessmentTools: async ({ page }, use) => {
        await use(new AssessmentToolsListModel(page));
    },
    assessmentToolCreate: async ({ page }, use) => {
        await use(new AssessmentToolCreateModel(page));
    },
    assessmentToolEdit: async ({ page }, use) => {
        await use(new AssessmentToolEditModel(page));
    },
    exams: async ({ page }, use) => {
        await use(new ExamsListModel(page));
    },
    examCreate: async ({ page }, use) => {
        await use(new ExamCreateModel(page));
    },
    exam: async ({ page }, use) => {
        await use(new ExamModel(page));
    },
    monitoringExams: async ({ page }, use) => {
        await use(new MonitoringListModel(page));
    },
    analyzeExams: async ({ page }, use) => {
        await use(new AnalyzeListModel(page));
    },
    archiveExams: async ({ page }, use) => {
        await use(new ArchiveListModel(page));
    },
    examTemplates: async ({ page }, use) => {
        await use(new ExamTemplateListModel(page));
    },
    examTemplateCreate: async ({ page }, use) => {
        await use(new ExamTemplateCreateModel(page));
    },
    examTemplate: async ({ page }, use) => {
        await use(new ExamTemplateModel(page));
    },
});

export { expect } from "@playwright/test";
