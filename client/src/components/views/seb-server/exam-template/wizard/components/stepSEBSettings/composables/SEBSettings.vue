<template>
    <v-container class="ma-0 pa-0 pb-3 border-b-md">
        <v-row>
            <v-col>
                <div
                    class="d-flex align-center mx-6 mt-6 cursor-pointer add-button-container"
                >
                    <SectionSubtitle
                        :name="$t('createTemplateExam.steps.seb-settings.name')"
                    />
                </div>
            </v-col>
            <v-col cols="auto">
                <AddButton text="" @click="importDialog = true" />
            </v-col>
        </v-row>
    </v-container>

    <v-card class="pa-5" variant="text">
        <v-row>
            <v-col>
                <v-row :params="init_store">
                    <v-tabs
                        v-model="currentTab"
                        show-arrows="always"
                        center-active
                    >
                        <v-tab
                            v-for="tab in tabs"
                            :key="tab.value"
                            :value="tab.value"
                            >{{ tab.title }}</v-tab
                        >
                    </v-tabs>
                </v-row>
                <v-row>
                    <v-col>
                        <v-tabs-window v-model="currentTab">
                            <v-tabs-window-item
                                v-for="tab in tabs"
                                :key="tab.value"
                                :value="tab.value"
                            >
                                <v-card
                                    class="rounded-lg pa-4"
                                    variant="outlined"
                                >
                                    <component :is="tab.component" />
                                </v-card>
                            </v-tabs-window-item> </v-tabs-window
                    ></v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-card>

    <!-----------import dialog ---------->
    <v-dialog v-model="importDialog" max-width="800">
        <SEBSettingsImportDialog
            v-model="importDialog"
            @imported="onConfigImported"
        />
    </v-dialog>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils";
import SebSettingsApplications from "@/components/views/seb-server/settings/SebSettingsApplications.vue";
import SebSettingsNetwork from "@/components/views/seb-server/settings/SebSettingsNetwork.vue";
import SebSettingsGeneral from "@/components/views/seb-server/settings/SebSettingsGeneral.vue";
import { GUIAction, useAbilities } from "@/services/ability";
import SebSettingsUserInterface from "@/components/views/seb-server/settings/SebSettingsUserInterface.vue";
import SebSettingsBrowser from "@/components/views/seb-server/settings/SebSettingsBrowser.vue";
import SebSettingsDownUploads from "@/components/views/seb-server/settings/SebSettingsDownUploads.vue";
import SebSettingsExam from "@/components/views/seb-server/settings/SebSettingsExam.vue";
import SebSettingsSecurity from "@/components/views/seb-server/settings/SebSettingsSecurity.vue";
import SebSettingsRegistry from "@/components/views/seb-server/settings/SebSettingsRegistry.vue";
import SebSettingsHookedKeys from "@/components/views/seb-server/settings/SebSettingsHookedKeys.vue";
import SebSettingsProctoring from "@/components/views/seb-server/settings/SebSettingsProctoring.vue";
import { computed, markRaw, ref } from "vue";
import type { Component, ComputedRef } from "vue";
import { ConfigurationTemplateKey } from "@/models/seb-server/configurationNode";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { useStepNamingStore } from "@/components/views/seb-server/exam-template/wizard/components/stepNaming/composables/store/useStepNamingStore";
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";
import SEBSettingsImportDialog from "@/components/views/seb-server/exam-template/wizard/components/stepSEBSettings/composables/SEBSettingsImportDialog.vue";
import AddButton from "@/components/views/seb-server/settings-navigation/widgets/AddButton.vue";

const configKey = defineModel<ConfigurationTemplateKey | undefined>({
    required: true,
});

const ability = useAbilities();
const currentTab = ref<number>(1);

const importDialog = ref<boolean>(false);
async function onConfigImported() {
    importDialog.value = false;
    // TODO reload the settings
    console.info("*********** TODO reload settings");
    //await loadItems();
}

const init_store = computed(() => {
    if (configKey.value) {
        const sebSettingsStore = useSEBSettingsStore();
        const stepNamingStore = useStepNamingStore();

        if (sebSettingsStore.selectedContainerId == null) {
            sebSettingsStore.isExam = false;
            sebSettingsStore.readonly = false;
            if (configKey.value.id) {
                sebSettingsStore.selectedContainerId = parseInt(
                    configKey.value.id,
                );
                stepNamingStore.configurationTemplate = configKey.value.id;
            }
        }
        console.info(
            "*********** sebSettingsStore.selectedContainerId: " +
                sebSettingsStore.selectedContainerId,
        );
        return true;
    }
    return false;
});

const tabs: ComputedRef<
    { title: string; value: number; component: Component }[]
> = computed(() => {
    return ability.canDo(GUIAction.EditFullSEBSettings)
        ? [
              {
                  title: translate("sebSettings.views.general"),
                  value: 1,
                  component: markRaw(SebSettingsGeneral),
              },
              {
                  title: translate("sebSettings.views.userInterface"),
                  value: 2,
                  component: markRaw(SebSettingsUserInterface),
              },
              {
                  title: translate("sebSettings.views.browser"),
                  value: 3,
                  component: markRaw(SebSettingsBrowser),
              },
              {
                  title: translate("sebSettings.views.downUploads"),
                  value: 4,
                  component: markRaw(SebSettingsDownUploads),
              },
              {
                  title: translate("sebSettings.views.exam"),
                  value: 5,
                  component: markRaw(SebSettingsExam),
              },
              {
                  title: translate("sebSettings.views.apps"),
                  value: 6,
                  component: markRaw(SebSettingsApplications),
              },
              {
                  title: translate("sebSettings.views.network"),
                  value: 7,
                  component: markRaw(SebSettingsNetwork),
              },
              {
                  title: translate("sebSettings.views.security"),
                  value: 8,
                  component: markRaw(SebSettingsSecurity),
              },
              {
                  title: translate("sebSettings.views.registry"),
                  value: 9,
                  component: markRaw(SebSettingsRegistry),
              },
              {
                  title: translate("sebSettings.views.hookedKeys"),
                  value: 10,
                  component: markRaw(SebSettingsHookedKeys),
              },
              {
                  title: translate("sebSettings.views.proctoring"),
                  value: 11,
                  component: markRaw(SebSettingsProctoring),
              },
          ]
        : [
              {
                  title: translate("sebSettings.views.apps"),
                  value: 2,
                  component: markRaw(SebSettingsApplications),
              },
              {
                  title: translate("sebSettings.views.network"),
                  value: 3,
                  component: markRaw(SebSettingsNetwork),
              },
          ];
});
</script>
