<template>
    <v-row>
        <v-col class="pt-5 pb-0">
            <v-checkbox-btn
                v-model="urlFilterEnableVal"
                :disabled="sebSettingsStore.readonly"
                :label="translate('sebSettings.networkView.URLFilterEnable')"
                @update:model-value="
                    saveSingleValue(
                        'URLFilterEnable',
                        urlFilterEnableVal ? 'true' : 'false',
                    )
                "
            ></v-checkbox-btn>
        </v-col>
        <v-col class="pt-5 pb-0">
            <v-checkbox-btn
                v-model="urlFilterEnableContentFilterVal"
                :disabled="sebSettingsStore.readonly"
                :label="
                    translate(
                        'sebSettings.networkView.URLFilterEnableContentFilter',
                    )
                "
                @update:model-value="
                    saveSingleValue(
                        'URLFilterEnableContentFilter',
                        urlFilterEnableContentFilterVal ? 'true' : 'false',
                    )
                "
            ></v-checkbox-btn>
        </v-col>
    </v-row>

    <v-row>
        <v-col class="font-weight-bold pt-8 pb-0">
            <v-row>
                <v-col>{{
                    translate("sebSettings.networkView.filterGroupTitle")
                }}</v-col>
                <v-col align="right">
                    <v-btn
                        color="primary"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        icon="mdi-plus-circle-outline"
                        variant="text"
                        @click="newURLFilterRule()"
                    >
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider class="border-opacity-25" :thickness="5"></v-divider>
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <v-data-table
                class="rounded-lg elevation-4"
                density="compact"
                :headers="urlFilterHeaders"
                item-value="id"
                :items="urlFilterTable"
                :items-per-page="
                    tableUtils.calcDefaultItemsPerPage(urlFilterTable)
                "
                :items-per-page-options="
                    tableUtils.calcItemsPerPage(urlFilterTable)
                "
            >
                <template
                    #headers="{ columns, isSorted, getSortIcon, toggleSort }"
                >
                    <TableHeaders
                        :columns="columns"
                        :get-sort-icon="getSortIcon"
                        :header-refs-prop="urlFilterHeadersRef"
                        :is-sorted="isSorted"
                        :toggle-sort="toggleSort"
                    >
                    </TableHeaders>
                </template>

                <!-------active hook------->
                <template #item.active="{ item }">
                    {{ translate("general." + item.active, i18n) }}
                </template>

                <!-------regex hook------->
                <template #item.regex="{ item }">
                    {{ translate("general." + item.regex, i18n) }}
                </template>

                <!-------OS hook------->
                <template #item.action="{ item }">
                    {{
                        translate(
                            "sebSettings.networkView.URLFilterRules.action_" +
                                item.action,
                            i18n,
                        )
                    }}
                </template>

                <!-------edit button------->
                <template #item.edit="{ item }">
                    <v-btn
                        icon="mdi-pencil-outline"
                        variant="text"
                        @click="urlFilterRuleOpenEditDialog(item.index)"
                    >
                    </v-btn>
                </template>

                <!-------delete button------->
                <template #item.delete="{ item }">
                    <v-btn
                        :disabled="sebSettingsStore.readonly"
                        icon="mdi-delete-outline"
                        variant="text"
                        @click="urlFilterRuleDelete(item.index!)"
                    >
                    </v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>

    <!-----------edit url filter dialog---------->
    <v-dialog v-model="editURLFilterRuleDialog" max-width="800">
        <EditURLFilterRule
            :read-only="sebSettingsStore.readonly"
            :url-filter-rule="selectedURLFilterRule"
            @close-edit-u-r-l-filter-rule="closeEditURLFilterRuleDialog"
        >
        </EditURLFilterRule>
    </v-dialog>

    <v-row>
        <v-col class="font-weight-bold pt-8 pb-0">
            <v-row>
                <v-col>{{
                    translate("sebSettings.networkView.proxies")
                }}</v-col>
            </v-row>
            <v-divider class="border-opacity-25" :thickness="5"></v-divider>
        </v-col>
    </v-row>

    <!-----------Proxy settings---------->
    <v-row>
        <v-col>
            <v-row>
                <v-col :class="sebSettingsStore.cp">
                    <v-radio-group
                        v-model="proxySettingsPolicyVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        @update:model-value="
                            saveSingleValue(
                                'proxySettingsPolicy',
                                proxySettingsPolicyVal,
                            )
                        "
                    >
                        <v-radio
                            :label="
                                translate(
                                    'sebSettings.networkView.proxySettingsPolicy.0',
                                )
                            "
                            value="0"
                        ></v-radio>
                        <v-radio
                            :label="
                                translate(
                                    'sebSettings.networkView.proxySettingsPolicy.1',
                                )
                            "
                            value="1"
                        ></v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.cp">
                    <v-checkbox-btn
                        v-model="ExcludeSimpleHostnamesVal"
                        :disabled="sebSettingsStore.readonly"
                        :label="
                            translate(
                                'sebSettings.networkView.ExcludeSimpleHostnames',
                            )
                        "
                        @update:model-value="
                            saveProxyValue(
                                'ExcludeSimpleHostnames',
                                ExcludeSimpleHostnamesVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="ExceptionsListVal"
                        density="compact"
                        :label="
                            translate('sebSettings.networkView.ExceptionsList')
                        "
                        :disabled="sebSettingsStore.readonly"
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'ExceptionsList',
                                ExceptionsListVal,
                            )
                        "
                    >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.cp">
                    <v-checkbox-btn
                        v-model="FTPPassiveVal"
                        :disabled="sebSettingsStore.readonly"
                        :label="translate('sebSettings.networkView.FTPPassive')"
                        @update:model-value="
                            saveProxyValue(
                                'FTPPassive',
                                FTPPassiveVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col>
            <v-expansion-panels variant="accordion">
                <v-expansion-panel title="Auto Proxy Discovers">
                    <v-expansion-panel-text>
                        <v-col :class="sebSettingsStore.cp">
                            <v-checkbox-btn
                                v-model="AutoDiscoveryEnabledVal"
                                :disabled="sebSettingsStore.readonly"
                                :label="
                                    translate(
                                        'sebSettings.networkView.AutoDiscoveryEnabled',
                                    )
                                "
                                @update:model-value="
                                    saveProxyValue(
                                        'AutoDiscoveryEnabled',
                                        AutoDiscoveryEnabledVal
                                            ? 'true'
                                            : 'false',
                                    )
                                "
                            ></v-checkbox-btn
                        ></v-col>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="Automatic Proxy Configuration">
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col :class="sebSettingsStore.cp">
                                <v-checkbox-btn
                                    v-model="AutoConfigurationEnabledVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.AutoConfigurationEnabled',
                                        )
                                    "
                                    @update:model-value="
                                        saveProxyValue(
                                            'AutoConfigurationEnabled',
                                            AutoConfigurationEnabledVal
                                                ? 'true'
                                                : 'false',
                                        )
                                    "
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="AutoConfigurationURLVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.AutoConfigurationURL',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'AutoConfigurationURL',
                                            AutoConfigurationURLVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="AutoConfigurationJavaScriptVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.AutoConfigurationJavaScript',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'AutoConfigurationJavaScript',
                                            AutoConfigurationJavaScriptVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="Web Proxy (HTTP)">
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col :class="sebSettingsStore.cp">
                                <v-checkbox-btn
                                    v-model="HTTPEnableVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPEnable',
                                        )
                                    "
                                    @update:model-value="
                                        saveProxyValue(
                                            'HTTPEnable',
                                            HTTPEnableVal ? 'true' : 'false',
                                        )
                                    "
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="HTTPProxyVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPProxy',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'HTTPProxy',
                                            HTTPProxyVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-number-input
                                    v-model="HTTPPortVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPPort',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:model-value="
                                        saveSingleValue(
                                            'HTTPPort',
                                            HTTPPortVal.toString(),
                                        )
                                    "
                                >
                                </v-number-input>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.cp">
                                <v-checkbox-btn
                                    v-model="HTTPRequiresPasswordVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPRequiresPassword',
                                        )
                                    "
                                    @update:model-value="
                                        saveProxyValue(
                                            'HTTPRequiresPassword',
                                            HTTPRequiresPasswordVal
                                                ? 'true'
                                                : 'false',
                                        )
                                    "
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="HTTPUsernameVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPUsername',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'HTTPUsername',
                                            HTTPUsernameVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="HTTPPasswordVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPPassword',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'HTTPPassword',
                                            HTTPPasswordVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="Secure Web Proxy (HTTPS)">
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col :class="sebSettingsStore.cp">
                                <v-checkbox-btn
                                    v-model="HTTPSEnableVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPSEnable',
                                        )
                                    "
                                    @update:model-value="
                                        saveProxyValue(
                                            'HTTPSEnable',
                                            HTTPSEnableVal ? 'true' : 'false',
                                        )
                                    "
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="HTTPSProxyVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPSProxy',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'HTTPSProxy',
                                            HTTPSProxyVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-number-input
                                    v-model="HTTPSPortVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPSPort',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:model-value="
                                        saveSingleValue(
                                            'HTTPSPort',
                                            HTTPSPortVal.toString(),
                                        )
                                    "
                                >
                                </v-number-input>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.cp">
                                <v-checkbox-btn
                                    v-model="HTTPSRequiresPasswordVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPSRequiresPassword',
                                        )
                                    "
                                    @update:model-value="
                                        saveProxyValue(
                                            'HTTPSRequiresPassword',
                                            HTTPSRequiresPasswordVal
                                                ? 'true'
                                                : 'false',
                                        )
                                    "
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="HTTPSUsernameVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPSUsername',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'HTTPSUsername',
                                            HTTPSUsernameVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="HTTPSPasswordVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.HTTPSPassword',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'HTTPSPassword',
                                            HTTPSPasswordVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="FTP Proxy">
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col :class="sebSettingsStore.cp">
                                <v-checkbox-btn
                                    v-model="FTPEnableVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.FTPEnable',
                                        )
                                    "
                                    @update:model-value="
                                        saveProxyValue(
                                            'FTPEnable',
                                            FTPEnableVal ? 'true' : 'false',
                                        )
                                    "
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="FTPProxyVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.FTPProxy',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'FTPProxy',
                                            FTPProxyVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-number-input
                                    v-model="FTPPortVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.FTPPort',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:model-value="
                                        saveSingleValue(
                                            'FTPPort',
                                            FTPPortVal.toString(),
                                        )
                                    "
                                >
                                </v-number-input>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.cp">
                                <v-checkbox-btn
                                    v-model="FTPRequiresPasswordVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.FTPRequiresPassword',
                                        )
                                    "
                                    @update:model-value="
                                        saveProxyValue(
                                            'FTPRequiresPassword',
                                            FTPRequiresPasswordVal
                                                ? 'true'
                                                : 'false',
                                        )
                                    "
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="FTPUsernameVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.FTPUsername',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'FTPUsername',
                                            FTPUsernameVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="FTPPasswordVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.FTPPassword',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'FTPPassword',
                                            FTPPasswordVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="SOCKS Proxy">
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col :class="sebSettingsStore.cp">
                                <v-checkbox-btn
                                    v-model="SOCKSEnableVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.SOCKSEnable',
                                        )
                                    "
                                    @update:model-value="
                                        saveProxyValue(
                                            'SOCKSEnable',
                                            SOCKSEnableVal ? 'true' : 'false',
                                        )
                                    "
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="SOCKSProxyVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.SOCKSProxy',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'SOCKSProxy',
                                            SOCKSProxyVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-number-input
                                    v-model="SOCKSPortVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.SOCKSPort',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:model-value="
                                        saveSingleValue(
                                            'SOCKSPort',
                                            SOCKSPortVal.toString(),
                                        )
                                    "
                                >
                                </v-number-input>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.cp">
                                <v-checkbox-btn
                                    v-model="SOCKSRequiresPasswordVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.SOCKSRequiresPassword',
                                        )
                                    "
                                    @update:model-value="
                                        saveProxyValue(
                                            'SOCKSRequiresPassword',
                                            SOCKSRequiresPasswordVal
                                                ? 'true'
                                                : 'false',
                                        )
                                    "
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="SOCKSUsernameVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.SOCKSUsername',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'SOCKSUsername',
                                            SOCKSUsernameVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="SOCKSPasswordVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.SOCKSPassword',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'SOCKSPassword',
                                            SOCKSPasswordVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="Streaming Proxy (RTSP)">
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col :class="sebSettingsStore.cp">
                                <v-checkbox-btn
                                    v-model="RTSPEnableVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.RTSPEnable',
                                        )
                                    "
                                    @update:model-value="
                                        saveProxyValue(
                                            'RTSPEnable',
                                            RTSPEnableVal ? 'true' : 'false',
                                        )
                                    "
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="RTSPProxyVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.RTSPProxy',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'RTSPProxy',
                                            RTSPProxyVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-number-input
                                    v-model="RTSPPortVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.RTSPPort',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:model-value="
                                        saveSingleValue(
                                            'RTSPPort',
                                            RTSPPortVal.toString(),
                                        )
                                    "
                                >
                                </v-number-input>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.cp">
                                <v-checkbox-btn
                                    v-model="RTSPRequiresPasswordVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.RTSPRequiresPassword',
                                        )
                                    "
                                    @update:model-value="
                                        saveProxyValue(
                                            'RTSPRequiresPassword',
                                            RTSPRequiresPasswordVal
                                                ? 'true'
                                                : 'false',
                                        )
                                    "
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="RTSPUsernameVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.RTSPUsername',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'RTSPUsername',
                                            RTSPUsernameVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col :class="sebSettingsStore.fp">
                                <v-text-field
                                    v-model="RTSPPasswordVal"
                                    density="compact"
                                    :label="
                                        translate(
                                            'sebSettings.networkView.RTSPPassword',
                                        )
                                    "
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    variant="outlined"
                                    @update:focused="
                                        saveOnFocusLost(
                                            $event,
                                            'RTSPPassword',
                                            RTSPPasswordVal,
                                        )
                                    "
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
import { useI18n } from "vue-i18n";
import { stringToBoolean, translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { ref, onBeforeMount } from "vue";
import {
    SEBSettingsTableRowValues,
    SEBSettingsValue,
    SEBSettingsView,
    URLFilterRule,
    SEBSettingAttribute,
} from "@/models/seb-server/sebSettings";
import EditURLFilterRule from "@/components/views/seb-server/settings/EditURLFilterRule.vue";

const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

// ur filter single attributes
const urlFilterEnableVal = ref<boolean>(false);
const urlFilterEnableContentFilterVal = ref<boolean>(false);

// url filter
// test commit
const editURLFilterRuleDialog = ref<boolean>(false);
const selectedURLFilterRule = ref<URLFilterRule | null>(null);
const urlFilterHeadersRef = ref<(HTMLElement | null)[]>([]);
const urlFilterTable = ref<URLFilterRule[]>([]);
const urlFilterHeaders = ref([
    {
        title: translate("sebSettings.networkView.URLFilterRules.active"),
        key: "active",
        sortable: true,
        width: "10%",
    },
    {
        title: translate("sebSettings.networkView.URLFilterRules.regex"),
        key: "regex",
        sortable: true,
        width: "10%",
    },
    {
        title: translate("sebSettings.networkView.URLFilterRules.expression"),
        key: "expression",
        sortable: true,
        width: "50%",
    },
    {
        title: translate("sebSettings.networkView.URLFilterRules.action"),
        key: "action",
        sortable: true,
        width: "30%",
    },
    {
        title: translate("general.editButton"),
        key: "edit",
        sortable: false,
        width: "5%",
        center: true,
    },
    {
        title: translate("general.deleteButton"),
        key: "delete",
        sortable: false,
        width: "5%",
        center: true,
    },
]);

// Proxy single settings
const proxySettingsPolicyVal = ref<string>("0");
const ExcludeSimpleHostnamesVal = ref<boolean>(false);
const ExceptionsListVal = ref<string>("");
const FTPPassiveVal = ref<boolean>(false);

const AutoDiscoveryEnabledVal = ref<boolean>(false);

const AutoConfigurationEnabledVal = ref<boolean>(false);
const AutoConfigurationURLVal = ref<string>("");
const AutoConfigurationJavaScriptVal = ref<string>("");

const HTTPEnableVal = ref<boolean>(false);
const HTTPProxyVal = ref<string>("");
const HTTPPortVal = ref<number>(80);
const HTTPRequiresPasswordVal = ref<boolean>(false);
const HTTPUsernameVal = ref<string>("");
const HTTPPasswordVal = ref<string>("");

const HTTPSEnableVal = ref<boolean>(false);
const HTTPSProxyVal = ref<string>("");
const HTTPSPortVal = ref<number>(443);
const HTTPSRequiresPasswordVal = ref<boolean>(false);
const HTTPSUsernameVal = ref<string>("");
const HTTPSPasswordVal = ref<string>("");

const FTPEnableVal = ref<boolean>(false);
const FTPProxyVal = ref<string>("");
const FTPPortVal = ref<number>(21);
const FTPRequiresPasswordVal = ref<boolean>(false);
const FTPUsernameVal = ref<string>("");
const FTPPasswordVal = ref<string>("");

const SOCKSEnableVal = ref<boolean>(false);
const SOCKSProxyVal = ref<string>("");
const SOCKSPortVal = ref<number>(1080);
const SOCKSRequiresPasswordVal = ref<boolean>(false);
const SOCKSUsernameVal = ref<string>("");
const SOCKSPasswordVal = ref<string>("");

const RTSPEnableVal = ref<boolean>(false);
const RTSPProxyVal = ref<string>("");
const RTSPPortVal = ref<number>(554);
const RTSPRequiresPasswordVal = ref<boolean>(false);
const RTSPUsernameVal = ref<string>("");
const RTSPPasswordVal = ref<string>("");

// the parent component identifier
let componentId: string;
let singleValues: Map<string, SEBSettingsValue>;
let attributes: Map<string, SEBSettingAttribute>;
let proxyValues: Map<string, SEBSettingsValue>;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const networkSettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(ViewType.NETWORK, componentId);
    if (networkSettings == null) {
        return;
    }

    attributes = new Map<string, SEBSettingAttribute>(
        Object.entries(networkSettings.attributes),
    );

    if (sebSettingsStore.readonly) {
        urlFilterHeaders.value[4].title = translate("general.viewButton", i18n);
    }

    const tableValues: Map<string, SEBSettingsTableRowValues[]> = new Map<
        string,
        SEBSettingsTableRowValues[]
    >(Object.entries(networkSettings.tableValues));

    singleValues = new Map<string, SEBSettingsValue>(
        Object.entries(networkSettings.singleValues),
    );

    const proxyVals = tableValues.get("proxies");
    if (!proxyVals) {
        throw new Error("No Proxy Values found");
    }
    proxyValues = new Map<string, SEBSettingsValue>(
        Object.entries(proxyVals[0].rowValues),
    );

    urlFilterEnableVal.value = stringToBoolean(
        getSingleValue("URLFilterEnable").value,
    );
    urlFilterEnableContentFilterVal.value = stringToBoolean(
        getSingleValue("URLFilterEnableContentFilter").value,
    );

    // URL Filter
    const urlFilterRules = tableValues.get("URLFilterRules");
    if (urlFilterRules == null) {
        return;
    }
    updateURLFilterRulesTable(urlFilterRules);

    // Proxy single settings
    proxySettingsPolicyVal.value = getSingleValue("proxySettingsPolicy").value;

    ExcludeSimpleHostnamesVal.value = stringToBoolean(
        getProxyValue("ExcludeSimpleHostnames").value,
    );
    ExceptionsListVal.value = getProxyValue("ExceptionsList").value;
    FTPPassiveVal.value = stringToBoolean(getProxyValue("FTPPassive").value);

    // Proxy realm settings -- auto discovery
    AutoDiscoveryEnabledVal.value = stringToBoolean(
        getProxyValue("AutoDiscoveryEnabled").value,
    );
    AutoConfigurationEnabledVal.value = stringToBoolean(
        getProxyValue("AutoConfigurationEnabled").value,
    );

    AutoConfigurationURLVal.value = getProxyValue("AutoConfigurationURL").value;
    AutoConfigurationJavaScriptVal.value = getProxyValue(
        "AutoConfigurationJavaScript",
    ).value;

    HTTPEnableVal.value = stringToBoolean(getProxyValue("HTTPEnable").value);
    HTTPProxyVal.value = getProxyValue("HTTPProxy").value;
    HTTPPortVal.value = parseInt(getProxyValue("HTTPPort").value);
    HTTPRequiresPasswordVal.value = stringToBoolean(
        getProxyValue("HTTPRequiresPassword").value,
    );
    HTTPUsernameVal.value = getProxyValue("HTTPUsername").value;
    HTTPPasswordVal.value = getProxyValue("HTTPPassword").value;

    HTTPSEnableVal.value = stringToBoolean(getProxyValue("HTTPSEnable").value);
    HTTPSProxyVal.value = getProxyValue("HTTPSProxy").value;
    HTTPSPortVal.value = parseInt(getProxyValue("HTTPSPort").value);
    HTTPSRequiresPasswordVal.value = stringToBoolean(
        getProxyValue("HTTPSRequiresPassword").value,
    );
    HTTPSUsernameVal.value = getProxyValue("HTTPSUsername").value;
    HTTPSPasswordVal.value = getProxyValue("HTTPSPassword").value;

    FTPEnableVal.value = stringToBoolean(getProxyValue("FTPEnable").value);
    FTPProxyVal.value = getProxyValue("FTPProxy").value;
    FTPPortVal.value = parseInt(getProxyValue("FTPPort").value);
    FTPRequiresPasswordVal.value = stringToBoolean(
        getProxyValue("FTPRequiresPassword").value,
    );
    FTPUsernameVal.value = getProxyValue("FTPUsername").value;
    FTPPasswordVal.value = getProxyValue("FTPPassword").value;

    SOCKSEnableVal.value = stringToBoolean(getProxyValue("SOCKSEnable").value);
    SOCKSProxyVal.value = getProxyValue("SOCKSProxy").value;
    SOCKSPortVal.value = parseInt(getProxyValue("SOCKSPort").value);
    SOCKSRequiresPasswordVal.value = stringToBoolean(
        getProxyValue("SOCKSRequiresPassword").value,
    );
    SOCKSUsernameVal.value = getProxyValue("SOCKSUsername").value;
    SOCKSPasswordVal.value = getProxyValue("SOCKSPassword").value;

    RTSPEnableVal.value = stringToBoolean(getProxyValue("RTSPEnable").value);
    RTSPProxyVal.value = getProxyValue("RTSPProxy").value;
    RTSPPortVal.value = parseInt(getProxyValue("RTSPPort").value);
    RTSPRequiresPasswordVal.value = stringToBoolean(
        getProxyValue("RTSPRequiresPassword").value,
    );
    RTSPUsernameVal.value = getProxyValue("RTSPUsername").value;
    RTSPPasswordVal.value = getProxyValue("RTSPPassword").value;
});

