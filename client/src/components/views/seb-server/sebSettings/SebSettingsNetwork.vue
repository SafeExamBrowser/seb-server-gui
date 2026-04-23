<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-row v-if="singleValues">
            <CheckboxSetting
                v-model="singleValues"
                name="URLFilterEnable"
                label="sebSettings.networkView.URLFilterEnable"
                :tooltip="false"
                :disabled="context.readonly"
            />
            <CheckboxSetting
                v-model="singleValues"
                name="URLFilterEnableContentFilter"
                label="sebSettings.networkView.URLFilterEnableContentFilter"
                :tooltip="false"
                :disabled="context.readonly"
            />
        </v-row>

        <!-- URL Filter Table -->
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
                            :disabled="context.readonly"
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
                        #headers="{
                            columns,
                            isSorted,
                            getSortIcon,
                            toggleSort,
                        }"
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
                            :disabled="context.readonly"
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
                :read-only="context.readonly"
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
        <v-row v-if="singleValues">
            <v-col>
                <v-row>
                    <RadioSetting
                        v-model="singleValues"
                        name="proxySettingsPolicy"
                        label="sebSettings.networkView.proxySettingsPolicy"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="ExcludeSimpleHostnames"
                        label="sebSettings.networkView.ExcludeSimpleHostnames"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <TextSetting
                        v-model="singleValues"
                        name="ExceptionsList"
                        label="sebSettings.networkView.ExceptionsList"
                        :show-label="true"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="FTPPassive"
                        label="sebSettings.networkView.FTPPassive"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
            </v-col>
            <v-col>
                <v-expansion-panels variant="accordion">
                    <v-expansion-panel title="Auto Proxy Discovers">
                        <v-expansion-panel-text>
                            <CheckboxSetting
                                v-model="singleValues"
                                name="AutoDiscoveryEnabled"
                                label="sebSettings.networkView.AutoDiscoveryEnabled"
                                :tooltip="false"
                                :disabled="context.readonly"
                            />
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel title="Automatic Proxy Configuration">
                        <v-expansion-panel-text>
                            <v-row>
                                <CheckboxSetting
                                    v-model="singleValues"
                                    name="AutoConfigurationEnabled"
                                    label="sebSettings.networkView.AutoConfigurationEnabled"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="AutoConfigurationURL"
                                    label="sebSettings.networkView.AutoConfigurationURL"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="AutoConfigurationJavaScript"
                                    label="sebSettings.networkView.AutoConfigurationJavaScript"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel title="Web Proxy (HTTP)">
                        <v-expansion-panel-text>
                            <v-row>
                                <CheckboxSetting
                                    v-model="singleValues"
                                    name="HTTPEnable"
                                    label="sebSettings.networkView.HTTPEnable"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="HTTPProxy"
                                    label="sebSettings.networkView.HTTPProxy"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <NumberSetting
                                    v-model="singleValues"
                                    name="HTTPPort"
                                    label="sebSettings.networkView.HTTPPort"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <CheckboxSetting
                                    v-model="singleValues"
                                    name="HTTPRequiresPassword"
                                    label="sebSettings.networkView.HTTPRequiresPassword"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="HTTPUsername"
                                    label="sebSettings.networkView.HTTPUsername"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="HTTPPassword"
                                    label="sebSettings.networkView.HTTPPassword"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel title="Secure Web Proxy (HTTPS)">
                        <v-expansion-panel-text>
                            <v-row>
                                <CheckboxSetting
                                    v-model="singleValues"
                                    name="HTTPSEnable"
                                    label="sebSettings.networkView.HTTPSEnable"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="HTTPSProxy"
                                    label="sebSettings.networkView.HTTPSProxy"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <NumberSetting
                                    v-model="singleValues"
                                    name="HTTPSPort"
                                    label="sebSettings.networkView.HTTPSPort"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <CheckboxSetting
                                    v-model="singleValues"
                                    name="HTTPSRequiresPassword"
                                    label="sebSettings.networkView.HTTPSRequiresPassword"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="HTTPSUsername"
                                    label="sebSettings.networkView.HTTPSUsername"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="HTTPSPassword"
                                    label="sebSettings.networkView.HTTPSPassword"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel title="FTP Proxy">
                        <v-expansion-panel-text>
                            <v-row>
                                <CheckboxSetting
                                    v-model="singleValues"
                                    name="FTPEnable"
                                    label="sebSettings.networkView.FTPEnable"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="FTPProxy"
                                    label="sebSettings.networkView.FTPProxy"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <NumberSetting
                                    v-model="singleValues"
                                    name="FTPPort"
                                    label="sebSettings.networkView.FTPPort"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <CheckboxSetting
                                    v-model="singleValues"
                                    name="FTPRequiresPassword"
                                    label="sebSettings.networkView.FTPRequiresPassword"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="FTPUsername"
                                    label="sebSettings.networkView.FTPUsername"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="FTPPassword"
                                    label="sebSettings.networkView.FTPPassword"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel title="SOCKS Proxy">
                        <v-expansion-panel-text>
                            <v-row>
                                <CheckboxSetting
                                    v-model="singleValues"
                                    name="SOCKSEnable"
                                    label="sebSettings.networkView.SOCKSEnable"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="SOCKSProxy"
                                    label="sebSettings.networkView.SOCKSProxy"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <NumberSetting
                                    v-model="singleValues"
                                    name="SOCKSPort"
                                    label="sebSettings.networkView.SOCKSPort"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <CheckboxSetting
                                    v-model="singleValues"
                                    name="SOCKSRequiresPassword"
                                    label="sebSettings.networkView.SOCKSRequiresPassword"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="SOCKSUsername"
                                    label="sebSettings.networkView.SOCKSUsername"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="SOCKSPassword"
                                    label="sebSettings.networkView.SOCKSPassword"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel title="Streaming Proxy (RTSP)">
                        <v-expansion-panel-text>
                            <v-row>
                                <CheckboxSetting
                                    v-model="singleValues"
                                    name="RTSPEnable"
                                    label="sebSettings.networkView.RTSPEnable"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="RTSPProxy"
                                    label="sebSettings.networkView.RTSPProxy"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <NumberSetting
                                    v-model="singleValues"
                                    name="RTSPPort"
                                    label="sebSettings.networkView.RTSPPort"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <CheckboxSetting
                                    v-model="singleValues"
                                    name="RTSPRequiresPassword"
                                    label="sebSettings.networkView.RTSPRequiresPassword"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="RTSPUsername"
                                    label="sebSettings.networkView.RTSPUsername"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                            <v-row>
                                <TextSetting
                                    v-model="singleValues"
                                    name="RTSPPassword"
                                    label="sebSettings.networkView.RTSPPassword"
                                    :show-label="true"
                                    :tooltip="false"
                                    :disabled="context.readonly"
                                />
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import * as sebSettingsService from "@/services/seb-server/sebSettingsService";
import { stringToBoolean, translate } from "@/utils/generalUtils";
import { ref, watch } from "vue";
import {
    SEBSettingsTableRowValues,
    SEBSettingsValue,
    URLFilterRule,
} from "@/models/seb-server/sebSettings";
import EditURLFilterRule from "@/components/views/seb-server/sebSettings/components/tableDialogs/EditURLFilterRule.vue";

