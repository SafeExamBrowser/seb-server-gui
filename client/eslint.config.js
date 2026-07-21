import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import eslintPluginVuetify from "eslint-plugin-vuetify";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores([
        "**/*.d.ts",
        "**/dist/",
        "**/coverage/",
        "playwright-report/",
        "test-results/",
        "blob-report/",
        "playwright/.cache/",
        "playwright/.auth/",
        "src/api/seb-server/generated/",
    ]),
    eslint.configs.recommended,
    // TODO @alain/@andrei: upgrade to tseslint.configs.strictTypeChecked (+ stylisticTypeChecked) for type-aware linting.
    // - Needs parserOptions.projectService and extra setup for .vue files, so it's not a quickfix.
    tseslint.configs.strict,
    eslintPluginVue.configs["flat/recommended"],
    eslintPluginVuetify.configs["flat/base"],

    // TODO @alain/@andrei: enable this and clean up all useages
    // {
    //     files: ["**/*.{js,ts,vue}"],
    //     rules: {
    //         eqeqeq: "error",
    //         "vue/eqeqeq": "error",
    //     },
    // },

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
            globals: {
                ...globals.browser,
                definePage: "readonly",
            },
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {
            "no-console": "error",
            "no-debugger": "error",
            "vue/no-undef-components": [
                // Vuetify components (VBtn, VRow, ...) are auto-imported by vite-plugin-vuetify, and we
                // don't want to enforce manual imports of Vuetify components for now. Hence we
                // exclude them here, using the Vuetify naming convention (V + PascalCase)
                "error",
                { ignorePatterns: ["^V[A-Z]"] },
            ],
        },
    },

    // Restrict parent relative imports:
    // * Scoped to "src/**", as tests are use "../" for local helpers
    // * TODO @Andrei: broaden this so tests are also included
    {
        files: ["src/**/*.{js,ts,vue}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["../*", "..", "../**"],
                            message:
                                "Don't import from a parent directory with '../'. Use the '@/...' alias instead. Same-folder ('./x') and subfolder ('./sub/x') relative imports are fine.",
                        },
                    ],
                },
            ],
        },
    },

    // config for pages etc. (file based routing)
    {
        files: [
            "src/pages/**/index.vue",
            "src/pages/**/[[]*.vue",
            "src/pages/(app).vue",
            "src/pages/(public).vue",
        ],
        rules: {
            "vue/multi-word-component-names": "off",
        },
    },

    // avoid conflicts with prettier
    eslintConfigPrettier,
]);
