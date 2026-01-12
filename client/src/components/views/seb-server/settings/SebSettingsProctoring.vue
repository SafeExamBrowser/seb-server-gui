<template>
    <v-row>
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{
                        translate(
                            "sebSettings.proctoring.remoteProctoringViewShow",
                        )
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="remoteProctoringViewShow"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="remoteProctoringViewShowItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'remoteProctoringViewShow',
                                remoteProctoringViewShow,
                            )
                        "
                    >
                    </v-select>
                </v-col>
            </v-row>
        </v-col>

        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{
                        translate(
                            "sebSettings.proctoring.screenProctoring.title",
                        )
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableScreenProctoring"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.proctoring.screenProctoring.enableScreenProctoring',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableScreenProctoring',
                                enableScreenProctoring ? 'true' : 'false',
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
                                "sebSettings.proctoring.screenProctoring.enableScreenProctoring_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-number-input
                        v-model="screenProctoringScreenshotMinInterval"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.proctoring.screenProctoring.screenProctoringScreenshotMinInterval',
                            )
                        "
                        :min="500"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'screenProctoringScreenshotMinInterval',
                                screenProctoringScreenshotMinInterval.toString(),
                            )
                        "
                    >
                    </v-number-input>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.proctoring.screenProctoring.screenProctoringScreenshotMinInterval_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-number-input
                        v-model="screenProctoringScreenshotMaxInterval"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.proctoring.screenProctoring.screenProctoringScreenshotMaxInterval',
                            )
                        "
                        :min="500"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'screenProctoringScreenshotMaxInterval',
                                screenProctoringScreenshotMaxInterval.toString(),
                            )
                        "
                    >
                    </v-number-input>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.proctoring.screenProctoring.screenProctoringScreenshotMaxInterval_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="screenProctoringImageFormat"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.proctoring.screenProctoring.screenProctoringImageFormat',
                            )
                        "
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="screenProctoringImageFormatItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'screenProctoringImageFormat',
                                screenProctoringImageFormat,
                            )
                        "
                    >
                    </v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="screenProctoringImageQuantization"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.proctoring.screenProctoring.screenProctoringImageQuantization',
                            )
                        "
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="screenProctoringImageQuantizationItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'screenProctoringImageQuantization',
                                screenProctoringImageQuantization,
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
                                "sebSettings.proctoring.screenProctoring.screenProctoringImageQuantization_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="screenProctoringImageDownscale"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.proctoring.screenProctoring.screenProctoringImageDownscale',
                            )
                        "
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :items="screenProctoringImageDownscaleItems"
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'screenProctoringImageDownscale',
                                screenProctoringImageDownscale,
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
                                "sebSettings.proctoring.screenProctoring.screenProctoringImageDownscale_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-number-input
                        v-model="screenProctoringCacheSize"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.proctoring.screenProctoring.screenProctoringCacheSize',
                            )
                        "
                        :min="0"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        variant="outlined"
                        @update:model-value="
                            saveSingleValue(
                                'screenProctoringCacheSize',
                                screenProctoringCacheSize.toString(),
                            )
                        "
                    >
                    </v-number-input>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.proctoring.screenProctoring.screenProctoringCacheSize_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="screenProctoringIndicateHealthAndCaching"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.proctoring.screenProctoring.screenProctoringIndicateHealthAndCaching',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'screenProctoringIndicateHealthAndCaching',
                                screenProctoringIndicateHealthAndCaching
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
                                "sebSettings.proctoring.screenProctoring.screenProctoringIndicateHealthAndCaching_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="screenProctoringMetadataURLEnabled"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.proctoring.screenProctoring.screenProctoringMetadataURLEnabled',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'screenProctoringMetadataURLEnabled',
                                screenProctoringMetadataURLEnabled
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
                                "sebSettings.proctoring.screenProctoring.screenProctoringMetadataURLEnabled_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="screenProctoringMetadataWindowTitleEnabled"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.proctoring.screenProctoring.screenProctoringMetadataWindowTitleEnabled',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'screenProctoringMetadataWindowTitleEnabled',
                                screenProctoringMetadataWindowTitleEnabled
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
                                "sebSettings.proctoring.screenProctoring.screenProctoringMetadataWindowTitleEnabled_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="screenProctoringMetadataActiveAppEnabled"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.proctoring.screenProctoring.screenProctoringMetadataActiveAppEnabled',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'screenProctoringMetadataActiveAppEnabled',
                                screenProctoringMetadataActiveAppEnabled
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
                                "sebSettings.proctoring.screenProctoring.screenProctoringMetadataActiveAppEnabled_tooltip",
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

// settings
const remoteProctoringViewShow = ref<string>("0");
const remoteProctoringViewShowItems = ref<{ title: string; value: string }[]>(
    [],
);
const enableScreenProctoring = ref<boolean>(false);
const screenProctoringScreenshotMinInterval = ref<number>(1000);
const screenProctoringScreenshotMaxInterval = ref<number>(5000);
const screenProctoringImageFormat = ref<string>("0");
const screenProctoringImageFormatItems = ref<
    { title: string; value: string }[]
