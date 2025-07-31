import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugins } from '@/plugins'
import AlertMsg from '@/components/widgets/AlertMsg.vue'
import i18n from './i18n'
import { abilitiesPlugin } from '@casl/vue'
import { ability } from '@/casl/ability'

// 🚀 Vuetify setup
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi }
    }
})

const app = createApp(App)
app.use(vuetify)
registerPlugins(app)
app.use(abilitiesPlugin, ability, { useGlobalProperties: true })
app.use(i18n)

app.component('AlertMsg', AlertMsg)
app.mount('#app')
