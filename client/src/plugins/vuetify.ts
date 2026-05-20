import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles/main.css";
import {
    VStepperVertical,
    VStepperVerticalActions,
    VStepperVerticalItem,
} from "vuetify/labs/VStepperVertical";
import { VColorInput } from "vuetify/labs/VColorInput";
import { VFileUpload } from "vuetify/labs/VFileUpload";
import { createVuetify } from "vuetify";

const alertColors = {
    success: { bg: "#E2EDE1", border: "#AAD5AB", accent: "#4CAF50" },
    info: { bg: "#E0EAF5", border: "#A4CAF5", accent: "#2296F3" },
    error: { bg: "#EFDBDC", border: "#D99196", accent: "#B00020" },
    warning: { bg: "#F7E9DC", border: "#FAC594", accent: "#FB8C00" },
};

// Toast colours (consumed by ToastItem.vue via --v-theme-alert-*). Kept
// outside the Vuetify Studio palette and merged into every theme so toasts
// render correctly in both light and dark mode.
const alertThemeColors = Object.fromEntries(
    Object.entries(alertColors).flatMap(([kind, vals]) => [
        [`alert-${kind}-bg`, vals.bg],
        [`alert-${kind}-border`, vals.border],
        [`alert-${kind}-accent`, vals.accent],
    ]),
);

export const vuetify = createVuetify({
    components: {
        VStepperVertical,
        VStepperVerticalItem,
        VStepperVerticalActions,
        VColorInput,
        VFileUpload,
    },
    theme: {
        defaultTheme: "light",
        themes: {
            light: {
                dark: false,
                colors: {
                    background: "#ededf4",
                    surface: "#f9f9ff",
                    "surface-dim": "#d9dae0",
                    "surface-bright": "#f9f9ff",
                    "surface-container-lowest": "#ffffff",
                    "surface-container-low": "#f2f3fa",
                    "surface-container": "#ededf4",
                    "surface-container-high": "#e7e8ef",
                    "surface-container-highest": "#e1e2e9",
                    "on-surface": "#191c20",
                    outline: "#737783",
                    "outline-variant": "#c3c6d3",
                    primary: "#215CAF",
                    "on-primary": "#ffffff",
                    "primary-container": "#d7e2ff",
                    "on-primary-container": "#001b3f",
                    secondary: "#026689",
                    "on-secondary": "#ffffff",
                    "secondary-container": "#c3e8ff",
                    "on-secondary-container": "#001e2c",
                    tertiary: "#6150ae",
                    "on-tertiary": "#ffffff",
                    "tertiary-container": "#e6deff",
                    "on-tertiary-container": "#1c0062",
                    error: "#ba1a1a",
                    "on-error": "#ffffff",
                    "error-container": "#ffdad6",
                    "on-error-container": "#410002",
                    "surface-light": "#e7e8ef",
                    ...alertThemeColors,
                },
                variables: {
                    "overlay-background": "#171c25",
                },
            },
        },
    },
});

export default vuetify;
