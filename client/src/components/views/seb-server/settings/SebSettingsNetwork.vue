<template>
    <v-row>
        <v-col>
            <v-checkbox-btn
                v-model="urlFilterEnableVal"
                :disabled="sebSettingsStore.readonly"
                :label="translate('sebSettings.networkView.URLFilterEnable')"
                @update:model-value="
                    saveSingleValue(
                        urlFilterEnable.id,
                        urlFilterEnableVal ? 'true' : 'false',
                    )
                "
            ></v-checkbox-btn>
        </v-col>
        <v-col>
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
                        urlFilterEnableContentFilter.id,
                        urlFilterEnableContentFilterVal ? 'true' : 'false',
                    )
                "
            ></v-checkbox-btn>
        </v-col>
    </v-row>

    <v-row>
        <v-col class="text-subtitle-1">
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
            <v-divider class="border-opacity-25" :thickness="2"></v-divider>
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
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col>{{
                    translate("sebSettings.networkView.proxies")
                }}</v-col>
            </v-row>
            <v-divider class="border-opacity-25" :thickness="2"></v-divider>
        </v-col>
    </v-row>

    <!-----------Proxy settings---------->
    <v-row>
        <v-col>
            <v-row>
                <v-radio-group
                    v-model="proxySettingsPolicyVal"
                    :disabled="sebSettingsStore.readonly"
                    @update:model-value="
                        saveSingleValue(
                            proxySettingsPolicy.id,
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
            </v-row>
            <v-row>
                <v-checkbox-btn
                    v-model="ExcludeSimpleHostnamesVal"
                    :disabled="sebSettingsStore.readonly"
                    :label="
                        translate(
                            'sebSettings.networkView.ExcludeSimpleHostnames',
                        )
                    "
                    @update:model-value="
                        saveSingleValue(
                            ExcludeSimpleHostnames.id,
                            ExcludeSimpleHostnamesVal ? 'true' : 'false',
                        )
                    "
                ></v-checkbox-btn>
            </v-row>

            <v-row>
                <v-col>
                    {{ translate("sebSettings.networkView.ExceptionsList") }}
                    <v-text-field
                        v-model="ExceptionsListVal"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        single-line
                        variant="outlined"
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                ExceptionsList.id,
                                ExceptionsListVal,
                            )
                        "
                    >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-checkbox-btn
                    v-model="FTPPassiveVal"
                    :disabled="sebSettingsStore.readonly"
                    :label="translate('sebSettings.networkView.FTPPassive')"
                    @update:model-value="
                        saveSingleValue(
                            FTPPassive.id,
                            FTPPassiveVal ? 'true' : 'false',
                        )
                    "
                ></v-checkbox-btn>
            </v-row>
        </v-col>
        <v-col>
            <v-expansion-panels variant="accordion">
                <v-expansion-panel title="Auto Proxy Discovers">
                    <v-expansion-panel-text>
                        <v-checkbox-btn
                            v-model="AutoDiscoveryEnabledVal"
                            :disabled="sebSettingsStore.readonly"
                            :label="translate('sebSettings.networkView.AutoDiscoveryEnabled')"
                            @update:model-value="saveSingleValue(AutoDiscoveryEnabled.id, AutoDiscoveryEnabledVal ? 'true' : 'false')"
                        ></v-checkbox-btn>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="Automatic Proxy Configuration">
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col>
                                <v-checkbox-btn
                                    v-model="AutoConfigurationEnabledVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="translate('sebSettings.networkView.AutoConfigurationEnabled')"
                                    @update:model-value="saveSingleValue(AutoConfigurationEnabled.id, AutoConfigurationEnabledVal ? 'true' : 'false')"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                 {{ translate("sebSettings.networkView.AutoConfigurationURL") }}
                                <v-text-field
                                    v-model="AutoConfigurationURLVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, AutoConfigurationURL.id, AutoConfigurationURLVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                {{ translate("sebSettings.networkView.AutoConfigurationJavaScript") }}
                                <v-text-field
                                    v-model="AutoConfigurationJavaScriptVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, AutoConfigurationJavaScript.id, AutoConfigurationJavaScriptVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="Web Proxy (HTTP)">
                    <v-expansion-panel-text>
                         <v-row>
                            <v-col>
                                <v-checkbox-btn
                                    v-model="HTTPEnableVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="translate('sebSettings.networkView.HTTPEnable')"
                                    @update:model-value="saveSingleValue(HTTPEnable.id, HTTPEnableVal ? 'true' : 'false')"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                 {{ translate("sebSettings.networkView.HTTPProxy") }}
                                <v-text-field
                                    v-model="HTTPProxyVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, HTTPProxy.id, HTTPProxyVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                {{ translate("sebSettings.networkView.HTTPPort") }}
                                <v-number-input
                                    v-model="HTTPPortVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, HTTPPort.id, HTTPPortVal?.toString())"
                                >
                                </v-number-input>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-checkbox-btn
                                    v-model="HTTPRequiresPasswordVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="translate('sebSettings.networkView.HTTPRequiresPassword')"
                                    @update:model-value="saveSingleValue(HTTPRequiresPassword.id, HTTPRequiresPasswordVal ? 'true' : 'false')"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                 {{ translate("sebSettings.networkView.HTTPUsername") }}
                                <v-text-field
                                    v-model="HTTPUsernameVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, HTTPUsername.id, HTTPUsernameVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                {{ translate("sebSettings.networkView.HTTPPassword") }}
                                <v-text-field
                                    v-model="HTTPPasswordVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, HTTPPassword.id, HTTPPasswordVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="Secure Web Proxy (HTTPS)">
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col>
                                <v-checkbox-btn
                                    v-model="HTTPSEnableVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="translate('sebSettings.networkView.HTTPSEnable')"
                                    @update:model-value="saveSingleValue(HTTPSEnable.id, HTTPSEnableVal ? 'true' : 'false')"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                 {{ translate("sebSettings.networkView.HTTPSProxy") }}
                                <v-text-field
                                    v-model="HTTPSProxyVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, HTTPSProxy.id, HTTPSProxyVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                {{ translate("sebSettings.networkView.HTTPSPort") }}
                                <v-number-input
                                    v-model="HTTPSPortVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, HTTPSPort.id, HTTPSPortVal?.toString())"
                                >
                                </v-number-input>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-checkbox-btn
                                    v-model="HTTPSRequiresPasswordVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="translate('sebSettings.networkView.HTTPSRequiresPassword')"
                                    @update:model-value="saveSingleValue(HTTPSRequiresPassword.id, HTTPSRequiresPasswordVal ? 'true' : 'false')"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                 {{ translate("sebSettings.networkView.HTTPSUsername") }}
                                <v-text-field
                                    v-model="HTTPSUsernameVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, HTTPSUsername.id, HTTPSUsernameVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                {{ translate("sebSettings.networkView.HTTPSPassword") }}
                                <v-text-field
                                    v-model="HTTPSPasswordVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, HTTPSPassword.id, HTTPSPasswordVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="FTP Proxy">
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col>
                                <v-checkbox-btn
                                    v-model="FTPEnableVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="translate('sebSettings.networkView.FTPEnable')"
                                    @update:model-value="saveSingleValue(FTPEnable.id, FTPEnableVal ? 'true' : 'false')"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                 {{ translate("sebSettings.networkView.FTPProxy") }}
                                <v-text-field
                                    v-model="FTPProxyVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, FTPProxy.id, FTPProxyVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                {{ translate("sebSettings.networkView.FTPPort") }}
                                <v-number-input
                                    v-model="FTPPortVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, FTPPort.id, FTPPortVal?.toString())"
                                >
                                </v-number-input>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-checkbox-btn
                                    v-model="FTPRequiresPasswordVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="translate('sebSettings.networkView.FTPRequiresPassword')"
                                    @update:model-value="saveSingleValue(FTPRequiresPassword.id, FTPRequiresPasswordVal ? 'true' : 'false')"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                 {{ translate("sebSettings.networkView.FTPUsername") }}
                                <v-text-field
                                    v-model="FTPUsernameVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, FTPUsername.id, FTPUsernameVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                {{ translate("sebSettings.networkView.FTPPassword") }}
                                <v-text-field
                                    v-model="FTPPasswordVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, FTPPassword.id, FTPPasswordVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="SOCKS Proxy">
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col>
                                <v-checkbox-btn
                                    v-model="SOCKSEnableVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="translate('sebSettings.networkView.SOCKSEnable')"
                                    @update:model-value="saveSingleValue(SOCKSEnable.id, SOCKSEnableVal ? 'true' : 'false')"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                 {{ translate("sebSettings.networkView.SOCKSProxy") }}
                                <v-text-field
                                    v-model="SOCKSProxyVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, SOCKSProxy.id, SOCKSProxyVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                {{ translate("sebSettings.networkView.SOCKSPort") }}
                                <v-number-input
                                    v-model="SOCKSPortVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, SOCKSPort.id, SOCKSPortVal?.toString())"
                                >
                                </v-number-input>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-checkbox-btn
                                    v-model="SOCKSRequiresPasswordVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="translate('sebSettings.networkView.SOCKSRequiresPassword')"
                                    @update:model-value="saveSingleValue(SOCKSRequiresPassword.id, SOCKSRequiresPasswordVal ? 'true' : 'false')"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                 {{ translate("sebSettings.networkView.SOCKSUsername") }}
                                <v-text-field
                                    v-model="SOCKSUsernameVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, SOCKSUsername.id, SOCKSUsernameVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                {{ translate("sebSettings.networkView.SOCKSPassword") }}
                                <v-text-field
                                    v-model="SOCKSPasswordVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, SOCKSPassword.id, SOCKSPasswordVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel title="Streaming Proxy (RTSP)">
                    <v-expansion-panel-text>
                        <v-row>
                            <v-col>
                                <v-checkbox-btn
                                    v-model="RTSPEnableVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="translate('sebSettings.networkView.RTSPEnable')"
                                    @update:model-value="saveSingleValue(RTSPEnable.id, RTSPEnableVal ? 'true' : 'false')"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                 {{ translate("sebSettings.networkView.RTSPProxy") }}
                                <v-text-field
                                    v-model="RTSPProxyVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, RTSPProxy.id, RTSPProxyVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                {{ translate("sebSettings.networkView.RTSPPort") }}
                                <v-number-input
                                    v-model="RTSPPortVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, RTSPPort.id, RTSPPortVal?.toString())"
                                >
                                </v-number-input>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-checkbox-btn
                                    v-model="RTSPRequiresPasswordVal"
                                    :disabled="sebSettingsStore.readonly"
                                    :label="translate('sebSettings.networkView.RTSPRequiresPassword')"
                                    @update:model-value="saveSingleValue(RTSPRequiresPassword.id, RTSPRequiresPasswordVal ? 'true' : 'false')"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                 {{ translate("sebSettings.networkView.RTSPUsername") }}
                                <v-text-field
                                    v-model="RTSPUsernameVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, RTSPUsername.id, RTSPUsernameVal)"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                {{ translate("sebSettings.networkView.RTSPPassword") }}
                                <v-text-field
                                    v-model="RTSPPasswordVal"
                                    density="compact"
                                    :disabled="sebSettingsStore.readonly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                    @update:focused="saveOnFocusLost($event, RTSPPassword.id, RTSPPasswordVal)"
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

