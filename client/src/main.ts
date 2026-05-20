import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "@/plugins";
import i18n from "./i18n";

// 🚀 Vuetify setup
import "@mdi/font/css/materialdesignicons.css";
import { createRulesPlugin } from "vuetify/labs/rules";

import vuetify from "@/plugins/vuetify";
import { blacklisted } from "@/utils/validation/blacklisted";
import { fileExtension } from "@/utils/validation/fileExtension";
import { ipAddress } from "@/utils/validation/ipAddress";
import {
    alphabeticalAfter,
    alphabeticalBefore,
} from "@/utils/validation/alphabetical";

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
