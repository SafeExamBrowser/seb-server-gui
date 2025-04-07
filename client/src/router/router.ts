import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";
import ContainerLayout from "@/components/layout/ContainerLayout.vue";
import LoginPage from "@/components/views/LoginPage.vue";
import RegisterPage from "@/components/views/RegisterPage.vue";
import HomePage from "@/components/views/home/HomePage.vue";
import ExamListContainer from "@/components/views/exam/list/ExamListContainer.vue";
import ExamDetailContainer from "@/components/views/exam/detail/ExamDetailContainer.vue";
import * as constants from "@/utils/constants";
import NavigationOverview from "@/components/layout/NavigationOverview.vue";
import ImportWizard from "@/components/views/quiz-import/ImportWizard.vue";
import i18n from "@/i18n";
import MonitoringExamsContainer from "@/components/views/monitoring/exams/MonitoringExamsContainer.vue";
import MonitoringClientsContainer from "@/components/views/monitoring/clients/MonitoringClientsContainer.vue";
import MonitoringOverviewContainer from "@/components/views/monitoring/overview/MonitoringOverviewContainer.vue";

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
        path: constants.DEFAULT_ROUTE,
        component: ContainerLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: constants.HOME_PAGE_ROUTE,
                name: "HomePage",
                component: HomePage,
                meta: {
                    titleKey: "titles.home"
                }
            },
            {
                path: constants.NAVIGATION_OVERVIEW_ROUTE,
                name: "NavigationOverview",
                component: NavigationOverview,
                meta: {
                    titleKey: "titles.navigationOverview"
                }
            },

            //----------exam routes---------
            {
                path: constants.EXAM_ROUTE,
                name: "Exams",
                component: ExamListContainer,
                meta: {
                    titleKey: "titles.exams"
                },
            },
            {
                path: constants.EXAM_DETAILS_ROUTE + "/:examId",
                name: "ExamDetail",
                component: ExamDetailContainer,
                meta: {
                    titleKey: "titles.examDetails"
                },
            },

            //----------import quiz routes---------
            {
                path: constants.QUIZ_IMPORT_ROUTE,
                name: "QuizImport",
                component: ImportWizard,
                meta: {
                    titleKey: "titles.quizImport"
                }
            },

            //----------monitoring routes---------
            {
                path: constants.MONITORING_ROUTE,
                name: "Monitoring",
                component: MonitoringExamsContainer,
                meta: {
                    titleKey: "titles.monitoring"
                },
            },
            {
                path: constants.MONITORING_OVERVIEW_ROUTE + "/:examId",
                name: "MonitoringOverview",
                component: MonitoringOverviewContainer,
                meta: {
                    titleKey: "titles.monitoring"
                },
            },
            {
                path: constants.MONITORING_CLIENTS_ROUTE + "/:examId",
                name: "MonitoringClients",
                component: MonitoringClientsContainer,
                meta: {
                    titleKey: "titles.monitoring"
                },
            },

        ]
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_SUB_PATH || ""),
    routes
});

router.beforeEach(async (to) => {
    const defaultTitle: string = "SEB Server";

    //get title key from route meta
    const titleKey = to.meta.titleKey as string | undefined;

    //if title key exists, translate it and add the default suffix
    if (titleKey) {
        document.title = i18n.global.t(titleKey) + defaultPageTitle;
    } else {
        document.title = defaultTitle;
    }
});

export default router;