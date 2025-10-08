import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "@/plugins";
import AlertMsg from "@/components/widgets/AlertMsg.vue";
import i18n from "./i18n";

// 🚀 Vuetify setup
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createRulesPlugin } from "vuetify/labs/rules";

import vuetify from "@/plugins/vuetify";

const app = createApp(App);
app.use(vuetify);
registerPlugins(app);
app.use(i18n);

app.use(
    createRulesPlugin(
        {
            aliases: {
                blacklisted: (blacklistedValues: Set<string>, err?: string) => {
                    return (v: string) =>
                        !blacklistedValues.has(v) ||
                        err ||
                        i18n.global.t("general.validation.blacklisted", {
                            values: Array.from(blacklistedValues).join(", "),
                        });
                },
            },
        },
        vuetify.locale,
    ),
);

app.component("AlertMsg", AlertMsg);
app.mount("#app");
