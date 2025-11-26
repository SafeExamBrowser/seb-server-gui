import type { Preview } from "@storybook/vue3";
import { setup } from "@storybook/vue3";

import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import { createMemoryHistory, createRouter } from "vue-router";
import AlertMsg from "@/components/widgets/AlertMsg.vue";
import { VApp, VMain } from "vuetify/components";
import "@mdi/font/css/materialdesignicons.css";

import i18n from "@/i18n";

const router = createRouter({
    history: createMemoryHistory(),
    routes: [],
});

router.beforeEach((to, from, next) => {
    console.warn("[Storybook] Blocked navigation to:", to.fullPath);
    next(false);
});

const vuetify = createVuetify();

setup((app) => {
    app.use(createPinia());
    app.use(vuetify);
    app.use(router);
    app.use(i18n);

    app.component("AlertMsg", AlertMsg);

    app.config.globalProperties.$apiBaseUrl = "";
});

const preview: Preview = {
    parameters: {
        controls: {
            matchers: { color: /(background|color)$/i, date: /Date$/i },
        },
        actions: { argTypesRegex: "^on[A-Z].*" },
    },
    decorators: [
        (story, context) => {
            const StoryComponent = story();
            return {
                components: { StoryComponent, VApp, VMain },
                setup() {
                    return { args: context.args };
                },
                template: `
                    <v-app>
                        <v-main>
                            <StoryComponent v-bind="args" />
                        </v-main>
                    </v-app>
                `,
            };
        },
    ],
};

export default preview;