// ********* URL Filter Rule functions *********************
function updateURLFilterRulesTable(
    urlFilterRules: SEBSettingsTableRowValues[],
) {
    urlFilterTable.value.splice(0);
    urlFilterRules.forEach((item) => {
        const rowVals = new Map<string, SEBSettingsValue>(
            Object.entries(item.rowValues),
        );
        insertURLFilter(item.listIndex, rowVals);
    });
}

function insertURLFilter(
    index: number,
    rowVals: Map<string, SEBSettingsValue>,
) {
    urlFilterTable.value.splice(index, 0, {
        index,
        active: getBooleanValue(rowVals, "URLFilterRules.active"),
        regex: getBooleanValue(rowVals, "URLFilterRules.regex"),
        expression: getStringValue(rowVals, "URLFilterRules.expression"),
        action: getStringValue(rowVals, "URLFilterRules.action"),
        ids: {
            active: getSettingId(rowVals, "URLFilterRules.active"),
            regex: getSettingId(rowVals, "URLFilterRules.regex"),
            expression: getSettingId(rowVals, "URLFilterRules.expression"),
            action: getSettingId(rowVals, "URLFilterRules.action"),
        },
    });
}

function newURLFilterRule() {
    selectedURLFilterRule.value = {
        index: -1,
        active: true,
        regex: false,
        expression: "",
        action: "0",
        ids: { active: -1, regex: -1, expression: -1, action: -1 },
    };
    editURLFilterRuleDialog.value = true;
}

