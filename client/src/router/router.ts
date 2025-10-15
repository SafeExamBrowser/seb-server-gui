import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ContainerLayout from "@/components/layout/ContainerLayout.vue";
import LoginPage from "@/components/views/LoginPage.vue";
import RegisterPage from "@/components/views/RegisterPage.vue";
import UserAccounts from "@/components/views/seb-server/accounts/UserAccounts.vue";
import ExamListContainer from "@/components/views/seb-server/exam/list/ExamListContainer.vue";
import ExamDetailContainer from "@/components/views/seb-server/exam/detail/ExamDetailContainer.vue";
import * as constants from "@/utils/constants";
import NavigationOverview from "@/components/layout/NavigationOverview.vue";
import ImportWizard from "@/components/views/seb-server/quiz-import/ImportWizard.vue";
import i18n from "@/i18n";
import MonitoringExamsContainer from "@/components/views/seb-server/monitoring/exams/MonitoringExamsContainer.vue";
import MonitoringClientsContainer from "@/components/views/seb-server/monitoring/clients/MonitoringClientsContainer.vue";
import MonitoringOverviewContainer from "@/components/views/seb-server/monitoring/overview/MonitoringOverviewContainer.vue";
import * as authenticationService from "@/services/authenticationService";
import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
import MonitoringDetailsContainer from "@/components/views/seb-server/monitoring/client-detail/MonitoringDetailsContainer.vue";
import UserAccountEditForm from "@/components/views/seb-server/accounts/UserAccountEditForm.vue";
import CreateUserAccount from "@/components/views/seb-server/accounts/CreateUserAccount.vue";
import ProfilePage from "@/components/views/seb-server/accounts/ProfilePage.vue";
import EditUserAccount from "@/components/views/seb-server/accounts/EditUserAccount.vue";

// ----------screen-proctoring ---------
import * as spConstants from "@/utils/sp-constants";
import GalleryViewPage from "@/components/views/screen-proctoring/gallery/GalleryViewPage.vue";
import ApplicationsSearchViewPage from "@/components/views/screen-proctoring/applications-search/ApplicationsSearchViewPage.vue";
import ProctoringViewPage from "@/components/views/screen-proctoring/proctoring/ProctoringViewPage.vue";
import ProctoringApplicationSearchPage from "@/components/views/screen-proctoring/proctoring/ProctoringApplicationSearchPage.vue";
import ExamsOverviewPage from "@/components/views/screen-proctoring/exams-overview/ExamsOverviewPage.vue";
import SearchPage from "@/components/views/screen-proctoring/search/SearchPage.vue";

import { useAuthStore } from "@/stores/authentication/authenticationStore";
import HomePageContainer from "@/components/views/seb-server/home/HomePageContainer.vue";
import AssessmentTools from "@/components/views/seb-server/assessment-tool/AssessmentTools.vue";
import CreateAssessmentTool from "@/components/views/seb-server/assessment-tool/CreateAssessmentTool.vue";
import AssessmentToolDetailsAndEdit from "@/components/views/seb-server/assessment-tool/AssessmentToolDetailsAndEdit.vue";

import CreateConnectionConfiguration from "@/components/views/seb-server/connection-configuration/CreateConnectionConfiguration.vue";
import ConnectionConfigurations from "@/components/views/seb-server/connection-configuration/ConnectionConfigurations.vue";
import ConnectionConfigurationlDetailsAndEdit from "@/components/views/seb-server/connection-configuration/ConnectionConfigurationlDetailsAndEdit.vue";
import CertificatesMain from "@/components/views/seb-server/certificates/CertificatesMain.vue";

import CreateTemplate from "@/components/views/seb-server/template/CreateTemplate.vue";
import { JwtTokenResponse } from "@/models/tokenModel";
import CreateExamTemplateWizard from "@/components/views/seb-server/template/exam/CreateExamTemplateWizard.vue";

const defaultPageTitle: string = " | SEB Server";

