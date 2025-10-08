import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import {
    VStepperVertical,
    VStepperVerticalActions,
    VStepperVerticalItem,
} from "vuetify/labs/VStepperVertical";
import { createVuetify } from "vuetify";

const alertColors = {
    success: { bg: "#E2EDE1", border: "#AAD5AB", accent: "#4CAF50" },
    info: { bg: "#E0EAF5", border: "#A4CAF5", accent: "#2296F3" },
    error: { bg: "#EFDBDC", border: "#D99196", accent: "#B00020" },
    warning: { bg: "#F7E9DC", border: "#FAC594", accent: "#FB8C00" },
};

export const vuetify = createVuetify({
    components: {
        VStepperVertical,
        VStepperVerticalItem,
        VStepperVerticalActions,
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

                    // flatten
                    ...Object.fromEntries(
                        Object.entries(alertColors).flatMap(([kind, vals]) => [
                            [`alert-${kind}-bg`, vals.bg],
                            [`alert-${kind}-border`, vals.border],
                            [`alert-${kind}-accent`, vals.accent],
                        ]),
                    ),
                },
            },
            dark: {
                colors: {
                    primary: "#215CAF",
                    secondary: "#5CBBF6",
                    blue: "#2196F3",
                    subtitle: "#ffffff",
                },
            },
            tableTheme: {
                colors: {
                    surface: "#e2ecf7",
                    // surface: "#215CAF",
                },
            },
        },
    },
    locale: {
        // locale: "de-DE"
    },
});

export default vuetify;
