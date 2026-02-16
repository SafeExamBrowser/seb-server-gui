<template>
    <v-row>
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.securityView.sebService.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="sebServiceIgnore"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.sebService.sebServiceIgnore',
                            )
                        "
                        @update:model-value="saveSEBServiceIgnore"
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    ><div style="color: darkred">
                        {{
                            translate(
                                "sebSettings.securityView.sebService.note",
                            )
                        }}
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-radio-group
                        v-model="sebServicePolicy"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.sebService.sebServicePolicy',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'sebServicePolicy',
                                sebServicePolicy ? 'true' : 'false',
                            )
                        "
                    >
                        <v-radio
                            :label="
                                translate(
                                    'sebSettings.securityView.sebService.sebServicePolicy_0',
                                )
                            "
                            value="0"
                        >
                        </v-radio>
                        <v-radio
                            :label="
                                translate(
                                    'sebSettings.securityView.sebService.sebServicePolicy_1',
                                )
                            "
                            value="1"
                        >
                        </v-radio>
                        <v-radio
                            :label="
                                translate(
                                    'sebSettings.securityView.sebService.sebServicePolicy_2',
                                )
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
                        v-model="enableWindowsUpdate"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.sebService.enableWindowsUpdate',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableWindowsUpdate',
                                enableWindowsUpdate ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableChromeNotifications"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.sebService.enableChromeNotifications',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableChromeNotifications',
                                enableChromeNotifications ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowScreenSharing"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.sebService.allowScreenSharing',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowScreenSharing',
                                allowScreenSharing ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{
                        translate(
                            "sebSettings.securityView.kioskMode.kioskMode",
                        )
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.securityView.kioskMode.kioskMode_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-radio-group
                        v-model="kioskMode"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        @update:model-value="
                            saveSingleValue(
                                'kioskMode',
                                kioskMode ? 'true' : 'false',
                            )
                        "
                    >
                        <v-radio
                            :label="
                                translate(
                                    'sebSettings.securityView.kioskMode.kioskMode_0',
                                )
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
                                        "sebSettings.securityView.kioskMode.kioskMode_0_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                        <v-radio
                            :label="
                                translate(
                                    'sebSettings.securityView.kioskMode.kioskMode_1',
                                )
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
                                        "sebSettings.securityView.kioskMode.kioskMode_1_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                        <v-radio
                            :label="
                                translate(
                                    'sebSettings.securityView.kioskMode.kioskMode_2',
                                )
                            "
                            value="2"
                        >
                            <v-tooltip
                                activator="parent"
                                location="top left"
                                max-width="400"
                            >
                                {{
                                    translate(
                                        "sebSettings.securityView.kioskMode.kioskMode_2_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.securityView.overall.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-5">
                    <v-number-input
                        v-model="allowedDisplaysMaxNumber"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.securityView.overall.allowedDisplaysMaxNumber',
                            )
                        "
                        :min="1"
                        :rules="[maxDisplayRule]"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        variant="outlined"
                        @update:model-value="saveMaxDisplays"
                    >
                    </v-number-input>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowedDisplayBuiltinEnforce"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.overall.allowedDisplayBuiltinEnforce',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowedDisplayBuiltinEnforce',
                                allowedDisplayBuiltinEnforce ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowedDisplaysIgnoreFailure"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.overall.allowedDisplaysIgnoreFailure',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowedDisplaysIgnoreFailure',
                                allowedDisplaysIgnoreFailure ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableCursorVerification"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.overall.enableCursorVerification',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableCursorVerification',
                                enableCursorVerification ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableSessionVerification"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.overall.enableSessionVerification',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableSessionVerification',
                                enableSessionVerification ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowStickyKeys"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.overall.allowStickyKeys',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowStickyKeys',
                                allowStickyKeys ? 'true' : 'false',
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
                                "sebSettings.securityView.overall.allowStickyKeys_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.securityView.logging.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableLogging"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.logging.enableLogging',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableLogging',
                                enableLogging ? 'true' : 'false',
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
                                "sebSettings.securityView.logging.enableLogging_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="logDirectoryWin"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.securityView.logging.logDirectoryWin',
                            )
                        "
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        variant="outlined"
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'logDirectoryWin',
                                logDirectoryWin,
                            )
                        "
                    >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="logDirectoryOSX"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.securityView.logging.logDirectoryOSX',
                            )
                        "
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        variant="outlined"
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'logDirectoryOSX',
                                logDirectoryOSX,
                            )
                        "
                    >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="logLevel"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.securityView.logging.logLevel',
                            )
                        "
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="logLevelItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue('logLevel', logLevel)
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
                                "sebSettings.securityView.logging.logLevel_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowApplicationLog"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.logging.allowApplicationLog',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowApplicationLog',
                                allowApplicationLog ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="showApplicationLogButton"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.logging.showApplicationLogButton',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'showApplicationLogButton',
                                showApplicationLogButton ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
        </v-col>

        <!-- Left Right-->

        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.securityView.macOS.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="minMacOSVersion"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.minMacOSVersion',
                            )
                        "
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="minMacOSVersionItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue('minMacOSVersion', minMacOSVersion)
                        "
                    >
                    </v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableMacOSAAC"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.enableMacOSAAC',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableMacOSAAC',
                                enableMacOSAAC ? 'true' : 'false',
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
                                "sebSettings.securityView.macOS.enableMacOSAAC_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="aacDnsPrePinning"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.aacDnsPrePinning',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'aacDnsPrePinning',
                                aacDnsPrePinning ? 'true' : 'false',
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
                                "sebSettings.securityView.macOS.aacDnsPrePinning_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableAppSwitcherCheck"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.enableAppSwitcherCheck',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableAppSwitcherCheck',
                                enableAppSwitcherCheck ? 'true' : 'false',
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
                                "sebSettings.securityView.macOS.enableAppSwitcherCheck_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="forceAppFolderInstall"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.forceAppFolderInstall',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'forceAppFolderInstall',
                                forceAppFolderInstall ? 'true' : 'false',
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
                                "sebSettings.securityView.macOS.forceAppFolderInstall_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowUserAppFolderInstall"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.allowUserAppFolderInstall',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowUserAppFolderInstall',
                                allowUserAppFolderInstall ? 'true' : 'false',
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
                                "sebSettings.securityView.macOS.allowUserAppFolderInstall_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowSiri"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.allowSiri',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowSiri',
                                allowSiri ? 'true' : 'false',
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
                                "sebSettings.securityView.macOS.allowSiri_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowDictation"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.allowDictation',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowDictation',
                                allowDictation ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="detectStoppedProcess"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.detectStoppedProcess',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'detectStoppedProcess',
                                detectStoppedProcess ? 'true' : 'false',
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
                                "sebSettings.securityView.macOS.detectStoppedProcess_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowDisplayMirroring"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.allowDisplayMirroring',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowDisplayMirroring',
                                allowDisplayMirroring ? 'true' : 'false',
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
                                "sebSettings.securityView.macOS.allowDisplayMirroring_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowedDisplayBuiltin"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.allowedDisplayBuiltin',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowedDisplayBuiltin',
                                allowedDisplayBuiltin ? 'true' : 'false',
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
                                "sebSettings.securityView.macOS.allowedDisplayBuiltin_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowedDisplayBuiltinExceptDesktop"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.allowedDisplayBuiltinExceptDesktop',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowedDisplayBuiltinExceptDesktop',
                                allowedDisplayBuiltinExceptDesktop
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
                                "sebSettings.securityView.macOS.allowedDisplayBuiltinExceptDesktop_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="screenSharingMacEnforceBlocked"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.screenSharingMacEnforceBlocked',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'screenSharingMacEnforceBlocked',
                                screenSharingMacEnforceBlocked
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
                        v-model="allowScreenCapture"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.allowScreenCapture',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowScreenCapture',
                                allowScreenCapture ? 'true' : 'false',
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
                                "sebSettings.securityView.macOS.allowScreenCapture_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowWindowCapture"
                        :disabled="
                            sebSettingsStore.readonly ||
                            allowScreenCapture == false
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.allowWindowCapture',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowWindowCapture',
                                allowWindowCapture ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="blockScreenShotsLegacy"
                        :disabled="
                            sebSettingsStore.readonly ||
                            allowWindowCapture == false
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.securityView.macOS.blockScreenShotsLegacy',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'blockScreenShotsLegacy',
                                blockScreenShotsLegacy ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.securityView.clipboard.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-radio-group
                        v-model="clipboardPolicy"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        @update:model-value="
                            saveSingleValue(
                                'sebServicePolicy',
                                sebServicePolicy ? 'true' : 'false',
                            )
                        "
                    >
                        <v-radio
                            :label="
                                translate(
                                    'sebSettings.securityView.clipboard.clipboardPolicy_0',
                                )
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
                                        "sebSettings.securityView.clipboard.clipboardPolicy_0_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                        <v-radio
                            :label="
                                translate(
                                    'sebSettings.securityView.clipboard.clipboardPolicy_1',
                                )
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
                                        "sebSettings.securityView.clipboard.clipboardPolicy_1_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                        <v-radio
                            :label="
                                translate(
                                    'sebSettings.securityView.clipboard.clipboardPolicy_2',
                                )
                            "
                            value="2"
                        >
                            <v-tooltip
                                activator="parent"
                                location="top left"
                                max-width="400"
                            >
                                {{
                                    translate(
                                        "sebSettings.securityView.clipboard.clipboardPolicy_2_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.securityView.sebVersion.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col
                    ><div>
                        {{
                            translate(
                                "sebSettings.securityView.sebVersion.sebAllowedVersions_note1",
                            )
                        }}
                    </div>
                    <div class="font-weight-bold pl-5">
                        {{
                            translate(
                                "sebSettings.securityView.sebVersion.sebAllowedVersions_format",
                            )
                        }}
                    </div>
                    <div>
                        {{
                            translate(
                                "sebSettings.securityView.sebVersion.sebAllowedVersions_note2",
                            )
                        }}
                    </div>
                </v-col>
            </v-row>

            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-textarea
                        v-model="sebAllowedVersions"
                        density="compact"
                        multi-line
                        :rules="[allowedVersionRule]"
                        validate-on="eager"
                        :label="
                            translate(
                                'sebSettings.securityView.sebVersion.sebAllowedVersions',
                            )
                        "
                        :disabled="sebSettingsStore.readonly"
                        variant="outlined"
                        @update:focused="saveAllowedVersion($event)"
                    >
                    </v-textarea>
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

// settings
const sebServicePolicy = ref<string>("2"); //	RADIO_SELECTION
const kioskMode = ref<string>("0"); //	RADIO_SELECTION
const allowVirtualMachine = ref<boolean>(false); //	CHECKBOX
const allowScreenSharing = ref<boolean>(false); //	CHECKBOX
const enablePrivateClipboardMacEnforce = ref<boolean>(false); //	CHECKBOX
const enableLogging = ref<boolean>(false); //	CHECKBOX
const logDirectoryWin = ref<string>(""); //	TEXT_FIELD
const logDirectoryOSX = ref<string>(""); //	TEXT_FIELD
const minMacOSVersion = ref<string>("8"); //	SINGLE_SELECTION
const minMacOSVersionItems = ref<{ title: string; value: string }[]>([]);
const enableAppSwitcherCheck = ref<boolean>(false); //	CHECKBOX
const forceAppFolderInstall = ref<boolean>(false); //	CHECKBOX
const allowUserAppFolderInstall = ref<boolean>(false); //	CHECKBOX
const allowSiri = ref<boolean>(false); //	CHECKBOX
const detectStoppedProcess = ref<boolean>(false); //	CHECKBOX
const allowDisplayMirroring = ref<boolean>(false); //	CHECKBOX
const allowedDisplaysMaxNumber = ref<number>(1); //	COMBO_SELECTION --> Number Input
const allowedDisplayBuiltin = ref<boolean>(false); //	CHECKBOX
const logLevel = ref<string>("1"); //	SINGLE_SELECTION
const logLevelItems = ref<{ title: string; value: string; tooltip: string }[]>(
    [],
);
const sebServiceIgnore = ref<boolean>(false); //	CHECKBOX
const allowApplicationLog = ref<boolean>(false); //	CHECKBOX
const showApplicationLogButton = ref<boolean>(false); //	CHECKBOX
const enableWindowsUpdate = ref<boolean>(false); //	CHECKBOX
const enableChromeNotifications = ref<boolean>(false); //	CHECKBOX
const enablePrintScreen = ref<boolean>(false); //	CHECKBOX
const allowedDisplaysIgnoreFailure = ref<boolean>(false); //	CHECKBOX
const sebAllowedVersions = ref<string>(""); //	TEXT_FIELD_LIST
const allowedDisplayBuiltinEnforce = ref<boolean>(false); //	CHECKBOX
const enableMacOSAAC = ref<boolean>(false); //	CHECKBOX
const aacDnsPrePinning = ref<boolean>(false); //	CHECKBOX
const allowDictation = ref<boolean>(false); //	CHECKBOX
const allowedDisplayBuiltinExceptDesktop = ref<boolean>(false); //	CHECKBOX
const screenSharingMacEnforceBlocked = ref<boolean>(false); //	CHECKBOX
const allowScreenCapture = ref<boolean>(false); //	CHECKBOX
const allowWindowCapture = ref<boolean>(false); //	CHECKBOX
const blockScreenShotsLegacy = ref<boolean>(false); //	CHECKBOX
const clipboardPolicy = ref<string>("2"); //	RADIO_SELECTION
const enableCursorVerification = ref<boolean>(false); //	CHECKBOX
const enableSessionVerification = ref<boolean>(false); //	CHECKBOX
const allowStickyKeys = ref<boolean>(false); //	CHECKBOX
const mobileEnableModernAAC = ref<boolean>(false); //	CHECKBOX

const maxDisplayRule = () => {
    if (allowedDisplaysMaxNumber.value < 0) {
        return translate("sebSettings.noNegNumber", i18n);
    }
    return true;
};

// the parent component identifier
let componentId: string;
let singleValues: Map<string, SEBSettingsValue>;
let attributes: Map<string, SEBSettingAttribute>;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const securitySettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.SECURITY,
            componentId,
        );
    if (securitySettings == null) {
        return;
    }

    singleValues = new Map<string, SEBSettingsValue>(
        Object.entries(securitySettings.singleValues),
    );

    attributes = new Map<string, SEBSettingAttribute>(
        Object.entries(securitySettings.attributes),
    );

    sebServicePolicy.value = getSingleValue("sebServicePolicy").value;
    kioskMode.value = getSingleValue("kioskMode").value;
    allowVirtualMachine.value = stringToBoolean(
        getSingleValue("allowVirtualMachine").value,
    );
    allowScreenSharing.value = stringToBoolean(
        getSingleValue("allowScreenSharing").value,
    );
    enablePrivateClipboardMacEnforce.value = stringToBoolean(
        getSingleValue("enablePrivateClipboardMacEnforce").value,
    );
    enableLogging.value = stringToBoolean(
        getSingleValue("enableLogging").value,
    );
    logDirectoryWin.value = getSingleValue("logDirectoryWin").value;
    logDirectoryOSX.value = getSingleValue("logDirectoryOSX").value;
    minMacOSVersion.value = getSingleValue("minMacOSVersion").value;
    attributes
        .get("minMacOSVersion")
        ?.resources?.split(",")
        .forEach((item) => {
            minMacOSVersionItems.value.push({
                title: translate(
                    "sebSettings.securityView.macOS.minMacOSVersion_" + item,
                    i18n,
                ),
                value: item,
            });
        });

    enableAppSwitcherCheck.value = stringToBoolean(
        getSingleValue("enableAppSwitcherCheck").value,
    );
    forceAppFolderInstall.value = stringToBoolean(
        getSingleValue("forceAppFolderInstall").value,
    );
    allowUserAppFolderInstall.value = stringToBoolean(
        getSingleValue("allowUserAppFolderInstall").value,
    );
    allowSiri.value = stringToBoolean(getSingleValue("allowSiri").value);
    detectStoppedProcess.value = stringToBoolean(
        getSingleValue("detectStoppedProcess").value,
    );
    allowDisplayMirroring.value = stringToBoolean(
        getSingleValue("allowDisplayMirroring").value,
    );
    allowedDisplaysMaxNumber.value = parseInt(
        getSingleValue("allowedDisplaysMaxNumber").value,
    );
    allowedDisplayBuiltin.value = stringToBoolean(
        getSingleValue("allowedDisplayBuiltin").value,
    );
    logLevel.value = getSingleValue("logLevel").value;
    attributes
        .get("logLevel")
        ?.resources?.split(",")
        .forEach((item) => {
            logLevelItems.value.push({
                title: translate(
                    "sebSettings.securityView.logging.logLevel_" + item,
                    i18n,
                ),
                value: item,
                tooltip: translate(
                    "sebSettings.securityView.logging.logLevel_" +
                        item +
                        "_tooltip",
                    i18n,
                ),
            });
        });

    sebServiceIgnore.value = stringToBoolean(
        getSingleValue("sebServiceIgnore").value,
    );
    sebSettingsStore.ignoreSEBService = sebServiceIgnore.value;
    allowApplicationLog.value = stringToBoolean(
        getSingleValue("allowApplicationLog").value,
    );
    showApplicationLogButton.value = stringToBoolean(
        getSingleValue("showApplicationLogButton").value,
    );
    enableWindowsUpdate.value = stringToBoolean(
        getSingleValue("enableWindowsUpdate").value,
    );
    enableChromeNotifications.value = stringToBoolean(
        getSingleValue("enableChromeNotifications").value,
    );
    enablePrintScreen.value = stringToBoolean(
        getSingleValue("enablePrintScreen").value,
    );
    allowedDisplaysIgnoreFailure.value = stringToBoolean(
        getSingleValue("allowedDisplaysIgnoreFailure").value,
    );
    sebAllowedVersions.value = toSEBVersion(
        getSingleValue("sebAllowedVersions").value,
    );
    allowedDisplayBuiltinEnforce.value = stringToBoolean(
        getSingleValue("allowedDisplayBuiltinEnforce").value,
    );
    enableMacOSAAC.value = stringToBoolean(
        getSingleValue("enableMacOSAAC").value,
    );
    aacDnsPrePinning.value = stringToBoolean(
        getSingleValue("aacDnsPrePinning").value,
    );
    allowDictation.value = stringToBoolean(
        getSingleValue("allowDictation").value,
    );
    allowedDisplayBuiltinExceptDesktop.value = stringToBoolean(
        getSingleValue("allowedDisplayBuiltinExceptDesktop").value,
    );
    screenSharingMacEnforceBlocked.value = stringToBoolean(
        getSingleValue("screenSharingMacEnforceBlocked").value,
    );
    allowScreenCapture.value = stringToBoolean(
        getSingleValue("allowScreenCapture").value,
    );
    allowWindowCapture.value = stringToBoolean(
        getSingleValue("allowWindowCapture").value,
    );
    blockScreenShotsLegacy.value = stringToBoolean(
        getSingleValue("blockScreenShotsLegacy").value,
    );
    clipboardPolicy.value = getSingleValue("clipboardPolicy").value;
    enableCursorVerification.value = stringToBoolean(
        getSingleValue("enableCursorVerification").value,
    );
    enableSessionVerification.value = stringToBoolean(
        getSingleValue("enableSessionVerification").value,
    );
    allowStickyKeys.value = stringToBoolean(
        getSingleValue("allowStickyKeys").value,
    );
    mobileEnableModernAAC.value = stringToBoolean(
        getSingleValue("mobileEnableModernAAC").value,
    );
});