const routes: Array<RouteRecordRaw> = [
    {
        path: constants.DEFAULT_ROUTE,
        name: "LoginPage",
        component: LoginPage,
        meta: { requiresAuth: false },
    },
    {
        path: constants.REGISTER_ROUTE,
        name: "RegisterPage",
        component: RegisterPage,
        meta: { requiresAuth: false },
    },
    {
        path: spConstants.JWT_LOGIN_ROUTE,
        meta: { requiresAuth: false },
        beforeEnter: async (to) => {
            const authStore = useAuthStore();

            if (to.query.token != null) {
                try {
                    const tokenObject: JwtTokenResponse =
                        await authenticationService.verifyJwt(
                            to.query.token.toString(),
                        );
                    authStore.loginWithJwt(
                        tokenObject.login.access_token,
                        tokenObject.login.refresh_token,
                        tokenObject.redirect,
                    );
                    return;
                } catch {
                    return true;
                }
            }

            // true means redirecting to Login Page
            return true;
        },
        component: LoginPage,
    },
    {
        path: constants.DEFAULT_ROUTE,
        component: ContainerLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: constants.HOME_PAGE_ROUTE,
                name: "HomePage",
                component: HomePageContainer,
                meta: {
                    titleKey: "titles.home",
                },
            },
            {
                path: constants.NAVIGATION_OVERVIEW_ROUTE,
                name: "NavigationOverview",
                component: NavigationOverview,
                meta: {
                    titleKey: "titles.navigationOverview",
                },
            },

            // ----------exam routes---------
            {
                path: constants.EXAM_ROUTE,
                name: "Exams",
                component: ExamListContainer,
                meta: {
                    titleKey: "titles.exams",
                },
            },
            {
                path: constants.EXAM_DETAILS_ROUTE + "/:examId",
                name: "ExamDetail",
                component: ExamDetailContainer,
                meta: {
                    titleKey: "titles.examDetails",
                },
            },

            // ----------import quiz routes---------
            {
                path: constants.QUIZ_IMPORT_ROUTE,
                name: "QuizImport",
                component: ImportWizard,
                meta: {
                    titleKey: "titles.quizImport",
                },
            },

            // ----------monitoring routes---------
            {
                path: constants.MONITORING_ROUTE,
                name: "Monitoring",
                component: MonitoringExamsContainer,
                meta: {
                    titleKey: "titles.monitoring",
                },
            },
            {
                path: constants.MONITORING_OVERVIEW_ROUTE + "/:examId",
                name: "MonitoringOverview",
                component: MonitoringOverviewContainer,
                meta: {
                    titleKey: "titles.monitoring",
                },
            },
            {
                path: constants.MONITORING_CLIENTS_ROUTE + "/:examId",
                name: "MonitoringClients",
                component: MonitoringClientsContainer,
                meta: {
                    titleKey: "titles.monitoring",
                },
            },
            {
                path: constants.MONITORING_DETAILS_ROUTE + "/:connectionToken",
                name: "MonitoringDetails",
                component: MonitoringDetailsContainer,
                meta: {
                    titleKey: "titles.monitoring",
                },
            },
            // ----------user accounts routes---------
            {
                path: constants.USER_ACCOUNTS_ROUTE + "/:userId",
                name: "ProfileRoute",
                component: UserAccountEditForm,
                meta: {
                    titleKey: "titles.userAccounts",
                },
            },
            {
                path: constants.PROFILE_ROUTE,
                name: "ProfileRoute",
                component: ProfilePage,
                meta: {
                    titleKey: "titles.profile",
                },
            },
            {
                path: constants.EDIT_USER_ACCOUNT + "/:userUuid",
                name: "EditUserAccount",
                component: EditUserAccount,
                meta: {
                    titleKey: "titles.editUserAccount",
                },
            },
            {
                path: constants.USER_ACCOUNTS_ROUTE,
                name: "UserAccounts",
                component: UserAccounts,
                meta: {
                    titleKey: "titles.userAccounts",
                },
            },
            {
                path: constants.CREATE_USER_ACCOUNTS_ROUTE,
                name: "CreateUserAccount",
                component: CreateUserAccount,
                meta: {
                    titleKey: "titles.createUserAccount",
                },
            },

            // assessment tools
            {
                path: constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE,
                name: "AssessmentToolConnections",
                component: AssessmentTools,
                meta: {
                    titleKey: "titles.assessmentToolConnections",
                },
            },

            {
                path: constants.CREATE_ASSESSMENT_TOOL_CONNECTION_ROUTE,
                name: "CreateAssessmentToolConnection",
                component: CreateAssessmentTool,
                meta: {
                    titleKey: "titles.createAssessmentTool",
                },
            },
            {
                path: constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE + "/:lmsId",
                name: "AssessmentToolDetailAndView",
                component: AssessmentToolDetailsAndEdit,
                meta: {
                    titleKey: "titles.assessmentToolEdit",
                },
            },

            // connection configuration
            {
                path: constants.CONNECTION_CONFIGURATIONS_ROUTE,
                name: "ConnectionConfigurations",
                component: ConnectionConfigurations,
                meta: {
                    titleKey: "titles.connectionConfigurations",
                },
            },

            {
                path: constants.CREATE_CONNECTION_CONFIGURATION_ROUTE,
                name: "CreateConnectionConfiguration",
                component: CreateConnectionConfiguration,
                meta: {
                    titleKey: "titles.createConnectionConfiguration",
                },
            },
            {
                path: constants.CONNECTION_CONFIGURATIONS_ROUTE + "/:id",
                name: "ConnectionConfigurationDetailAndView",
                component: ConnectionConfigurationlDetailsAndEdit,
                meta: {
                    titleKey: "titles.connectionConfigurationViewAndEdit",
                },
            },

            // certificates
            {
                path: constants.CERTIFICATES_ROUTE,
                name: "Certificates",
                component: CertificatesMain,
                meta: {
                    titleKey: "titles.certificates",
                },
            },

            // templates
            {
                path: constants.CREATE_TEMPLATE_ROUTE,
                name: "CreateTemplate",
                component: CreateTemplate,
                meta: {
                    titleKey: "titles.createTemplate",
                },
            },
            {
                path: constants.CREATE_EXAM_TEMPLATE_ROUTE,
                name: "CreateExamTemplateWizard",
                component: CreateExamTemplateWizard,
                meta: {
                    titleKey: "titles.createTemplateExam",
                },
            },
        ],
    },

    // ----------screen-proctoring routes---------
    {
        path: spConstants.DEFAULT_ROUTE,
        component: ContainerLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: spConstants.RUNNING_EXAMS_ROUTE,
                name: "ExamsOverview",
                component: ExamsOverviewPage,
                meta: {
                    title: "Running Exams" + defaultPageTitle,
                },
            },
            {
                path: spConstants.SEARCH_ROUTE,
                name: "Search",
                component: SearchPage,
                meta: {
                    title: "Search" + defaultPageTitle,
                },
            },
            {
                path: spConstants.APPLICATIONS_ROUTE,
                name: "Applications",
                component: ApplicationsSearchViewPage,
                meta: {
                    title: "Applications" + defaultPageTitle,
                },
            },
            {
                path:
                    spConstants.GALLERY_VIEW_ROUTE +
                    "/:uuid" +
                    spConstants.EXAM_ID +
                    "/:examId",
                name: "GalleryViewPage",
                component: GalleryViewPage,
                meta: {
                    title: "Gallery View" + defaultPageTitle,
                },
            },
            {
                path: spConstants.PROCTORING_VIEW_ROUTE + "/:sessionId",
                name: "ProctoringViewPage",
                component: ProctoringViewPage,
                meta: {
                    title: "Proctoring" + defaultPageTitle,
                },
            },
            {
                path:
                    spConstants.PROCTORING_APPLICATION_SEARCH_ROUTE +
                    "/:sessionId",
                name: "ProctoringApplicationSearchPage",
                component: ProctoringApplicationSearchPage,
                meta: {
                    title: "Proctoring" + defaultPageTitle,
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_SUB_PATH || ""),
    routes,
});

router.beforeEach(async (to) => {
    if (to.meta.requiresAuth) {
        await userAccountViewService.setPersonalUserAccount();
    }

    const defaultTitle: string = "SEB Server";

    // get title key from route meta
    const titleKey = to.meta.titleKey as string | undefined;

    // if title key exists, translate it and add the default suffix
    if (titleKey) {
        document.title = i18n.global.t(titleKey) + defaultPageTitle;
    } else {
        document.title = defaultTitle;
    }
});

export default router;
