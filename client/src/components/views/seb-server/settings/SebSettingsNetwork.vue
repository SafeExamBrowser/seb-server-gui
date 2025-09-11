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
                <v-expansion-panel title="Auto Proxy Discovers"
                    ><v-expansion-panel-text
                        >Some Form</v-expansion-panel-text
                    ></v-expansion-panel
                >
                <v-expansion-panel title="Automatic Proxy Configuration"
                    ><v-expansion-panel-text
                        >Some Form</v-expansion-panel-text
                    ></v-expansion-panel
                >
                <v-expansion-panel title="Web Proxy (HTTP)"
                    ><v-expansion-panel-text
                        >Some Form</v-expansion-panel-text
                    ></v-expansion-panel
                >
                <v-expansion-panel title="Secure Web Proxy (HTTPS)"
                    ><v-expansion-panel-text
                        >Some Form</v-expansion-panel-text
                    ></v-expansion-panel
                >
                <v-expansion-panel title="FTP Proxy"
                    ><v-expansion-panel-text
                        >Some Form</v-expansion-panel-text
                    ></v-expansion-panel
                >
                <v-expansion-panel title="SOCKS Proxy"
                    ><v-expansion-panel-text
                        >Some Form</v-expansion-panel-text
                    ></v-expansion-panel
                >
                <v-expansion-panel title="Streaming Proxy (RTSP)"
                    ><v-expansion-panel-text
                        >Some Form</v-expansion-panel-text
                    ></v-expansion-panel
                >
            </v-expansion-panels>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";

const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

// single attributes
const urlFilterEnableVal = ref<boolean>(false);
const urlFilterEnableContentFilterVal = ref<boolean>(false);

// single selection or radio button
const proxySettingsPolicyVal = ref<string>("0");
const ExcludeSimpleHostnamesVal = ref<boolean>(false);
const ExceptionsListVal = ref<string>("");
const FTPPassiveVal = ref<boolean>(false);

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

// TODO apply readonly according to user privileges
let componentId: string;
let urlFilterEnable: SEBSettingsValue;
let urlFilterEnableContentFilter: SEBSettingsValue;

let proxySettingsPolicy: SEBSettingsValue;
let ExcludeSimpleHostnames: SEBSettingsValue;
let ExceptionsList: SEBSettingsValue;
let FTPPassive: SEBSettingsValue;

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
    const singleValues: Map<String, SEBSettingsValue> = new Map<
        String,
        SEBSettingsValue
    >(Object.entries(settingsView.singleValues));
    const proxyValues: Map<String, SEBSettingsValue> = new Map<
        String,
        SEBSettingsValue
    >(Object.entries(tableValues.get("proxies")![0].rowValues));

    urlFilterEnable = singleValues.get("URLFilterEnable")!;
    urlFilterEnableContentFilter = singleValues.get(
        "URLFilterEnableContentFilter",
    )!;
    urlFilterEnableVal.value = urlFilterEnable.value === "true";
    urlFilterEnableContentFilterVal.value =
        urlFilterEnableContentFilter.value === "true";

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
    ExcludeSimpleHostnamesVal.value = ExcludeSimpleHostnames.value == "true";

    ExceptionsList = proxyValues.get("ExceptionsList")!;
    ExceptionsListVal.value = ExceptionsList.value;

    FTPPassive = proxyValues.get("FTPPassive")!;
    FTPPassiveVal.value = FTPPassive.value === "true";
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
        active: rowVals.get("URLFilterRules.active")?.value! === "true",
        regex: rowVals.get("URLFilterRules.regex")?.value! === "true",
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
