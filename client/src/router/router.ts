import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from "vue-router";
import * as constants from "@/utils/constants";
import * as spConstants from "@/utils/sp-constants";
import i18n from "@/i18n";

const defaultPageTitle: string = " | SEB Server";

const routes: Array<RouteRecordRaw> = [
    // ---------- public routes ----------
    {
        path: constants.DEFAULT_ROUTE,
        name: "LoginPage",
        component: () => import("@/components/views/login/LoginPage.vue"),
        meta: { requiresAuth: false },
    },
    {
        path: constants.REGISTER_ROUTE,
        name: "RegisterPage",
        component: () => import("@/components/views/RegisterPage.vue"),
        meta: { requiresAuth: false },
    },

    // ---------- app (authenticated) routes ----------
    {
        path: constants.DEFAULT_ROUTE,
        component: () => import("@/components/layout/ContainerLayout.vue"),
        meta: { requiresAuth: true },
        children: [
            // home
            {
                path: constants.HOME_PAGE_ROUTE,
                name: "HomePage",
                component: () =>
                    import(
                        "@/components/views/seb-server/home/HomePageContainer.vue"
                    ),
                meta: { titleKey: "titles.home" },
            },
            // navigation overview
            {
                path: constants.NAVIGATION_OVERVIEW_ROUTE,
                name: "NavigationOverview",
                component: () =>
                    import("@/components/layout/NavigationOverview.vue"),
                meta: { titleKey: "titles.navigationOverview" },
            },

            // ---------- exam routes ----------
            {
                path: constants.EXAM_ROUTE,
                name: "Exams",
                component: () =>
                    import(
                        "@/components/views/seb-server/exam/list/ExamListContainer.vue"
                    ),
                meta: { titleKey: "titles.exams" },
            },
            {
                path: constants.EXAM_DETAILS_ROUTE + "/:examId",
                name: "ExamDetail",
                component: () =>
                    import(
                        "@/components/views/seb-server/exam/detail/ExamDetailContainer.vue"
                    ),
                meta: { titleKey: "titles.examDetails" },
            },

            // ---------- import quiz routes ----------
            {
                path: constants.QUIZ_IMPORT_ROUTE,
                name: "QuizImport",
                component: () =>
                    import(
                        "@/components/views/seb-server/quiz-import/ImportWizard.vue"
                    ),
                meta: { titleKey: "titles.quizImport" },
            },

            // ---------- monitoring routes ----------
            {
                path: constants.MONITORING_ROUTE,
                name: "Monitoring",
                component: () =>
                    import(
                        "@/components/views/seb-server/monitoring/exams/MonitoringExamsContainer.vue"
                    ),
                meta: { titleKey: "titles.monitoring" },
            },
            {
                path: constants.MONITORING_OVERVIEW_ROUTE + "/:examId",
                name: "MonitoringOverview",
                component: () =>
                    import(
                        "@/components/views/seb-server/monitoring/overview/MonitoringOverviewContainer.vue"
                    ),
                meta: { titleKey: "titles.monitoring" },
            },
            {
                path: constants.MONITORING_CLIENTS_ROUTE + "/:examId",
                name: "MonitoringClients",
                component: () =>
                    import(
                        "@/components/views/seb-server/monitoring/clients/MonitoringClientsContainer.vue"
                    ),
                meta: { titleKey: "titles.monitoring" },
            },
            {
                path: constants.MONITORING_DETAILS_ROUTE + "/:connectionToken",
                name: "MonitoringDetails",
                component: () =>
                    import(
                        "@/components/views/seb-server/monitoring/client-detail/MonitoringDetailsContainer.vue"
                    ),
                meta: { titleKey: "titles.monitoring" },
            },

            // ---------- user accounts routes ----------
            {
                path: constants.USER_ACCOUNTS_ROUTE + "/:userId",
                name: "ProfileRoute",
                component: () =>
                    import(
                        "@/components/views/seb-server/accounts/UserAccountEditForm.vue"
                    ),
                meta: { titleKey: "titles.userAccounts" },
            },
            {
                path: constants.PROFILE_ROUTE,
                name: "ProfileRoute",
                component: () =>
                    import(
                        "@/components/views/seb-server/accounts/ProfilePage.vue"
                    ),
                meta: { titleKey: "titles.profile" },
            },
            {
                path: constants.EDIT_USER_ACCOUNT + "/:userUuid",
                name: "EditUserAccount",
                component: () =>
                    import(
                        "@/components/views/seb-server/accounts/EditUserAccount.vue"
                    ),
                meta: { titleKey: "titles.editUserAccount" },
            },
            {
                path: constants.USER_ACCOUNTS_ROUTE,
                name: "UserAccounts",
                component: () =>
                    import(
                        "@/components/views/seb-server/accounts/UserAccounts.vue"
                    ),
                meta: { titleKey: "titles.userAccounts" },
            },
            {
                path: constants.CREATE_USER_ACCOUNTS_ROUTE,
                name: "CreateUserAccount",
                component: () =>
                    import(
                        "@/components/views/seb-server/accounts/CreateUserAccount.vue"
                    ),
                meta: { titleKey: "titles.createUserAccount" },
            },

            // ---------- assessment tools ----------
            {
                path: constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE,
                name: "AssessmentToolConnections",
                component: () =>
                    import(
                        "@/components/views/seb-server/assessment-tool/AssessmentTools.vue"
                    ),
                meta: { titleKey: "titles.assessmentToolConnections" },
            },
            {
                path: constants.CREATE_ASSESSMENT_TOOL_CONNECTION_ROUTE,
                name: "CreateAssessmentToolConnection",
                component: () =>
                    import(
                        "@/components/views/seb-server/assessment-tool/CreateAssessmentTool.vue"
                    ),
                meta: { titleKey: "titles.createAssessmentTool" },
            },
            {
                path: constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE + "/:lmsId",
                name: "AssessmentToolDetailAndView",
                component: () =>
                    import(
                        "@/components/views/seb-server/assessment-tool/AssessmentToolDetailsAndEdit.vue"
                    ),
                meta: { titleKey: "titles.assessmentToolEdit" },
            },

            // ---------- connection configuration ----------
            {
                path: constants.CONNECTION_CONFIGURATIONS_ROUTE,
                name: "ConnectionConfigurations",
                component: () =>
                    import(
                        "@/components/views/seb-server/connection-configuration/ConnectionConfigurations.vue"
                    ),
                meta: { titleKey: "titles.connectionConfigurations" },
            },
            {
                path: constants.CREATE_CONNECTION_CONFIGURATION_ROUTE,
                name: "CreateConnectionConfiguration",
                component: () =>
                    import(
                        "@/components/views/seb-server/connection-configuration/CreateConnectionConfiguration.vue"
                    ),
                meta: { titleKey: "titles.createConnectionConfiguration" },
            },
            {
                path: constants.CONNECTION_CONFIGURATIONS_ROUTE + "/:id",
                name: "ConnectionConfigurationDetailAndView",
                component: () =>
                    import(
                        "@/components/views/seb-server/connection-configuration/ConnectionConfigurationlDetailsAndEdit.vue"
                    ),
                meta: { titleKey: "titles.connectionConfigurationViewAndEdit" },
            },

            // ---------- certificates ----------
            {
                path: constants.CERTIFICATES_ROUTE,
                name: "Certificates",
                component: () =>
                    import(
                        "@/components/views/seb-server/certificates/CertificatesMain.vue"
                    ),
                meta: { titleKey: "titles.certificates" },
            },

            // ---------- templates ----------
            {
                path: constants.CREATE_TEMPLATE_ROUTE,
                name: "CreateTemplate",
                component: () =>
                    import(
                        "@/components/views/seb-server/template/CreateTemplate.vue"
                    ),
                meta: { titleKey: "titles.createTemplate" },
            },
            {
                path: constants.CREATE_EXAM_TEMPLATE_ROUTE,
                name: "CreateExamTemplateWizard",
                component: () =>
                    import(
                        "@/components/views/seb-server/template/exam/CreateExamTemplateWizard.vue"
                    ),
                meta: { titleKey: "titles.createTemplateExam" },
            },
        ],
    },

    // ---------- screen-proctoring (authenticated) routes ----------
    {
        path: spConstants.DEFAULT_ROUTE,
        component: () => import("@/components/layout/ContainerLayout.vue"),
        meta: { requiresAuth: true },
        children: [
            {
                path: spConstants.RUNNING_EXAMS_ROUTE,
                name: "ExamsOverview",
                component: () =>
                    import(
                        "@/components/views/screen-proctoring/exams-overview/ExamsOverviewPage.vue"
                    ),
                meta: { title: "Running Exams" + defaultPageTitle },
            },
            {
                path: spConstants.SEARCH_ROUTE,
                name: "Search",
                component: () =>
                    import(
                        "@/components/views/screen-proctoring/search/SearchPage.vue"
                    ),
                meta: { title: "Search" + defaultPageTitle },
            },
            {
                path: spConstants.APPLICATIONS_ROUTE,
                name: "Applications",
                component: () =>
                    import(
                        "@/components/views/screen-proctoring/applications-search/ApplicationsSearchViewPage.vue"
                    ),
                meta: { title: "Applications" + defaultPageTitle },
            },
            {
                path:
                    spConstants.GALLERY_VIEW_ROUTE +
                    "/:uuid" +
                    spConstants.EXAM_ID +
                    "/:examId",
                name: "GalleryViewPage",
                component: () =>
                    import(
                        "@/components/views/screen-proctoring/gallery/GalleryViewPage.vue"
                    ),
                meta: { title: "Gallery View" + defaultPageTitle },
            },
            {
                path: spConstants.PROCTORING_VIEW_ROUTE + "/:sessionId",
                name: "ProctoringViewPage",
                component: () =>
                    import(
                        "@/components/views/screen-proctoring/proctoring/ProctoringViewPage.vue"
                    ),
                meta: { title: "Proctoring" + defaultPageTitle },
            },
            {
                path:
                    spConstants.PROCTORING_APPLICATION_SEARCH_ROUTE +
                    "/:sessionId",
                name: "ProctoringApplicationSearchPage",
                component: () =>
                    import(
                        "@/components/views/screen-proctoring/proctoring/ProctoringApplicationSearchPage.vue"
                    ),
                meta: { title: "Proctoring" + defaultPageTitle },
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
        // Lazy-load to avoid top-level import and potential cycles
        const userAccountViewService = await import(
            "@/services/seb-server/component-services/userAccountViewService"
        );
        await userAccountViewService.setPersonalUserAccount();
    }

    const defaultTitle: string = "SEB Server";
    const titleKey = to.meta.titleKey as string | undefined;

    if (titleKey) {
        document.title = i18n.global.t(titleKey) + defaultPageTitle;
    } else {
        document.title = defaultTitle;
    }
});

export default router;
