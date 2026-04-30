<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-row v-if="singleValues">
            <v-col class="text-subtitle-1">
                <SettingsTitle
                    label="sebSettings.examView.sessionHandling.title"
                    :tooltip="true"
                />
                <v-row>
                    <v-col
                        >{{
                            translate(
                                "sebSettings.examView.sessionHandling.text",
                            )
                        }}
                    </v-col>
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="examSessionClearCookiesOnStart"
                        label="sebSettings.examView.sessionHandling.examSessionClearCookiesOnStart"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="examSessionClearCookiesOnEnd"
                        label="sebSettings.examView.sessionHandling.examSessionClearCookiesOnEnd"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.examView.quitLink.title" />

                <v-row>
                    <v-col
                        >{{
                            translate("sebSettings.examView.quitLink.quitURL")
                        }}
                    </v-col>
                </v-row>
                <v-row>
                    <TextSetting
                        v-model="singleValues"
                        name="quitURL"
                        label="sebSettings.examView.quitLink.quitURL_title"
                        :show-label="true"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="quitURLConfirm"
                        label="sebSettings.examView.quitLink.quitURLConfirm"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="quitURLRestart"
                        label="sebSettings.examView.quitLink.quitURLRestart"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.examView.query.title" />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="startURLAppendQueryParameter"
                        label="sebSettings.examView.query.startURLAppendQueryParameter"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
            </v-col>

            <v-col class="text-subtitle-1">
                <SettingsTitle label="sebSettings.examView.back.title" />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="restartExamUseStartURL"
                        label="sebSettings.examView.back.restartExamUseStartURL"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
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
                    <TextSetting
                        v-model="singleValues"
                        name="restartExamURL"
                        label="sebSettings.examView.back.restartExamURL"
                        :show-label="true"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
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
                    <TextSetting
                        v-model="singleValues"
                        name="restartExamText"
                        label="sebSettings.examView.back.restartExamText"
                        :show-label="true"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="restartExamPasswordProtected"
                        label="sebSettings.examView.back.restartExamPasswordProtected"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.examView.reconfigure.title" />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="examSessionReconfigureAllow"
                        label="sebSettings.examView.reconfigure.examSessionReconfigureAllow"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <TextSetting
                        v-model="singleValues"
                        name="examSessionReconfigureConfigURL"
                        label="ebSettings.examView.reconfigure.examSessionReconfigureConfigURL"
                        :show-label="false"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
            </v-col>
        </v-row>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";
import SettingsTitle from "./components/SettingsTitle.vue";
import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import TextSetting from "./components/inputFields/TextSetting.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { SEBSettingsContext } from "./types.ts";
import { ViewType } from "@/models/seb-server/sebSettingsEnums.ts";

const props = defineProps<{
    context: SEBSettingsContext;
}>();

const { singleValues, loadingSebSettingsView, errorSebSettingsView } =
    useSEBSettingValues(
        props.context.isExam,
        props.context.containerId,
        ViewType.EXAM,
    );
</script>
