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

    <v-card
        :key="reloadSettings"
        :params="init_store"
        class="pa-5"
        variant="text"
    >
        <v-row>
            <v-col>
                <SEBSettingsPanel />
            </v-col>
        </v-row>
    </v-card>

    <!-----------import dialog ---------->
    <UploadDialog
        v-model="importDialog"
        name-prefix="sebSettings"
        icon="mdi-file-upload-outline"
        :seb-settings-id="
            sebSettingsStore.selectedContainerId
                ? sebSettingsStore.selectedContainerId.toString()
                : null
        "
        :show-quit-password="true"
        :default-ext-list="['.seb']"
        @uploaded="onConfigImported"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ConfigurationTemplateKey } from "@/models/seb-server/configurationNode";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { useStepNamingStore } from "@/components/views/seb-server/exam-template/wizard/components/stepNaming/composables/store/useStepNamingStore";
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";
import AddButton from "@/components/widgets/AddButton.vue";
import SEBSettingsPanel from "@/components/views/seb-server/sebSettings/components/SEBSettingsPanel.vue";
import UploadDialog from "@/components/widgets/UploadDialog.vue";

const sebSettingsStore = useSEBSettingsStore();

const configKey = defineModel<ConfigurationTemplateKey | undefined>({
    required: true,
});

const reloadSettings = ref<number>(0);

const importDialog = ref<boolean>(false);
async function onConfigImported() {
    importDialog.value = false;
    // reload seb settings
    reloadSettings.value += 1;
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

        return true;
    }
    return false;
});
</script>