const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

// ur filter single attributes
const urlFilterEnableVal = ref<boolean>(false);
const urlFilterEnableContentFilterVal = ref<boolean>(false);

// url filter
const editURLFilterRuleDialog = ref<boolean>(false);
const selectedURLFilterRule = ref<URLFilterRule | null>(null);
const urlFilterHeadersRef = ref<any[]>();
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
const AutoConfigurationJavaScriptVal= ref<string>("");

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


let urlFilterEnable: SEBSettingsValue;
let urlFilterEnableContentFilter: SEBSettingsValue;

let proxySettingsPolicy: SEBSettingsValue;
let ExcludeSimpleHostnames: SEBSettingsValue;
let ExceptionsList: SEBSettingsValue;
let FTPPassive: SEBSettingsValue;

let AutoDiscoveryEnabled: SEBSettingsValue;

let AutoConfigurationEnabled: SEBSettingsValue;
let AutoConfigurationURL: SEBSettingsValue;
let AutoConfigurationJavaScript: SEBSettingsValue;

let HTTPEnable: SEBSettingsValue;
let HTTPProxy: SEBSettingsValue;
let HTTPPort: SEBSettingsValue;
let HTTPRequiresPassword: SEBSettingsValue;
let HTTPUsername: SEBSettingsValue;
let HTTPPassword: SEBSettingsValue;