>([]);
const screenProctoringImageQuantization = ref<string>("0");
const screenProctoringImageQuantizationItems = ref<
    { title: string; value: string }[]
>([]);
const screenProctoringImageDownscale = ref<string>("0");
const screenProctoringImageDownscaleItems = ref<
    { title: string; value: string }[]
>([]);
const screenProctoringMetadataURLEnabled = ref<boolean>(false);
const screenProctoringMetadataWindowTitleEnabled = ref<boolean>(false);
const screenProctoringMetadataActiveAppEnabled = ref<boolean>(false);
const screenProctoringCacheSize = ref<number>(500);
const screenProctoringIndicateHealthAndCaching = ref<boolean>(false);

// the parent component identifier
let componentId: string;
let singleValues: Map<string, SEBSettingsValue>;
let attributes: Map<string, SEBSettingAttribute>;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const proctoringSettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.PROCTORING,
            componentId,
            sebSettingsStore.isExam,
        );
    if (proctoringSettings == null) {
        return;
    }

    singleValues = new Map<string, SEBSettingsValue>(
        Object.entries(proctoringSettings.singleValues),
    );
    attributes = new Map<string, SEBSettingAttribute>(
        Object.entries(proctoringSettings.attributes),
    );

    remoteProctoringViewShow.value = getSingleValue(
        "remoteProctoringViewShow",
    ).value;
    attributes
        .get("remoteProctoringViewShow")
        ?.resources?.split(",")
        .forEach((item) => {
            remoteProctoringViewShowItems.value.push({
                title: translate(
                    "sebSettings.proctoring.remoteProctoringViewShow_" + item,
                    i18n,
                ),
                value: item,
            });
        });
    enableScreenProctoring.value = stringToBoolean(
        getSingleValue("enableScreenProctoring").value,
    );
    screenProctoringScreenshotMinInterval.value = parseInt(
        getSingleValue("screenProctoringScreenshotMinInterval").value,
    );
    screenProctoringScreenshotMaxInterval.value = parseInt(
        getSingleValue("screenProctoringScreenshotMaxInterval").value,
    );

    screenProctoringImageFormat.value = getSingleValue(
        "screenProctoringImageFormat",
    ).value;
    attributes
        .get("screenProctoringImageFormat")
        ?.resources?.split(",")
        .forEach((item) => {
            screenProctoringImageFormatItems.value.push({
                title: translate(
                    "sebSettings.proctoring.screenProctoring.screenProctoringImageFormat_" +
                        item,
                    i18n,
                ),
                value: item,
            });
        });

    screenProctoringImageQuantization.value = getSingleValue(
        "screenProctoringImageQuantization",
    ).value;
    attributes
        .get("screenProctoringImageQuantization")
        ?.resources?.split(",")
        .forEach((item) => {
            screenProctoringImageQuantizationItems.value.push({
                title: translate(
                    "sebSettings.proctoring.screenProctoring.screenProctoringImageQuantization_" +
                        item,
                    i18n,
                ),
                value: item,
            });
        });

    screenProctoringImageDownscale.value = getSingleValue(
        "screenProctoringImageDownscale",
    ).value;
    attributes
        .get("screenProctoringImageDownscale")
        ?.resources?.split(",")
        .forEach((item) => {
            screenProctoringImageDownscaleItems.value.push({
                title: translate(
                    "sebSettings.proctoring.screenProctoring.screenProctoringImageDownscale_" +
                        item.replace(".", "_"),
                    i18n,
                ),
                value: item,
            });
        });

    screenProctoringMetadataURLEnabled.value = stringToBoolean(
        getSingleValue("screenProctoringMetadataURLEnabled").value,
    );
    screenProctoringMetadataActiveAppEnabled.value = stringToBoolean(
        getSingleValue("screenProctoringMetadataActiveAppEnabled").value,
    );
    screenProctoringMetadataWindowTitleEnabled.value = stringToBoolean(
        getSingleValue("screenProctoringMetadataWindowTitleEnabled").value,
    );

    screenProctoringCacheSize.value = parseInt(
        getSingleValue("screenProctoringCacheSize").value,
    );
    screenProctoringIndicateHealthAndCaching.value = stringToBoolean(
        getSingleValue("screenProctoringIndicateHealthAndCaching").value,
    );
});

async function saveSingleValue(name: string, value: string) {
    const setting: SEBSettingsValue = getSingleValue(name);
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        setting.id.toString(),
        value,
        sebSettingsStore.isExam,
    );
}

function getSingleValue(name: string): SEBSettingsValue {
    const value = singleValues.get(name);
    if (!value) {
        throw new Error("No Single Value" + name + " found");
    }

    return value;
}
</script>