import { useI18n } from "vue-i18n";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import RadioSetting from "./components/inputFields/RadioSetting.vue";
import TextSetting from "./components/inputFields/TextSetting.vue";
import NumberSetting from "./components/inputFields/NumberSetting.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues";
import { SEBSettingsContext } from "./types";

const i18n = useI18n();

const props = defineProps<{
    context: SEBSettingsContext;
}>();

const {
    singleValues,
    tableValues,
    loadingSebSettingsView,
    errorSebSettingsView,
} = useSEBSettingValues(
    props.context.isExam,
    props.context.containerId,
    ViewType.NETWORK,
);

watch(tableValues, () => {
    if (!tableValues.value) return;

    const urlFilterRules = tableValues.value.tableValues.get("URLFilterRules");
    if (!urlFilterRules) return;

    updateURLFilterRulesTable(urlFilterRules);
});

// url filter
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
        await sebSettingsService.deleteTableRow(
            props.context.containerId,
            "URLFilterRules",
            index,
            props.context.isExam,
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

    if (!tableValues.value) return;
    if (!apply || selectedURLFilterRule.value == null) {
        return;
    }

    if (selectedURLFilterRule.value?.index === -1) {
        const resp: SEBSettingsTableRowValues | null =
            await sebSettingsService.addTableRow(
                props.context.containerId,
                "URLFilterRules",
                props.context.isExam,
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

    tableValues.value.saveTableRow([
        {
            id: selectedURLFilterRule.value.ids.active,
            value: selectedURLFilterRule.value.active ? "true" : "false",
        },
        {
            id: selectedURLFilterRule.value.ids.regex,
            value: selectedURLFilterRule.value.regex ? "true" : "false",
        },
        {
            id: selectedURLFilterRule.value.ids.expression,
            value: selectedURLFilterRule.value.expression,
        },
        {
            id: selectedURLFilterRule.value.ids.action,
            value: selectedURLFilterRule.value.action,
        },
    ]);

    urlFilterTable.value[selectedURLFilterRule.value.index] =
        selectedURLFilterRule.value;
}

function getStringValue(
    rowVals: Map<string, SEBSettingsValue>,
    name: string,
): string {
    const prop = rowVals.get(name);
    if (!prop) {
        const def = singleValues.value?.attributes.get(name);
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
        const def = singleValues.value?.attributes.get(name);
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
</script>
