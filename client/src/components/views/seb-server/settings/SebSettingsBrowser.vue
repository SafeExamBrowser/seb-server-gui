<template>
    <v-row>
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.browser.links.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>

            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-radio-group
                        v-model="newBrowserWindowByLinkPolicyVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        @update:model-value="
                            saveSingleValue(
                                'newBrowserWindowByLinkPolicy',
                                newBrowserWindowByLinkPolicyVal,
                            )
                        "
                    >
                        <v-radio
                            :label="
                                translate('sebSettings.browser.links.policy_0')
                            "
                            value="0"
                        >
                        </v-radio>
                        <v-radio
                            :label="
                                translate('sebSettings.browser.links.policy_1')
                            "
                            value="1"
                        >
                        </v-radio>
                        <v-radio
                            :label="
                                translate('sebSettings.browser.links.policy_2')
                            "
                            value="2"
                        >
                        </v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="newBrowserWindowByLinkBlockForeignVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.links.block')"
                        @update:model-value="
                            saveSingleValue(
                                'newBrowserWindowByLinkBlockForeign',
                                newBrowserWindowByLinkBlockForeignVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate("sebSettings.browser.links.block_tooltip")
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.browser.window.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="newBrowserWindowByLinkWidthVal"
                        density="compact"
                        :label="translate('sebSettings.browser.window.width')"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="newBrowserWindowByLinkWidthItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'newBrowserWindowByLinkWidth',
                                newBrowserWindowByLinkWidthVal,
                            )
                        "
                    >
                    </v-select>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.window.width_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="newBrowserWindowByLinkHeightVal"
                        density="compact"
                        :label="translate('sebSettings.browser.window.height')"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="newBrowserWindowByLinkHeightItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'newBrowserWindowByLinkHeight',
                                newBrowserWindowByLinkHeightVal,
                            )
                        "
                    >
                    </v-select>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.window.height_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="newBrowserWindowByLinkPositioningVal"
                        density="compact"
                        :label="translate('sebSettings.browser.window.pos')"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="newBrowserWindowByLinkPositioningItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'newBrowserWindowByLinkPositioning',
                                newBrowserWindowByLinkPositioningVal,
                            )
                        "
                    >
                    </v-select>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.browser.security.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowFindVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.security.find')"
                        @update:model-value="
                            saveSingleValue(
                                'allowFind',
                                allowFindVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowPDFReaderToolbarVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate('sebSettings.browser.security.toolbar')
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowPDFReaderToolbar',
                                allowPDFReaderToolbarVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.security.toolbar_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowPrintVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.security.print')"
                        @update:model-value="
                            saveSingleValue(
                                'allowPrint',
                                allowPrintVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.security.print_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="removeBrowserProfileVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.security.cache')"
                        @update:model-value="
                            saveSingleValue(
                                'removeBrowserProfile',
                                removeBrowserProfileVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.security.cache_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableRightMouseMacVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.browser.security.enableRightMouse',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableRightMouseMac',
                                enableRightMouseMacVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.security.enableRightMouse_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="
                            browserWindowWebViewClassicHideDeprecationNoteVal
                        "
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.browser.security.browserWindowWebViewClassicHideDeprecationNote',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'browserWindowWebViewClassicHideDeprecationNote',
                                browserWindowWebViewClassicHideDeprecationNoteVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.security.browserWindowWebViewClassicHideDeprecationNote_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="browserConnectionErrorReloadVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.browser.security.errorReload',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'browserConnectionErrorReload',
                                browserConnectionErrorReloadVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.security.errorReload_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.browser.restrictions.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowBrowsingBackForwardVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.browser.restrictions.allowBackFor',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowBrowsingBackForward',
                                allowBrowsingBackForwardVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.restrictions.allowBackFor_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="browserWindowAllowReloadVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.browser.restrictions.allowReload',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'browserWindowAllowReload',
                                browserWindowAllowReloadVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.restrictions.allowReload_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="showReloadWarningVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.browser.restrictions.showReloadWarning',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'showReloadWarning',
                                showReloadWarningVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.restrictions.showReloadWarning_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="browserWindowShowURLVal"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.browser.restrictions.showURL',
                            )
                        "
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="browserWindowShowURLItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'browserWindowShowURL',
                                browserWindowShowURLVal,
                            )
                        "
                    >
                    </v-select>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.restrictions.showURL_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.browser.restrictionsAdd.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="newBrowserWindowNavigationVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.browser.restrictionsAdd.allowBackFor',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'newBrowserWindowNavigation',
                                newBrowserWindowNavigationVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.restrictionsAdd.allowBackFor_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="newBrowserWindowAllowReloadVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.browser.restrictionsAdd.allowReload',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'newBrowserWindowAllowReload',
                                newBrowserWindowAllowReloadVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.restrictionsAdd.allowReload_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="newBrowserWindowShowReloadWarningVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.browser.restrictionsAdd.showReloadWarning',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'newBrowserWindowShowReloadWarning',
                                newBrowserWindowShowReloadWarningVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.restrictionsAdd.showReloadWarning_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="newBrowserWindowShowURLVal"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.browser.restrictionsAdd.showURL',
                            )
                        "
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="newBrowserWindowShowURLItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'newBrowserWindowShowURL',
                                newBrowserWindowShowURLVal,
                            )
                        "
                    >
                    </v-select>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.restrictionsAdd.showURL_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-col>

        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.browser.agent")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>

            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableSebBrowserVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate('sebSettings.browser.enableSebBrowser')
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableSebBrowser',
                                enableSebBrowserVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.enableSebBrowser_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="browserWindowWebViewVal"
                        density="compact"
                        :label="translate('sebSettings.browser.policy')"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="browserWindowWebViewItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'browserWindowWebView',
                                browserWindowWebViewVal,
                            )
                        "
                    >
                    </v-select>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{ translate("sebSettings.browser.policy_tooltip") }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="browserUserAgentVal"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        :label="
                            translate('sebSettings.browser.browserUserAgent')
                        "
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'browserUserAgent',
                                browserUserAgentVal,
                            )
                        "
                    >
                    </v-text-field>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.browserUserAgent_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="browserWindowTitleSuffixVal"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        :label="
                            translate('sebSettings.browser.windowTitleSuffix')
                        "
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'browserWindowTitleSuffix',
                                browserWindowTitleSuffixVal,
                            )
                        "
                    >
                    </v-text-field>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.windowTitleSuffix_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.browser.uaDesktop.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-radio-group
                        v-model="browserUserAgentWinDesktopModeVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        @update:model-value="
                            saveSingleValue(
                                'browserUserAgentWinDesktopMode',
                                browserUserAgentWinDesktopModeVal,
                            )
                        "
                    >
                        <v-radio
                            :label="
                                translate('sebSettings.browser.uaDesktop.0')
                            "
                            value="0"
                        >
                            <v-tooltip
                                activator="parent"
                                location="top left"
                                max-width="400"
                            >
                                {{
                                    translate(
                                        "sebSettings.browser.uaDesktop.0_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>

                        <v-radio
                            :label="
                                translate('sebSettings.browser.uaDesktop.1')
                            "
                            value="1"
                        >
                            <v-tooltip
                                activator="parent"
                                location="top left"
                                max-width="400"
                            >
                                {{
                                    translate(
                                        "sebSettings.browser.uaDesktop.1_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="browserUserAgentWinDesktopModeCustomVal"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'browserUserAgentWinDesktopModeCustom',
                                browserUserAgentWinDesktopModeCustomVal,
                            )
                        "
                    >
                    </v-text-field>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.uaDesktop.custom_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.browser.uaMac.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-radio-group
                        v-model="browserUserAgentMacVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        @update:model-value="
                            saveSingleValue(
                                'browserUserAgentMac',
                                browserUserAgentMacVal,
                            )
                        "
                    >
                        <v-radio
                            :label="translate('sebSettings.browser.uaMac.0')"
                            value="0"
                        >
                            <v-tooltip
                                activator="parent"
                                location="top left"
                                max-width="400"
                            >
                                {{
                                    translate(
                                        "sebSettings.browser.uaMac.0_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>

                        <v-radio
                            :label="translate('sebSettings.browser.uaMac.1')"
                            value="1"
                        >
                            <v-tooltip
                                activator="parent"
                                location="top left"
                                max-width="400"
                            >
                                {{
                                    translate(
                                        "sebSettings.browser.uaMac.1_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="browserUserAgentMacCustomVal"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'browserUserAgentMacCustom',
                                browserUserAgentMacCustomVal,
                            )
                        "
                    >
                    </v-text-field>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.uaMac.custom_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.browser.uaTouch.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-radio-group
                        v-model="browserUserAgentWinTouchModeVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        @update:model-value="
                            saveSingleValue(
                                'browserUserAgentWinTouchMode',
                                browserUserAgentWinTouchModeVal,
                            )
                        "
                    >
                        <v-radio
                            :label="translate('sebSettings.browser.uaTouch.0')"
                            value="0"
                        >
                            <v-tooltip
                                activator="parent"
                                location="top left"
                                max-width="400"
                            >
                                {{
                                    translate(
                                        "sebSettings.browser.uaTouch.0_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>

                        <v-radio
                            :label="translate('sebSettings.browser.uaTouch.1')"
                            value="1"
                        >
                        </v-radio>
                        <v-col :class="sebSettingsStore.fp">
                            <v-text-field
                                v-model="browserUserAgentWinTouchModeIPadVal"
                                density="compact"
                                :disabled="sebSettingsStore.readonly"
                                variant="outlined"
                                hide-details
                                @update:focused="
                                    saveOnFocusLost(
                                        $event,
                                        'browserUserAgentWinTouchModeIPad',
                                        browserUserAgentWinTouchModeIPadVal,
                                    )
                                "
                            >
                            </v-text-field>
                        </v-col>
                        <v-radio
                            :label="translate('sebSettings.browser.uaTouch.2')"
                            value="1"
                        >
                            <v-tooltip
                                activator="parent"
                                location="top left"
                                max-width="400"
                            >
                                {{
                                    translate(
                                        "sebSettings.browser.uaTouch.2_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="browserUserAgentWinTouchModeCustomVal"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'browserUserAgentWinTouchModeCustom',
                                browserUserAgentWinTouchModeCustomVal,
                            )
                        "
                    >
                    </v-text-field>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.uaTouch.custom_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.browser.media.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="browserMediaAutoplayVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.media.autoplay')"
                        @update:model-value="
                            saveSingleValue(
                                'browserMediaAutoplay',
                                browserMediaAutoplayVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.media.autoplay_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="browserMediaAutoplayAudioVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.media.audio')"
                        @update:model-value="
                            saveSingleValue(
                                'browserMediaAutoplayAudio',
                                browserMediaAutoplayAudioVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate("sebSettings.browser.media.audio_tooltip")
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="browserMediaAutoplayVideoVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.media.video')"
                        @update:model-value="
                            saveSingleValue(
                                'browserMediaAutoplayVideo',
                                browserMediaAutoplayVideoVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate("sebSettings.browser.media.video_tooltip")
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="browserMediaCaptureCameraVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.media.camera')"
                        @update:model-value="
                            saveSingleValue(
                                'browserMediaCaptureCamera',
                                browserMediaCaptureCameraVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.media.camera_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="browserMediaCaptureMicrophoneVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.media.mic')"
                        @update:model-value="
                            saveSingleValue(
                                'browserMediaCaptureMicrophone',
                                browserMediaCaptureMicrophoneVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{ translate("sebSettings.browser.media.mic_tooltip") }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="browserMediaCaptureScreenVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.media.screen')"
                        @update:model-value="
                            saveSingleValue(
                                'browserMediaCaptureScreen',
                                browserMediaCaptureScreenVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.media.screen_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="mobileAllowPictureInPictureMediaPlaybackVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.media.pic')"
                        @update:model-value="
                            saveSingleValue(
                                'mobileAllowPictureInPictureMediaPlayback',
                                mobileAllowPictureInPictureMediaPlaybackVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="mobileAllowInlineMediaPlaybackVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.browser.media.playback')"
                        @update:model-value="
                            saveSingleValue(
                                'mobileAllowInlineMediaPlayback',
                                mobileAllowInlineMediaPlaybackVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.media.playback_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="mobileCompactAllowInlineMediaPlaybackVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate('sebSettings.browser.media.playbackPhone')
                        "
                        @update:model-value="
                            saveSingleValue(
                                'mobileCompactAllowInlineMediaPlayback',
                                mobileCompactAllowInlineMediaPlaybackVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.browser.media.playbackPhone_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
import { useI18n } from "vue-i18n";
import { stringToBoolean, translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { ref, onBeforeMount } from "vue";
import {
    SEBSettingsValue,
    SEBSettingsView,
    SEBSettingAttribute,
} from "@/models/seb-server/sebSettings";

const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

const newBrowserWindowByLinkPolicyVal = ref<string>("2");
const newBrowserWindowByLinkBlockForeignVal = ref<boolean>(false);

const newBrowserWindowByLinkWidthVal = ref<string>("100%");
const newBrowserWindowByLinkWidthItems = ref<
    { title: string; value: string }[]
>([]);
const newBrowserWindowByLinkHeightVal = ref<string>("100%");
const newBrowserWindowByLinkHeightItems = ref<
    { title: string; value: string }[]
>([]);
const newBrowserWindowByLinkPositioningVal = ref<string>("2");
const newBrowserWindowByLinkPositioningItems = ref<
    { title: string; value: string }[]
>([]);

const allowPrintVal = ref<boolean>(false);
const allowPDFReaderToolbarVal = ref<boolean>(false);
const allowFindVal = ref<boolean>(false);
const removeBrowserProfileVal = ref<boolean>(false);
const enableRightMouseMacVal = ref<boolean>(false);
const browserWindowWebViewClassicHideDeprecationNoteVal = ref<boolean>(false);
const browserConnectionErrorReloadVal = ref<boolean>(false);

const allowBrowsingBackForwardVal = ref<boolean>(false);
const browserWindowAllowReloadVal = ref<boolean>(true);
const showReloadWarningVal = ref<boolean>(true);
const browserWindowShowURLVal = ref<string>("Never");
const browserWindowShowURLItems = ref<{ title: string; value: string }[]>([]);

const newBrowserWindowNavigationVal = ref<boolean>(true);
const newBrowserWindowAllowReloadVal = ref<boolean>(true);
const newBrowserWindowShowReloadWarningVal = ref<boolean>(false);
const newBrowserWindowShowURLVal = ref<string>("Never");
const newBrowserWindowShowURLItems = ref<{ title: string; value: string }[]>(
    [],
);

const browserWindowTitleSuffixVal = ref<string>("");
const browserUserAgentVal = ref<string>("");

const browserUserAgentWinDesktopModeVal = ref<string>("0");
const browserUserAgentWinDesktopModeCustomVal = ref<string>("");

const browserUserAgentWinTouchModeVal = ref<string>("0");
const browserUserAgentWinTouchModeIPadVal = ref<string>(
    "Mozilla/5.0 (iPad; CPU OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1",
);
const browserUserAgentWinTouchModeCustomVal = ref<string>("");

const browserUserAgentMacVal = ref<string>("0");
const browserUserAgentMacCustomVal = ref<string>("");

const enableSebBrowserVal = ref<boolean>(false);
const browserWindowWebViewVal = ref<string>("2");
const browserWindowWebViewItems = ref<{ title: string; value: string }[]>([]);

const browserMediaAutoplayVal = ref<boolean>(true);
const browserMediaAutoplayAudioVal = ref<boolean>(true);
const browserMediaAutoplayVideoVal = ref<boolean>(true);
const browserMediaCaptureCameraVal = ref<boolean>(false);
const browserMediaCaptureMicrophoneVal = ref<boolean>(false);
const mobileAllowPictureInPictureMediaPlaybackVal = ref<boolean>(true);
const mobileAllowInlineMediaPlaybackVal = ref<boolean>(false);
const mobileCompactAllowInlineMediaPlaybackVal = ref<boolean>(false);
const browserMediaCaptureScreenVal = ref<boolean>(false);

// the parent component identifier
let componentId: string;
let singleValues: Map<string, SEBSettingsValue>;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const browserSettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(ViewType.BROWSER, componentId);

    if (browserSettings == null) {
        return;
    }

    singleValues = new Map<string, SEBSettingsValue>(
        Object.entries(browserSettings.singleValues),
    );
    const attributes: Map<string, SEBSettingAttribute> = new Map<
        string,
        SEBSettingAttribute
    >(Object.entries(browserSettings.attributes));

    newBrowserWindowByLinkPolicyVal.value = getSingleValue(
        "newBrowserWindowByLinkPolicy",
    ).value;
    newBrowserWindowByLinkBlockForeignVal.value = stringToBoolean(
        getSingleValue("newBrowserWindowByLinkBlockForeign").value,
    );
    newBrowserWindowByLinkWidthVal.value = getSingleValue(
        "newBrowserWindowByLinkWidth",
    ).value;
    attributes
        .get("newBrowserWindowByLinkWidth")
        ?.resources?.split(",")
        .forEach((item) => {
            newBrowserWindowByLinkWidthItems.value.push({
                title: item,
                value: item,
            });
        });
    newBrowserWindowByLinkHeightVal.value = getSingleValue(
        "newBrowserWindowByLinkHeight",
    ).value;
    attributes
        .get("newBrowserWindowByLinkHeight")
        ?.resources?.split(",")
        .forEach((item) => {
            newBrowserWindowByLinkHeightItems.value.push({
                title: item,
                value: item,
            });
        });
    newBrowserWindowByLinkPositioningVal.value = getSingleValue(
        "newBrowserWindowByLinkPositioning",
    ).value;
    attributes
        .get("newBrowserWindowByLinkPositioning")
        ?.resources?.split(",")
        .forEach((item) => {
            newBrowserWindowByLinkPositioningItems.value.push({
                title: translate(
                    "sebSettings.browser.window.pos_" + item,
                    i18n,
                ),
                value: item,
            });
        });

    allowPrintVal.value = stringToBoolean(
        getSingleValue("newBrowserWindowByLinkPositioning").value,
    );
    allowPDFReaderToolbarVal.value = stringToBoolean(
        getSingleValue("allowPDFReaderToolbar").value,
    );
    allowFindVal.value = stringToBoolean(getSingleValue("allowFind").value);
    removeBrowserProfileVal.value = stringToBoolean(
        getSingleValue("removeBrowserProfile").value,
    );
    enableRightMouseMacVal.value = stringToBoolean(
        getSingleValue("enableRightMouseMac").value,
    );

    allowBrowsingBackForwardVal.value = stringToBoolean(
        getSingleValue("allowBrowsingBackForward").value,
    );
    browserWindowAllowReloadVal.value = stringToBoolean(
        getSingleValue("browserWindowAllowReload").value,
    );
    showReloadWarningVal.value = stringToBoolean(
        getSingleValue("showReloadWarning").value,
    );
    browserWindowShowURLVal.value = getSingleValue(
        "browserWindowShowURL",
    ).value;
    attributes
        .get("browserWindowShowURL")
        ?.resources?.split(",")
        .forEach((item) => {
            browserWindowShowURLItems.value.push({
                title: translate(
                    "sebSettings.browser.restrictions.showURL_" + item,
                    i18n,
                ),
                value: item,
            });
        });

    newBrowserWindowNavigationVal.value = stringToBoolean(
        getSingleValue("newBrowserWindowNavigation").value,
    );
    newBrowserWindowAllowReloadVal.value = stringToBoolean(
        getSingleValue("newBrowserWindowAllowReload").value,
    );
    newBrowserWindowShowReloadWarningVal.value = stringToBoolean(
        getSingleValue("newBrowserWindowShowReloadWarning").value,
    );

    newBrowserWindowShowURLVal.value = getSingleValue(
        "newBrowserWindowShowURL",
    ).value;
    attributes
        .get("newBrowserWindowShowURL")
        ?.resources?.split(",")
        .forEach((item) => {
            newBrowserWindowShowURLItems.value.push({
                title: translate(
                    "sebSettings.browser.restrictionsAdd.showURL_" + item,
                    i18n,
                ),
                value: item,
            });
        });

    browserWindowWebViewClassicHideDeprecationNoteVal.value = stringToBoolean(
        getSingleValue("browserWindowWebViewClassicHideDeprecationNote").value,
    );
    browserConnectionErrorReloadVal.value = stringToBoolean(
        getSingleValue("browserConnectionErrorReload").value,
    );
    browserUserAgentVal.value = getSingleValue("browserUserAgent").value;
    browserWindowTitleSuffixVal.value = getSingleValue(
        "browserWindowTitleSuffix",
    ).value;
    browserUserAgentWinDesktopModeVal.value = getSingleValue(
        "browserUserAgentWinDesktopMode",
    ).value;
    browserUserAgentWinDesktopModeCustomVal.value = getSingleValue(
        "browserUserAgentWinDesktopModeCustom",
    ).value;
    browserUserAgentWinTouchModeVal.value = getSingleValue(
        "browserUserAgentWinTouchMode",
    ).value;
    browserUserAgentWinTouchModeIPadVal.value = getSingleValue(
        "browserUserAgentWinTouchModeIPad",
    ).value;
    browserUserAgentWinTouchModeCustomVal.value = getSingleValue(
        "browserUserAgentWinTouchModeCustom",
    ).value;
    browserUserAgentMacVal.value = getSingleValue("browserUserAgentMac").value;
    browserUserAgentMacCustomVal.value = getSingleValue(
        "browserUserAgentMacCustom",
    ).value;

    enableSebBrowserVal.value = stringToBoolean(
        getSingleValue("enableSebBrowser").value,
    );
    browserWindowWebViewVal.value = getSingleValue(
        "browserWindowWebView",
    ).value;
    attributes
        .get("browserWindowWebView")
        ?.resources?.split(",")
        .forEach((item) => {
            browserWindowWebViewItems.value.push({
                title: translate("sebSettings.browser.policy_" + item, i18n),
                value: item,
            });
        });

    browserMediaAutoplayVal.value = stringToBoolean(
        getSingleValue("browserMediaAutoplay").value,
    );
    browserMediaAutoplayAudioVal.value = stringToBoolean(
        getSingleValue("browserMediaAutoplayAudio").value,
    );
    browserMediaAutoplayVideoVal.value = stringToBoolean(
        getSingleValue("browserMediaAutoplayVideo").value,
    );
    browserMediaCaptureCameraVal.value = stringToBoolean(
        getSingleValue("browserMediaCaptureCamera").value,
    );
    browserMediaCaptureMicrophoneVal.value = stringToBoolean(
        getSingleValue("browserMediaCaptureMicrophone").value,
    );
    mobileAllowPictureInPictureMediaPlaybackVal.value = stringToBoolean(
        getSingleValue("mobileAllowPictureInPictureMediaPlayback").value,
    );
    mobileAllowInlineMediaPlaybackVal.value = stringToBoolean(
        getSingleValue("mobileAllowInlineMediaPlayback").value,
    );
    mobileCompactAllowInlineMediaPlaybackVal.value = stringToBoolean(
        getSingleValue("mobileCompactAllowInlineMediaPlayback").value,
    );
    browserMediaCaptureScreenVal.value = stringToBoolean(
        getSingleValue("browserMediaCaptureScreen").value,
    );
});

async function saveSingleValue(name: string, value: string) {
    const setting: SEBSettingsValue = getSingleValue(name);
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        setting.id.toString(),
        value,
    );
}

async function saveOnFocusLost(focusIn: boolean, name: string, value: string) {
    if (!focusIn) {
        saveSingleValue(name, value);
    }
}

function getSingleValue(name: string): SEBSettingsValue {
    const value = singleValues.get(name);
    if (!value) {
        throw new Error("No Single Value" + name + " found");
    }

    return value;
}
</script>
