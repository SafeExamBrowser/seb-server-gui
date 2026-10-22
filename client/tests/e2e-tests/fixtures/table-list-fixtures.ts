import { test as base } from "@playwright/test";

import { UserAccountCreateModel } from "../../shared/page-models/models/user-account/user-account-create.model.ts";
import { UserAccountEditModel } from "../../shared/page-models/models/user-account/user-account-edit.model.ts";
import { UserAccountProfileModel } from "../../shared/page-models/models/user-account/user-account-profile.model.ts";
import { UserAccountRegisterModel } from "../../shared/page-models/models/user-account/user-account-register.model.ts";
import { UserAccountsListModel } from "../../shared/page-models/models/user-account/user-accounts-list.model.ts";
import { InstitutionsListModel } from "../../shared/page-models/models/institution/institutions-list.model.ts";
import { CertificatesListModel } from "../../shared/page-models/models/certificate/certificates-list.model.ts";
import { ConnectionConfigurationCreateModel } from "../../shared/page-models/models/connection-configuration/connection-configuration-create.model.ts";
import { ConnectionConfigurationEditModel } from "../../shared/page-models/models/connection-configuration/connection-configuration-edit.model.ts";
import { ConnectionConfigurationsListModel } from "../../shared/page-models/models/connection-configuration/connection-configurations-list.model.ts";
import { AssessmentToolCreateModel } from "../../shared/page-models/models/assessment-tool/assessment-tool-create.model.ts";
import { AssessmentToolEditModel } from "../../shared/page-models/models/assessment-tool/assessment-tool-edit.model.ts";
import { AssessmentToolsListModel } from "../../shared/page-models/models/assessment-tool/assessment-tools-list.model.ts";
import { ExamsListModel } from "../../shared/page-models/models/exam/exams-list.model.ts";
import { MonitoringListModel } from "../../shared/page-models/models/monitoring/monitoring-list.model.ts";
import { AnalyzeListModel } from "../../shared/page-models/models/analyze/analyze-list.model.ts";
import { ArchiveListModel } from "../../shared/page-models/models/archive/archive-list.model.ts";
import { loginAsServerAdmin } from "../../utils/authenticate.ts";
import { installMockBackend } from "../mocks/mock-backend.ts";
import { NotFoundPageModel } from "../../shared/page-models/layout/not-found-page.model.ts";
import { ProfileMenuModel } from "../../shared/page-models/layout/profile-menu.model.ts";
import { ExamTemplateModel } from "../../shared/page-models/models/exam-template/exam-template.model.ts";
import { ExamTemplateListModel } from "../../shared/page-models/models/exam-template/exam-template-list.model.ts";

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
    monitoringExams: MonitoringListModel;
    analyzeExams: AnalyzeListModel;
    archiveExams: ArchiveListModel;

    examTemplates: ExamTemplateListModel;
    examTemplate: ExamTemplateModel;
};

export const test = base.extend<Fixtures>({
    userAccounts: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new UserAccountsListModel(page));
    },
    userAccountCreate: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new UserAccountCreateModel(page));
    },
    userAccountEdit: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new UserAccountEditModel(page));
    },
    userAccountRegister: async ({ page }, use, testInfo) => {
        // Register is a public page; it must work without authentication.
        await installMockBackend(page, testInfo.project.name);
        await use(new UserAccountRegisterModel(page));
    },
    userAccountProfile: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new UserAccountProfileModel(page));
    },
    profileMenu: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new ProfileMenuModel(page));
    },
    notFoundPage: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new NotFoundPageModel(page));
    },
    institutions: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new InstitutionsListModel(page));
    },
    connectionConfigurations: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new ConnectionConfigurationsListModel(page));
    },
    connectionConfigurationCreate: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new ConnectionConfigurationCreateModel(page));
    },
    connectionConfigurationEdit: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new ConnectionConfigurationEditModel(page));
    },
    certificates: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new CertificatesListModel(page));
    },
    assessmentTools: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new AssessmentToolsListModel(page));
    },
    assessmentToolCreate: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new AssessmentToolCreateModel(page));
    },
    assessmentToolEdit: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new AssessmentToolEditModel(page));
    },
    exams: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new ExamsListModel(page));
    },
    monitoringExams: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new MonitoringListModel(page));
    },
    analyzeExams: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new AnalyzeListModel(page));
    },
    archiveExams: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new ArchiveListModel(page));
    },

    examTemplates: async ({ page }, use, testInfo) => {
        await installMockBackend(page, testInfo.project.name);
        await loginAsServerAdmin(page);
        await use(new ExamTemplateListModel(page));
    },
});

export { expect } from "@playwright/test";
