import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router"
import ContainerLayout from "@/components/layout/ContainerLayout.vue"
import LoginPage from "@/components/views/LoginPage.vue"
import RegisterPage from "@/components/views/RegisterPage.vue"
import HomePage from "@/components/views/home/HomePage.vue"
import ExamsHome from "@/components/views/exam/ExamsHome.vue"
import ExamLmsImport from "@/components/views/exam/ExamLmsImport.vue"
import * as constants from "@/utils/constants";

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
        //----------exam routes---------
        {
            path: constants.EXAM_ROUTE,
            name: "Exams",
            component: ExamsHome,
            meta: {
                title: constants.EXAMS_TITLE + defaultPageTitle
            },
        },
        {
            path: constants.EXAM_LMS_IMPORT_ROUTE,
            name: "ExamLmsImport",
            component: ExamLmsImport,
            meta: {
                title: constants.EXAMS_LMS_IMPORT_TITLE + defaultPageTitle
            },
        }
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