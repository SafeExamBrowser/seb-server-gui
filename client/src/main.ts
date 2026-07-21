// 🚀 Vuetify setup
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import { createRulesPlugin } from "vuetify/labs/rules";

import { registerPlugins } from "@/plugins";
import vuetify from "@/plugins/vuetify";
import {
    alphabeticalAfter,
    alphabeticalBefore,
} from "@/utils/validation/alphabetical";
import { blacklisted } from "@/utils/validation/blacklisted";
import { fileExtension } from "@/utils/validation/fileExtension";
import { ipAddress } from "@/utils/validation/ipAddress";

import App from "./App.vue";
import i18n from "./i18n";

const app = createApp(App);
app.use(vuetify);
registerPlugins(app);
app.use(i18n);

app.use(
    createRulesPlugin(
        {
            aliases: {
                blacklisted,
                fileExtension,
                ipAddress,
                alphabeticalBefore,
                alphabeticalAfter,
            },
        },
        vuetify.locale,
    ),
);

app.mount("#app");
