import type { Preview } from "@storybook/vue3";
import { setup } from "@storybook/vue3";

import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import { createRouter, createWebHistory } from "vue-router";
import AlertMsg from "@/components/widgets/AlertMsg.vue";
import { VApp, VMain } from "vuetify/components";
import "@mdi/font/css/materialdesignicons.css";

import i18n from "@/i18n";

const router = createRouter({
    history: createWebHistory(),
    routes: [], // add demo routes if your components navigate
});

const vuetify = createVuetify();

setup((app) => {
    app.use(createPinia());
    app.use(vuetify);
    app.use(router);
    app.use(i18n);

    app.component("AlertMsg", AlertMsg);
});

const preview: Preview = {
    parameters: {
        controls: {
            matchers: { color: /(background|color)$/i, date: /Date$/i },
        },
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
