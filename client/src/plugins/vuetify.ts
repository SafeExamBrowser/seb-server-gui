import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import { VStepperVertical, VStepperVerticalItem, VStepperVerticalActions } from 'vuetify/labs/VStepperVertical'
import { createVuetify } from "vuetify"

export default createVuetify({
    components: {
        VStepperVertical,
        VStepperVerticalItem,
        VStepperVerticalActions
    },
    theme: {
        themes: {
            light: {
                colors: {
                    primary: "#215CAF",
                    secondary: "#5CBBF6",
                    blue: "#2196F3",
                    green: "#2a8f5d",
                    title: "#000000",
                    subtitle: "#000000",
                    // background: "#eef5f9",
                    // surface: "#4D7DBF"
                },
            },
            dark: {
                colors: {
                    primary: "#215CAF",
                    secondary: "#5CBBF6",
                    blue: "#2196F3",
                    subtitle: "#ffffff",
                }
            },
            tableTheme: {
                colors: {
                    surface: "#e2ecf7",
                    // surface: "#215CAF",

                },
            }
        },
    },
    locale: {
        // locale: "de-DE"
    }
})