function toSEBVersion(versions: string): string {
    if (versions == null) {
        return versions;
    }

    return versions.replaceAll(",", "\n");
}

async function saveSEBServiceIgnore() {
    sebSettingsStore.ignoreSEBService = sebServiceIgnore.value;

    saveSingleValue(
        "sebServiceIgnore",
        sebServiceIgnore.value ? "true" : "false",
    );
}

async function saveMaxDisplays() {
    if (allowedDisplaysMaxNumber.value >= 1) {
        saveSingleValue(
            "allowedDisplaysMaxNumber",
            allowedDisplaysMaxNumber.value.toString(),
        );
    } else {
        saveSingleValue("allowedDisplaysMaxNumber", "1");
    }
}

async function saveAllowedVersion(focusIn: boolean) {
    if (focusIn || !sebVersionsValid) {
        return;
    }
    if (sebAllowedVersions.value == null) {
        saveSingleValue("sebAllowedVersions", "");
        return;
    }

    const versions = sebAllowedVersions.value.split("\n");
    var valToSave = "";
    for (let v of versions) {
        valToSave += (valToSave.length > 0 ? "," : "") + v;
    }
    saveSingleValue("sebAllowedVersions", valToSave);
}

var sebVersionsValid = true;
const allowedVersionRule = () => {
    if (sebAllowedVersions.value == null) {
        return true;
    }

    const versions = sebAllowedVersions.value.split("\n");
    for (let v of versions) {
        if (!isSEBVersionValid(v)) {
            sebVersionsValid = false;
            return "Invalid SEB Version: " + v;
        }
    }

    sebVersionsValid = true;
    return true;
};