async function urlFilterRuleDelete(index: number) {
    const resp: SEBSettingsTableRowValues[] | null =
        await sebSettingsService.deleteSEBSettingTableRow(
            componentId,
            "URLFilterRules",
            index,
        );
    if (resp == null) {
        return;
    }

    updateURLFilterRulesTable(resp);
}

function urlFilterRuleOpenEditDialog(index: number) {
    selectedURLFilterRule.value = Object.assign(
        {},
        urlFilterTable.value[index],
    );
    editURLFilterRuleDialog.value = true;
}

async function closeEditURLFilterRuleDialog(apply?: boolean) {
    editURLFilterRuleDialog.value = false;

    if (!apply || selectedURLFilterRule.value == null) {
        return;
    }

    if (selectedURLFilterRule.value?.index === -1) {
        const resp: SEBSettingsTableRowValues | null =
            await sebSettingsService.newSEBSettingTableRow(
                componentId,
                "URLFilterRules",
            );
        if (resp == null) {
            return;
        }

        const rowVals = new Map<string, SEBSettingsValue>(
            Object.entries(resp.rowValues),
        );

        insertURLFilter(resp.listIndex, rowVals);
        selectedURLFilterRule.value.index = resp.listIndex;
        selectedURLFilterRule.value.ids =
            urlFilterTable.value[resp.listIndex].ids;
    }

    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedURLFilterRule.value.ids.active.toString(),
        selectedURLFilterRule.value.active ? "true" : "false",
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedURLFilterRule.value.ids.regex.toString(),
        selectedURLFilterRule.value.regex ? "true" : "false",
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedURLFilterRule.value.ids.expression.toString(),
        selectedURLFilterRule.value.expression,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedURLFilterRule.value.ids.action.toString(),
        selectedURLFilterRule.value.action,
    );

    urlFilterTable.value[selectedURLFilterRule.value.index] =
        selectedURLFilterRule.value;
}

