import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router"
import ContainerLayout from "@/components/layout/ContainerLayout.vue"
import LoginPage from "@/components/views/LoginPage.vue"
import RegisterPage from "@/components/views/RegisterPage.vue"
import StartPage from "@/components/views/StartPage.vue"
import * as constants from "@/utils/constants";

const defaultPageTitle: string = " | SEB Screen Proctoring";
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
        path: constants.START_PAGE_ROUTE,
        name: "StartPage",
        component: StartPage,
        meta: {
            title: "Start Page" + defaultPageTitle
        }
      },

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