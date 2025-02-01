import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router"
import ContainerLayout from "@/components/layout/ContainerLayout.vue"
import LoginPage from "@/components/views/LoginPage.vue"
import RegisterPage from "@/components/views/RegisterPage.vue"
import HomePage from "@/components/views/home/HomePage.vue"
import ExamsMain from "@/components/views/exam/ExamsMain.vue"
import ExamLmsImport from "@/components/views/exam/ExamLmsImport.vue"
import * as constants from "@/utils/constants";
import MonitoringMain from "@/components/views/monitoring/MonitoringMain.vue"
import NavigationOverview from "@/components/layout/NavigationOverview.vue"
import QuizImportWizard from "@/components/views/quiz-import/QuizImportWizard.vue"
import ExamDetail from "@/components/views/exam/ExamDetail.vue"

const defaultPageTitle: string = " | SEB Server";
const routes: Array<RouteRecordRaw> = [
  {
    path: constants.DEFAULT_ROUTE,
    name: "LoginPage",
    component: LoginPage,
    meta: {requiresAuth: false},
  },
  {
    path: constants.REGISTER_ROUTE,
    name: "RegisterPage",
    component: RegisterPage,
    meta: {requiresAuth: false},
  },
  {
    path: constants.DEFAULT_ROUTE,
    component: ContainerLayout,
    meta: {requiresAuth: true},
    children: [
        {
            path: constants.HOME_PAGE_ROUTE,
            name: "HomePage",
            component: HomePage,
            meta: {
                title: constants.HOME_PAGE_TITLE + defaultPageTitle
            }
        },
        {
            path: constants.NAVIGATION_OVERVIEW_ROUTE,
            name: "NavigationOverview",
            component: NavigationOverview,
            meta: {
                title: constants.NAVIGATION_OVERVIEW_TITLE + defaultPageTitle
            }
        },

        //----------exam routes---------
        {
            path: constants.EXAM_ROUTE,
            name: "Exams",
            component: ExamsMain,
            meta: {
                title: constants.EXAMS_TITLE + defaultPageTitle
            },
        },
        {
            path: constants.EXAM_ROUTE + "/:examId",
            name: "ExamDetail",
            component: ExamDetail,
            meta: {
                title: constants.EXAMS_DETAIL_TITLE + defaultPageTitle
            },
        },
        //------------------------------

        //----------import quiz routes---------
        {
            path: constants.QUIZ_IMPORT_ROUTE,
            name: "QuizImport",
            component: QuizImportWizard,
            meta: {
                title: constants.QUIZ_IMPORT_TITLE + defaultPageTitle
            },
            beforeEnter(){
                // console.log("test");
            }
        },
        //------------------------------

        //----------monitoring routes---------
        {
            path: constants.MONITORING_ROUTE,
            name: "Monitoring",
            component: MonitoringMain,
            meta: {
                title: constants.MONITORING_TITLE + defaultPageTitle
            },
        },
        //------------------------------


    ]
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
    if(to.meta.requiresAuth){
        // await userAccountViewService.setPersonalUserAccount();
    }

    const defaultTitle: string = "SEB Server";
    //@ts-ignore
    document.title = to.meta.title || defaultTitle;
});

export default router;