async function saveSingleValue(name: string, value: string) {
    const setting: SEBSettingsValue = getSingleValue(name);
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        setting.id.toString(),
        value,
    );
}

async function saveProxyValue(name: string, value: string) {
    const setting: SEBSettingsValue = getProxyValue(name);
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        setting.id.toString(),
        value,
    );
}

async function saveOnFocusLost(focusIn: boolean, name: string, value: string) {
    if (!focusIn) {
        saveProxyValue(name, value);
    }
}

function getStringValue(
    rowVals: Map<string, SEBSettingsValue>,
    name: string,
): string {
    const prop = rowVals.get(name);
    if (!prop) {
        const def = attributes.get(name);
        if (!def) {
            throw new Error("No SEB Setting" + name + " found");
        } else {
            return def.defaultValue;
        }
    } else {
        return prop.value;
    }
}

function getBooleanValue(
    rowVals: Map<string, SEBSettingsValue>,
    name: string,
): boolean {
    const prop = rowVals.get(name);
    if (!prop) {
        const def = attributes.get(name);
        if (!def) {
            throw new Error("No SEB Setting" + name + " found");
        } else {
            return stringToBoolean(def.defaultValue);
        }
    } else {
        return stringToBoolean(prop.value);
    }
}

function getSettingId(
    rowVals: Map<string, SEBSettingsValue>,
    name: string,
): number {
    const prop = rowVals.get(name);
    if (!prop) {
        throw new Error("No SEB Setting" + name + " found");
    }

    return prop?.id;
}

function getSingleValue(name: string): SEBSettingsValue {
    const value = singleValues.get(name);
    if (!value) {
        throw new Error("No Single Value" + name + " found");
    }

    return value;
}

function getProxyValue(name: string): SEBSettingsValue {
    const value = proxyValues.get(name);
    if (!value) {
        throw new Error("No Single Value" + name + " found");
    }

    return value;
}
</script>
