import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from "vue-router";
import * as constants from "@/utils/constants";
import * as spConstants from "@/utils/sp-constants";
import { getRouteName } from "@/router/routeNames";
import i18n from "@/i18n";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import { UserAccount } from "@/models/userAccount.ts";
import * as userAccountService from "@/services/seb-server/userAccountService.ts";

const defaultPageTitle: string = " | SEB Server";

const routes: Array<RouteRecordRaw> = [
    // ---------- public routes ----------
    {
        path: "/",
        name: getRouteName("LoginPage"),
        component: () => import("@/components/views/login/LoginPage.vue"),
        meta: { requiresAuth: false },
    },
    {
        path: "/register",
        name: getRouteName("RegisterPage"),
        component: () => import("@/components/views/RegisterPage.vue"),
        meta: { requiresAuth: false },
    },

    // ---------- app (authenticated) routes ----------
    {
        path: "/",
        component: () => import("@/components/layout/ContainerLayout.vue"),
        meta: { requiresAuth: true },
        children: [
            // home
            {
                path: "/home",
                name: getRouteName("HomePage"),
                component: () =>
                    import(
                        "@/components/views/seb-server/home/HomePageContainer.vue"
                    ),
                meta: { titleKey: "titles.home" },
            },
            // navigation overview
            {
                path: "/navigation-overview",
                name: getRouteName("NavigationOverview"),
                component: () =>
                    import(
                        "@/components/layout/navigationOverview/NavigationOverview.vue"
                    ),
                meta: { titleKey: "titles.navigationOverview" },
            },

            // ---------- exam routes ----------
            {
                path: "/exam",
                name: getRouteName("ExamList"),
                component: () =>
                    import(
                        "@/components/views/seb-server/exam/exams/ExamList.vue"
                    ),
                meta: { titleKey: "titles.exams" },
            },
            {
                path: "/exam/:examId",
                name: getRouteName("ExamDetail"),
                component: () =>
                    import(
                        "@/components/views/seb-server/exam/detail/ExamDetailContainer.vue"
                    ),
                meta: { titleKey: "titles.examDetails" },
            },

            // ---------- import quiz routes ----------
            {
                path: "/quiz-import",
                name: getRouteName("QuizImport"),
                component: () =>
                    import(
                        "@/components/views/seb-server/quiz-import/ImportWizard.vue"
                    ),
                meta: { titleKey: "titles.quizImport" },
            },

            // ---------- monitoring routes ----------
            {
                path: "/monitoring",
                name: getRouteName("MonitoringList"),
                component: () =>
                    import(
                        "@/components/views/seb-server/monitoring/exams/MonitoringExamList.vue"
                    ),
                meta: { titleKey: "titles.monitoring" },
            },
            {
                path: "/monitoring/overview/:examId",
                name: getRouteName("MonitoringOverview"),
                component: () =>
                    import(
                        "@/components/views/seb-server/monitoring/overview/MonitoringOverviewContainer.vue"
                    ),
                meta: { titleKey: "titles.monitoring" },
            },
            {
                path: "/monitoring/clients/:examId",
                name: getRouteName("MonitoringClients"),
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
                path: "/user-account/profile",
                name: getRouteName("ProfileRoute"),
                component: () =>
                    import(
                        "@/components/views/seb-server/user-account/edit-user-account/ProfilePage.vue"
                    ),
                meta: { titleKey: "titles.profile" },
            },
            {
                path: "/user-account/:userUuid",
                name: getRouteName("EditUserAccount"),
                component: () =>
                    import(
                        "@/components/views/seb-server/user-account/edit-user-account/EditUserAccount.vue"
                    ),
                meta: { titleKey: "titles.editUserAccount" },
            },
            {
                path: "/user-account",
                name: getRouteName("UserAccountList"),
                component: () =>
                    import(
                        "@/components/views/seb-server/user-account/user-accounts/UserAccounts.vue"
                    ),
                meta: { titleKey: "titles.userAccounts" },
            },

            {
                path: "/user-account/create",
                name: getRouteName("CreateUserAccount"),
                component: () =>
                    import(
                        "@/components/views/seb-server/user-account/create-user-account/CreateUserAccount.vue"
                    ),
                meta: { titleKey: "titles.createUserAccount" },
            },

            // ---------- assessment tools ----------
            {
                path: "/assessment-tool",
                name: getRouteName("AssessmentToolList"),
                component: () =>
                    import(
                        "@/components/views/seb-server/assessment-tool/assessment-tools/AssessmentTools.vue"
                    ),
                meta: { titleKey: "titles.assessmentToolConnections" },
            },

            {
                path: "/assessment-tool/create",
                name: getRouteName("CreateAssessmentTool"),
                component: () =>
                    import(
                        "@/components/views/seb-server/assessment-tool/create-assessment-tool/CreateAssessmentTool.vue"
                    ),
                meta: { titleKey: "titles.createAssessmentTool" },
            },
            {
                path: "/assessment-tool-connections/:lmsId",
                name: getRouteName("AssessmentToolDetailAndView"),
                component: () =>
                    import(
                        "@/components/views/seb-server/assessment-tool/AssessmentToolDetailsAndEdit.vue"
                    ),
                meta: { titleKey: "titles.assessmentToolEdit" },
            },

            // ---------- connection configuration ----------
            {
                path: "/connection-configuration",
                name: getRouteName("ConnectionConfigurationList"),
                component: () =>
                    import(
                        "@/components/views/seb-server/connection-configuration/connection-configurations/ConnectionConfigurations.vue"
                    ),
                meta: { titleKey: "titles.connectionConfigurations" },
            },
            {
                path: "/connection-configuration/create",
                name: getRouteName("CreateConnectionConfiguration"),
                component: () =>
                    import(
                        "@/components/views/seb-server/connection-configuration/create-connection-configuration/CreateConnectionConfiguration.vue"
                    ),
                meta: { titleKey: "titles.createConnectionConfiguration" },
            },
            {
                path: "/connection-configurations/:id",
                name: getRouteName("ConnectionConfigurationDetailAndView"),
                component: () =>
                    import(
                        "@/components/views/seb-server/connection-configuration/ConnectionConfigurationlDetailsAndEdit.vue"
                    ),
                meta: { titleKey: "titles.connectionConfigurationViewAndEdit" },
            },

            // ---------- certificates ----------
            {
                path: "/certificate",
                name: getRouteName("CertificatesList"),

                component: () =>
                    import(
                        "@/components/views/seb-server/certificate/certificates/CertificatesList.vue"
                    ),
                meta: { titleKey: "titles.certificates" },
            },

            // ---------- exam templates ----------
            {
                path: "/exam-template",
                name: getRouteName("ExamTemplateList"),
                component: () =>
                    import(
                        "@/components/views/seb-server/exam-template/list/ExamTemplateList.vue"
                    ),
                meta: { titleKey: "titles.examTemplateList" },
            },
            {
                path: "/exam-template/create",
                name: getRouteName("CreateExamTemplateWizard"),
                component: () =>
                    import(
                        "@/components/views/seb-server/exam-template/wizard/CreateExamTemplateWizard.vue"
                    ),
                meta: { titleKey: "titles.createTemplateExam" },
            },
            {
                path: "/exam-template/:examTemplateId",
                name: getRouteName("ExamTemplateDetail"),
                component: () =>
                    import(
                        "@/components/views/seb-server/exam-template/detail/ExamTemplateDetail.vue"
                    ),
                meta: { titleKey: "titles.examTemplateDetail" },
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
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
    if (to.meta.requiresAuth) {
        //Todo @Andrei improve authentication. I highly doubt this is correct

        await setPersonalUserAccount();
    }

    const defaultTitle: string = "SEB Server";
    const titleKey = to.meta.titleKey as string | undefined;

    if (titleKey) {
        document.title = i18n.global.t(titleKey) + defaultPageTitle;
    } else {
        document.title = defaultTitle;
    }
});

async function setPersonalUserAccount() {
    const userAccountStore = useUserAccountStore();

    try {
        if (userAccountStore.userAccount != null) {
            return;
        }

        const personalUserAccountResonse: UserAccount | null =
            await userAccountService.getPersonalUserAccount();
        if (personalUserAccountResonse == null) {
            return;
        }

        userAccountStore.userAccount = personalUserAccountResonse;
    } catch {
        return null;
    }
}

export default router;
