<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-row v-if="singleValues">
            <v-col>
                <!-- URL Filter Table -->
                <v-row>
                    <v-col class="font-weight-bold pt-8 pb-0">
                        <v-row>
                            <v-col>{{
                                translate(
                                    "sebSettings.networkView.filterGroupTitle",
                                )
                            }}</v-col>
                            <v-col align="right">
                                <v-btn
                                    v-if="urlFilterRuleTable"
                                    color="primary"
                                    density="compact"
                                    :disabled="context.readonly"
                                    icon="mdi-plus-circle-outline"
                                    variant="text"
                                    @click="urlFilterRuleTable.newRow()"
                                >
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-divider
                            class="border-opacity-25"
                            :thickness="5"
                        ></v-divider>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-row>
                            <CheckboxSetting
                                ref="URLFilterEnable"
                                v-model="singleValues"
                                name="URLFilterEnable"
                                label="sebSettings.networkView.URLFilterEnable"
                                :tooltip="false"
                                :disabled="context.readonly"
                            />
                        </v-row>
                        <v-row>
                            <CheckboxSetting
                                v-model="singleValues"
                                name="URLFilterEnableContentFilter"
                                label="sebSettings.networkView.URLFilterEnableContentFilter"
                                :tooltip="false"
                                :disabled="context.readonly"
                            />
                        </v-row>
                        <v-row>
                            <SelectionSetting
                                v-model="singleValues"
                                name="URLFilterMessage"
                                label="sebSettings.networkView.URLFilterMessage"
                                :labels="true"
                                :tooltip="true"
                                :disabled="
                                    context.readonly ||
                                    !URLFilterEnableRef?.boolVal
                                "
                            />
                        </v-row>
                    </v-col>
                    <v-col>
                        <v-data-table
                            v-if="urlFilterRuleTable"
                            class="rounded-lg elevation-2"
                            density="compact"
                            :headers="tableHeaders"
                            item-value="id"
                            :items="urlFilterRuleTable.table.value"
                            :items-per-page="tableUtils.defaultPageItems"
                            :items-per-page-options="
                                tableUtils.itemsPerPageOptions
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
                                    :header-refs-prop="HeaderRefs"
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
                                    @click="
                                        urlFilterRuleTable.editRow(item.index)
                                    "
                                >
                                </v-btn>
                            </template>

                            <!-------delete button------->
                            <template #item.delete="{ item }">
                                <v-btn
                                    :disabled="context.readonly"
                                    icon="mdi-delete-outline"
                                    variant="text"
                                    @click="
                                        urlFilterRuleTable.deleteRow(
                                            item.index!,
                                        )
                                    "
                                >
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

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
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="pinEmbeddedCertificates"
                        label="sebSettings.networkView.pinEmbeddedCertificates"
                        :tooltip="true"
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
                                    :min="0"
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
                                    :min="0"
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
                                    :min="0"
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
                                    :min="0"
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
                                    :min="0"
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

        <!-----------edit url filter dialog---------->
        <v-dialog
            v-if="urlFilterRuleTable"
            v-model="urlFilterRuleTable.dialog.value"
            max-width="800"
        >
            <EditURLFilterRule
                :read-only="context.readonly"
                :url-filter-rule="urlFilterRuleTable.selectedRow.value"
                @close-edit-u-r-l-filter-rule="urlFilterRuleTable.closeDialog"
            >
            </EditURLFilterRule>
        </v-dialog>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import * as tableUtils from "@/utils/table/tableUtils.ts";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import { translate } from "@/utils/generalUtils.ts";
import { useI18n } from "vue-i18n";
import { ViewType } from "@/models/seb-server/sebSettingsEnums.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import RadioSetting from "./components/inputFields/RadioSetting.vue";
import TextSetting from "./components/inputFields/TextSetting.vue";
import NumberSetting from "./components/inputFields/NumberSetting.vue";
import SelectionSetting from "./components/inputFields/SelectionSetting.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues.ts";
import { SEBSettingsContext } from "./types.ts";
import EditURLFilterRule from "./components/tableDialogs/EditURLFilterRule.vue";
import {
    HeaderRefs,
    useURLFilterRuleTable,
} from "./composables/useURLFilterTable.ts";
import { useTemplateRef } from "vue";

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

const { urlFilterRuleTable, tableHeaders } = useURLFilterRuleTable(
    tableValues,
    singleValues,
);

const URLFilterEnableRef = useTemplateRef("URLFilterEnable");
</script>