const OS_WINDOWS_IDENTIFIER = "Win";
const OS_MAC_IDENTIFIER = "Mac";
const OS_IOS_IDENTIFIER = "iOS";
const ALLIANCE_EDITION_IDENTIFIER = "AE";
const MINIMAL_IDENTIFIER = "min";

function isSEBVersionValid(version: string): boolean {
    if (version.endsWith(".")) {
        return false;
    }

    const sections = version.split(".");
    if (sections.length < 3) {
        return false;
    }

    // check os
    if (
        !(
            sections[0] === OS_WINDOWS_IDENTIFIER ||
            sections[0] === OS_MAC_IDENTIFIER ||
            sections[0] === OS_IOS_IDENTIFIER
        )
    ) {
        return false;
    }

    // check major version is a number
    if (isNaN(Number(sections[1]))) {
        return false;
    }

    // check minor version is a number
    if (isNaN(Number(sections[2]))) {
        return false;
    }

    // next is either not available patch version or AE or min
    if (sections.length > 3) {
        // check if it is either patch version nor AE nor min
        if (
            isNaN(Number(sections[3])) &&
            sections[3] !== ALLIANCE_EDITION_IDENTIFIER &&
            sections[3] !== MINIMAL_IDENTIFIER
        ) {
            return false;
        }
    }

    // next is either not available or AE or min
    if (sections.length > 4) {
        // check if it is either patch version nor AE nor min
        if (
            sections[4] !== ALLIANCE_EDITION_IDENTIFIER &&
            sections[4] !== MINIMAL_IDENTIFIER
        ) {
            return false;
        }
    }

    // next is either not available or min
    if (sections.length > 4) {
        // check if it is either patch version nor AE nor min
        if (sections[4] !== MINIMAL_IDENTIFIER) {
            return false;
        }
    }

    return true;
}

async function saveSingleValue(name: string, value: string) {
    const setting: SEBSettingsValue = getSingleValue(name);
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        setting.id.toString(),
        value,
        sebSettingsStore.isExam,
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