let HTTPSEnable: SEBSettingsValue;
let HTTPSProxy: SEBSettingsValue;
let HTTPSPort: SEBSettingsValue;
let HTTPSRequiresPassword: SEBSettingsValue;
let HTTPSUsername: SEBSettingsValue;
let HTTPSPassword: SEBSettingsValue;

let FTPEnable: SEBSettingsValue;
let FTPProxy: SEBSettingsValue;
let FTPPort: SEBSettingsValue;
let FTPRequiresPassword: SEBSettingsValue;
let FTPUsername: SEBSettingsValue;
let FTPPassword: SEBSettingsValue;

let SOCKSEnable: SEBSettingsValue;
let SOCKSProxy: SEBSettingsValue;
let SOCKSPort: SEBSettingsValue;
let SOCKSRequiresPassword: SEBSettingsValue;
let SOCKSUsername: SEBSettingsValue;
let SOCKSPassword: SEBSettingsValue;

let RTSPEnable: SEBSettingsValue;
let RTSPProxy: SEBSettingsValue;
let RTSPPort: SEBSettingsValue;
let RTSPRequiresPassword: SEBSettingsValue;
let RTSPUsername: SEBSettingsValue;
let RTSPPassword: SEBSettingsValue;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const applicationSettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.NETWORK,
            componentId,
            sebSettingsStore.isExam,
        );
    if (applicationSettings == null) {
        return;
    }

    if (sebSettingsStore.readonly) {
        urlFilterHeaders.value[4].title = translate("general.viewButton", i18n);
    }

    const settingsView: SEBSettingsView = applicationSettings;
    const tableValues: Map<string, SEBSettingsTableRowValues[]> = new Map<
        string,
        SEBSettingsTableRowValues[]
    >(Object.entries(settingsView.tableValues));

    const singleValues:  Map<string, SEBSettingsValue> = new Map<
        string,
        SEBSettingsValue
    >(Object.entries(settingsView.singleValues));

    const proxyValues: Map<string, SEBSettingsValue> = new Map<
        string,
        SEBSettingsValue
    >(Object.entries(tableValues.get("proxies")![0].rowValues));

    urlFilterEnable = singleValues.get("URLFilterEnable")!;
    urlFilterEnableContentFilter = singleValues.get("URLFilterEnableContentFilter")!;
    urlFilterEnableVal.value = stringToBoolean(urlFilterEnable.value);
    urlFilterEnableContentFilterVal.value = stringToBoolean(urlFilterEnableContentFilter.value);

    // URL Filter
    const urlFilterRules = tableValues.get("URLFilterRules");
    if (urlFilterRules == null) {
        return;
    }

    updateURLFilterRulesTable(urlFilterRules);

    // Proxy single settings
    proxySettingsPolicy = singleValues.get("proxySettingsPolicy")!;
    proxySettingsPolicyVal.value = proxySettingsPolicy.value;

    ExcludeSimpleHostnames = proxyValues.get("ExcludeSimpleHostnames")!;
    ExcludeSimpleHostnamesVal.value = stringToBoolean(ExcludeSimpleHostnames.value);

    ExceptionsList = proxyValues.get("ExceptionsList")!;
    ExceptionsListVal.value = ExceptionsList.value;

    FTPPassive = proxyValues.get("FTPPassive")!;
    FTPPassiveVal.value = stringToBoolean(FTPPassive.value);

    // Proxy realm settings -- auto discovery
    AutoDiscoveryEnabled = proxyValues.get("ExceptionsList")!;
    AutoDiscoveryEnabledVal.value = stringToBoolean(AutoDiscoveryEnabled.value);

    AutoConfigurationEnabled = proxyValues.get("AutoConfigurationEnabled")!;
    AutoConfigurationURL = proxyValues.get("AutoConfigurationURL")!;
    AutoConfigurationJavaScript = proxyValues.get("AutoConfigurationJavaScript")!;
    AutoConfigurationEnabledVal.value = stringToBoolean(AutoConfigurationEnabled.value);
    AutoConfigurationURLVal.value = AutoConfigurationURL.value;
    AutoConfigurationJavaScriptVal.value = AutoConfigurationJavaScript.value;

    HTTPEnable = proxyValues.get("HTTPEnable")!;
    HTTPProxy = proxyValues.get("HTTPProxy")!;
    HTTPPort = proxyValues.get("HTTPPort")!;
    HTTPRequiresPassword = proxyValues.get("HTTPRequiresPassword")!;
    HTTPUsername = proxyValues.get("HTTPUsername")!;
    HTTPPassword = proxyValues.get("HTTPPassword")!;
    HTTPEnableVal.value = stringToBoolean(HTTPEnable.value);
    HTTPProxyVal.value = HTTPProxy.value;
    HTTPPortVal.value = parseInt(HTTPPort.value);
    HTTPRequiresPasswordVal.value = stringToBoolean(HTTPRequiresPassword.value);
    HTTPUsernameVal.value = HTTPUsername.value;
    HTTPPasswordVal.value = HTTPPassword.value;

    HTTPSEnable = proxyValues.get("HTTPSEnable")!;
    HTTPSProxy = proxyValues.get("HTTPSProxy")!;
    HTTPSPort = proxyValues.get("HTTPSPort")!;
    HTTPSRequiresPassword = proxyValues.get("HTTPSRequiresPassword")!;
    HTTPSUsername = proxyValues.get("HTTPSUsername")!;
    HTTPSPassword = proxyValues.get("HTTPSPassword")!;
    HTTPSEnableVal.value = stringToBoolean(HTTPSEnable.value);
    HTTPSProxyVal.value = HTTPSProxy.value;
    HTTPSPortVal.value = parseInt(HTTPSPort.value);
    HTTPSRequiresPasswordVal.value = stringToBoolean(HTTPSRequiresPassword.value);
    HTTPSUsernameVal.value = HTTPSUsername.value;
    HTTPSPasswordVal.value = HTTPSPassword.value;

    FTPEnable = proxyValues.get("FTPEnable")!;
    FTPProxy = proxyValues.get("FTPProxy")!;
    FTPPort = proxyValues.get("FTPPort")!;
    FTPRequiresPassword = proxyValues.get("FTPRequiresPassword")!;
    FTPUsername = proxyValues.get("FTPUsername")!;
    FTPPassword = proxyValues.get("FTPPassword")!;
    FTPEnableVal.value = stringToBoolean(FTPEnable.value);
    FTPProxyVal.value = FTPProxy.value;
    FTPPortVal.value = parseInt(FTPPort.value);
    FTPRequiresPasswordVal.value = stringToBoolean(FTPRequiresPassword.value);
    FTPUsernameVal.value = FTPUsername.value;
    FTPPasswordVal.value = FTPPassword.value;

    SOCKSEnable = proxyValues.get("SOCKSEnable")!;
    SOCKSProxy = proxyValues.get("SOCKSProxy")!;
    SOCKSPort = proxyValues.get("SOCKSPort")!;
    SOCKSRequiresPassword = proxyValues.get("SOCKSRequiresPassword")!;
    SOCKSUsername = proxyValues.get("SOCKSUsername")!;
    SOCKSPassword = proxyValues.get("SOCKSPassword")!;
    SOCKSEnableVal.value = stringToBoolean(SOCKSEnable.value);
    SOCKSProxyVal.value = SOCKSProxy.value;
    SOCKSPortVal.value = parseInt(SOCKSPort.value);
    SOCKSRequiresPasswordVal.value = stringToBoolean(SOCKSRequiresPassword.value);
    SOCKSUsernameVal.value = SOCKSUsername.value;
    SOCKSPasswordVal.value = SOCKSPassword.value;

    RTSPEnable = proxyValues.get("RTSPEnable")!;
    RTSPProxy = proxyValues.get("RTSPProxy")!;
    RTSPPort = proxyValues.get("RTSPPort")!;
    RTSPRequiresPassword = proxyValues.get("RTSPRequiresPassword")!;
    RTSPUsername = proxyValues.get("RTSPUsername")!;
    RTSPPassword = proxyValues.get("RTSPPassword")!;
    RTSPEnableVal.value = stringToBoolean(RTSPEnable.value);
    RTSPProxyVal.value = RTSPProxy.value;
    RTSPPortVal.value = parseInt(RTSPPort.value);
    RTSPRequiresPasswordVal.value = stringToBoolean(RTSPRequiresPassword.value);
    RTSPUsernameVal.value = RTSPUsername.value;
    RTSPPasswordVal.value = RTSPPassword.value;

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
        active: stringToBoolean(rowVals.get("URLFilterRules.active")?.value!),
        regex: stringToBoolean(rowVals.get("URLFilterRules.regex")?.value!),
        expression: rowVals.get("URLFilterRules.expression")!.value,
        action: rowVals.get("URLFilterRules.action")!.value,
        ids: {
            active: rowVals.get("URLFilterRules.active")!.id,
            regex: rowVals.get("URLFilterRules.regex")!.id,
            expression: rowVals.get("URLFilterRules.expression")!.id,
            action: rowVals.get("URLFilterRules.action")!.id,
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
            sebSettingsStore.isExam,
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
                sebSettingsStore.isExam,
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
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedURLFilterRule.value.ids.regex.toString(),
        selectedURLFilterRule.value.regex ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedURLFilterRule.value.ids.expression.toString(),
        selectedURLFilterRule.value.expression,
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedURLFilterRule.value.ids.action.toString(),
        selectedURLFilterRule.value.action,
        sebSettingsStore.isExam,
    );

    urlFilterTable.value[selectedURLFilterRule.value.index] =
        selectedURLFilterRule.value;
}

async function saveSingleValue(valId: number, value: string) {
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        valId.toString(),
        value,
        sebSettingsStore.isExam,
    );
}

async function saveOnFocusLost(focusIn: boolean, valId: number, value: string) {
    if (!focusIn) {
        saveSingleValue(valId, value);
    }
}
</script>
