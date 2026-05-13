<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-row v-if="singleValues" max-width="300">
            <CheckboxSetting
                v-model="singleValues"
                name="allowSwitchToApplications"
                label="sebSettings.applicationView.allowSwitchToApplications"
                :tooltip="true"
                :disabled="context.readonly"
            />
        </v-row>

        <!--Permitted Process Table -->
        <v-row>
            <v-col class="font-weight-bold pt-8 pb-0">
                <v-row>
                    <v-col>{{
                        translate(
                            "sebSettings.applicationView.permittedProcess.settingName",
                        )
                    }}</v-col>
                    <v-col align="right">
                        <v-btn
                            v-if="permittedProcessTable"
                            color="primary"
                            density="compact"
                            :disabled="context.readonly"
                            icon="mdi-plus-circle-outline"
                            variant="text"
                            @click="permittedProcessTable.newRow()"
                        >
                        </v-btn>
                    </v-col>
                </v-row>
                <v-divider class="border-opacity-25" :thickness="5"></v-divider>
            </v-col>
        </v-row>
        <v-row v-if="singleValues" max-width="300">
            <CheckboxSetting
                v-model="singleValues"
                name="allowOpenAndSavePanel"
                label="sebSettings.applicationView.permittedProcess.allowOpenAndSavePanel"
                :tooltip="true"
                :disabled="context.readonly"
            />
            <CheckboxSetting
                v-model="singleValues"
                name="allowShareSheet"
                label="sebSettings.applicationView.permittedProcess.allowShareSheet"
                :tooltip="true"
                :disabled="context.readonly"
            />
        </v-row>

        <v-row>
            <v-col>
                <v-data-table
                    v-if="permittedProcessTable"
                    class="rounded-lg elevation-4"
                    density="compact"
                    :headers="permittedProcessTableHeaders"
                    item-value="id"
                    :items="permittedProcessTable.table.value"
                    :items-per-page="tableUtils.defaultPageItems"
                    :items-per-page-options="tableUtils.itemsPerPageOptions"
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
                            :header-refs-prop="PermittedProcessTableHeaderRefs"
                            :is-sorted="isSorted"
                            :toggle-sort="toggleSort"
                        >
                        </TableHeaders>
                    </template>

                    <!-------active hook------->
                    <template #item.active="{ item }">
                        {{ translate("general." + item.active, i18n) }}
                    </template>

                    <!-------OS hook------->
                    <template #item.os="{ item }">
                        {{
                            translate(
                                "sebSettings.applicationView.prohibitedProcess.os_" +
                                    item.os,
                                i18n,
                            )
                        }}
                    </template>

                    <!-------edit button------->
                    <template #item.edit="{ item }">
                        <v-btn
                            icon="mdi-pencil-outline"
                            variant="text"
                            @click="permittedProcessTable.editRow(item.index)"
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
                                permittedProcessTable.deleteRow(item.index!)
                            "
                        >
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <!-----------edit permitted process dialog---------->
        <v-dialog
            v-if="permittedProcessTable"
            v-model="permittedProcessTable.dialog.value"
            max-width="800"
        >
            <EditPermittedProcess
                :permitted-process="permittedProcessTable.selectedRow.value"
                :read-only="context.readonly"
                @close-edit-permitted-process="
                    permittedProcessTable.closeDialog
                "
            >
            </EditPermittedProcess>
        </v-dialog>

        <!--Prohibited Process Table -->
        <v-row>
            <v-col class="font-weight-bold pt-8 pb-0">
                <v-row>
                    <v-col>{{
                        translate(
                            "sebSettings.applicationView.prohibitedProcess.settingName",
                        )
                    }}</v-col>
                    <v-col align="right">
                        <v-btn
                            v-if="prohibitedProcessTable"
                            color="primary"
                            density="compact"
                            :disabled="context.readonly"
                            icon="mdi-plus-circle-outline"
                            variant="text"
                            @click="prohibitedProcessTable.newRow()"
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
                    v-if="prohibitedProcessTable"
                    class="rounded-lg elevation-4"
                    density="compact"
                    :headers="prohibitedProcessTableHeaders"
                    item-value="id"
                    :items="prohibitedProcessTable.table.value"
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
                            :header-refs-prop="ProhibitedProcessTableHeaderRefs"
                            :is-sorted="isSorted"
                            :toggle-sort="toggleSort"
                        >
                        </TableHeaders>
                    </template>

                    <!-------active hook------->
                    <template #item.active="{ item }">
                        {{ translate("general." + item.active, i18n) }}
                    </template>

                    <!-------OS hook------->
                    <template #item.os="{ item }">
                        {{
                            translate(
                                "sebSettings.applicationView.permittedProcess.os_" +
                                    item.os,
                                i18n,
                            )
                        }}
                    </template>

                    <!-------edit button------->
                    <template #item.edit="{ item }">
                        <v-btn
                            icon="mdi-pencil-outline"
                            variant="text"
                            @click="prohibitedProcessTable.editRow(item.index)"
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
                                prohibitedProcessTable.deleteRow(item.index!)
                            "
                        >
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <!-----------edit prohibited process dialog---------->
        <v-dialog
            v-if="prohibitedProcessTable"
            v-model="prohibitedProcessTable.dialog.value"
            max-width="800"
        >
            <EditProhibitedProcess
                :prohibited-process="prohibitedProcessTable.selectedRow.value"
                :read-only="context.readonly"
                @close-edit-prohibited-process="
                    prohibitedProcessTable.closeDialog
                "
            >
            </EditProhibitedProcess>
        </v-dialog>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import * as tableUtils from "@/utils/table/tableUtils.ts";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils.ts";
import EditPermittedProcess from "@/components/widgets/sebSettings/components/tableDialogs/EditPermittedProcess.vue";
import EditProhibitedProcess from "@/components/widgets/sebSettings/components/tableDialogs/EditProhibitedProcess.vue";
import { ViewType } from "@/models/seb-server/sebSettingsEnums.ts";
import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { SEBSettingsContext } from "./types.ts";
import {
    usePermittedProcessTable,
    PermittedProcessTableHeaderRefs,
} from "./composables/usePermittedProcessTable.ts";
import {
    useProhibitedProcessTable,
    ProhibitedProcessTableHeaderRefs,
} from "./composables/useProhibitedProcessTable.ts";

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
    ViewType.APPLICATION,
);

const { permittedProcessTable, tableHeaders: permittedProcessTableHeaders } =
    usePermittedProcessTable(tableValues, singleValues);

const { prohibitedProcessTable, tableHeaders: prohibitedProcessTableHeaders } =
    useProhibitedProcessTable(tableValues, singleValues);
</script>
