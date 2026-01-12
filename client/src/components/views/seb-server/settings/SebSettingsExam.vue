<template>
    <v-row>
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.examView.sessionHandling.title")
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
                                "sebSettings.examView.sessionHandling.text",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    >{{
                        translate("sebSettings.examView.sessionHandling.text")
                    }}
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="examSessionClearCookiesOnStart"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.examView.sessionHandling.examSessionClearCookiesOnStart',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'examSessionClearCookiesOnStart',
                                examSessionClearCookiesOnStart
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
                        v-model="examSessionClearCookiesOnEnd"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.examView.sessionHandling.examSessionClearCookiesOnEnd',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'examSessionClearCookiesOnEnd',
                                examSessionClearCookiesOnEnd ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.examView.quitLink.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    >{{ translate("sebSettings.examView.quitLink.quitURL") }}
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="quitURL"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        :label="
                            translate(
                                'sebSettings.examView.quitLink.quitURL_title',
                            )
                        "
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost($event, 'quitURL', quitURL)
                        "
                    >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="quitURLConfirm"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.examView.quitLink.quitURLConfirm',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'quitURLConfirm',
                                quitURLConfirm ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="quitURLRestart"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.examView.quitLink.quitURLRestart',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'quitURLRestart',
                                quitURLRestart ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.examView.query.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="startURLAppendQueryParameter"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.examView.query.startURLAppendQueryParameter',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'startURLAppendQueryParameter',
                                startURLAppendQueryParameter ? 'true' : 'false',
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
                                "sebSettings.examView.query.startURLAppendQueryParameter_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-col>
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.examView.back.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="restartExamUseStartURL"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.examView.back.restartExamUseStartURL',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'restartExamUseStartURL',
                                restartExamUseStartURL ? 'true' : 'false',
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
                                "sebSettings.examView.back.restartExamUseStartURL_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    >{{
                        translate(
                            "sebSettings.examView.back.restartExamURL_text",
                        )
                    }}
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="restartExamURL"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        :label="
                            translate(
                                'sebSettings.examView.back.restartExamURL',
                            )
                        "
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'restartExamURL',
                                restartExamURL,
                            )
                        "
                    >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    >{{
                        translate(
                            "sebSettings.examView.back.restartExamText_text",
                        )
                    }}
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="restartExamText"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        :label="
                            translate(
                                'sebSettings.examView.back.restartExamText',
                            )
                        "
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'restartExamText',
                                restartExamText,
                            )
                        "
                    >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="restartExamPasswordProtected"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.examView.back.restartExamPasswordProtected',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'restartExamPasswordProtected',
                                restartExamPasswordProtected ? 'true' : 'false',
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
                                "sebSettings.examView.back.restartExamPasswordProtected_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.examView.reconfigure.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="examSessionReconfigureAllow"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.examView.reconfigure.examSessionReconfigureAllow',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'examSessionReconfigureAllow',
                                examSessionReconfigureAllow ? 'true' : 'false',
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
                                "sebSettings.examView.reconfigure.examSessionReconfigureAllow_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="examSessionReconfigureConfigURL"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        :label="
                            translate(
                                'sebSettings.examView.reconfigure.examSessionReconfigureConfigURL',
                            )
                        "
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'examSessionReconfigureConfigURL',
                                examSessionReconfigureConfigURL,
                            )
                        "
                    >
                    </v-text-field>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
//import { useI18n } from "vue-i18n";
import { stringToBoolean, translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { ref, onBeforeMount } from "vue";
import {
    SEBSettingsValue,
    SEBSettingsView,
} from "@/models/seb-server/sebSettings";

//const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

const examSessionClearCookiesOnStart = ref<boolean>(false);
const examSessionClearCookiesOnEnd = ref<boolean>(false);

const quitURL = ref<string>("");
const quitURLConfirm = ref<boolean>(false);
const quitURLRestart = ref<boolean>(false);

const restartExamUseStartURL = ref<boolean>(false);
const restartExamURL = ref<string>("");
const restartExamText = ref<string>("");
const restartExamPasswordProtected = ref<boolean>(false);

const examSessionReconfigureAllow = ref<boolean>(false);
const examSessionReconfigureConfigURL = ref<string>("");

const startURLAppendQueryParameter = ref<boolean>(false);

let componentId: string;
let singleValues: Map<string, SEBSettingsValue>;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const examSettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.EXAM,
            componentId,
            sebSettingsStore.isExam,
        );
    if (examSettings == null) {
        return;
    }

    singleValues = new Map<string, SEBSettingsValue>(
        Object.entries(examSettings.singleValues),
    );

    examSessionClearCookiesOnStart.value = stringToBoolean(
        getSingleValue("examSessionClearCookiesOnStart").value,
    );
    examSessionClearCookiesOnEnd.value = stringToBoolean(
        getSingleValue("examSessionClearCookiesOnEnd").value,
    );

    quitURL.value = getSingleValue("quitURL").value;
    quitURLConfirm.value = stringToBoolean(
        getSingleValue("quitURLConfirm").value,
    );
    quitURLRestart.value = stringToBoolean(
        getSingleValue("quitURLRestart").value,
    );

    restartExamUseStartURL.value = stringToBoolean(
        getSingleValue("restartExamUseStartURL").value,
    );
    restartExamURL.value = getSingleValue("restartExamURL").value;
    restartExamText.value = getSingleValue("restartExamText").value;
    restartExamPasswordProtected.value = stringToBoolean(
        getSingleValue("restartExamPasswordProtected").value,
    );

    examSessionReconfigureAllow.value = stringToBoolean(
        getSingleValue("examSessionReconfigureAllow").value,
    );
    examSessionReconfigureConfigURL.value = getSingleValue(
        "examSessionReconfigureConfigURL",
    ).value;

    startURLAppendQueryParameter.value = stringToBoolean(
        getSingleValue("startURLAppendQueryParameter").value,
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
