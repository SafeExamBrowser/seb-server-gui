import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginVue from "eslint-plugin-vue";
import eslintPluginVuetify from "eslint-plugin-vuetify";
import globals from "globals";
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
    // TODO @andrei: upgrade to tseslint.configs.strictTypeChecked (+ stylisticTypeChecked) for type-aware linting.
    // - Needs parserOptions.projectService and extra setup for .vue files, so it's not a quickfix.
    tseslint.configs.strict,
    eslintPluginVue.configs["flat/recommended"],
    eslintPluginVuetify.configs["flat/base"],

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
        plugins: {
            "simple-import-sort": eslintPluginSimpleImportSort,
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "no-console": "error",
            "no-debugger": "error",
            "vue/no-undef-components": "error",
            // TODO @andrei: enable this and clean up all useages (loose comparisons are a potential source of bugs)
            // eqeqeq: "error",
            // "vue/eqeqeq": "error",
        },
    },

    // Restrict parent relative imports:
    // * Scoped to "src/**", as tests are use "../" for local helpers
    // * TODO @Andrei: broaden this, so tests are also included
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
