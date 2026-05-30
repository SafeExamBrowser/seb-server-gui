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
                    background: "#F5F6F9",
                    surface: "#FFFFFF",
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
                },
                variables: {
                    "overlay-background": "#171c25",
                },
            },
        },
    },
});

export default vuetify;
