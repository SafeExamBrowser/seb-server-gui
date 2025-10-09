import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import eslintPluginVuetify from "eslint-plugin-vuetify";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "node:url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
    includeIgnoreFile(gitignorePath),
    eslint.configs.recommended,
    tseslint.configs.strict,
    eslintPluginVue.configs["flat/recommended"],
    eslintPluginVuetify.configs["flat/base"],

    // global config
    {
        ignores: ["*.d.ts", "**/coverage", "**/dist"],
    },

    // config for files that run in node
    {
        files: ["eslint.config.js"],
        languageOptions: {
            globals: globals.node,
        },
    },

    // config for files that run in the browser
    {
        files: ["**/*.{js,ts,vue}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.browser,
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {
            // existing exceptions. @TODO: evaluate these again; ideally they can all be removed
            "no-console":
                process.env.NODE_ENV === "production" ? "warn" : "off", // TODO: this should be "error"
            "no-debugger":
                process.env.NODE_ENV === "production" ? "warn" : "off", // TODO: this should be "error"
            "@typescript-eslint/ban-ts-comment": [
                "error",
                { "ts-ignore": "allow-with-description" },
            ],
            "no-useless-catch": "off",
            "no-undef": "off",
            "@typescript-eslint/no-inferrable-types": "off",

            // new exceptions after updating eslint config. @TODO: remove these one by one and fix the respective issues in the codebase
            "no-unsafe-optional-chaining": "off",
            "vue/valid-v-slot": "off",
            "vue/no-v-html": "off",
            "vue/multi-word-component-names": "off",
            "vue/no-multiple-template-root": "off",
            "vue/valid-v-on": "off",
            "vue/valid-v-for": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
        },
    },

    // avoid conflicts with prettier
    eslintConfigPrettier,
]);
