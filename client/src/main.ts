import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "@/plugins";
import AlertMsg from "@/components/widgets/AlertMsg.vue";
import i18n from "./i18n";

// 🚀 Vuetify setup
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { createRulesPlugin } from "vuetify/labs/rules";

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: { mdi },
    },
});

const app = createApp(App);
app.use(vuetify);
registerPlugins(app);
app.use(i18n);

app.use(createRulesPlugin({}, vuetify.locale));

app.component("AlertMsg", AlertMsg);
app.mount("#app");
