<!-- <template>
    <v-row> EXAM Settings TODO </v-row>
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


const examSessionClearCookiesOnStart = ref<boolean>(false);
const examSessionClearCookiesOnEnd = ref<boolean>(false);

const quitURL = ref<boolean>(false);
const quitURLConfirm = ref<boolean>(false);

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

// async function saveOnFocusLost(focusIn: boolean, name: string, value: string) {
//     if (!focusIn) {
//         saveSingleValue(name, value);
//     }
// }

function getSingleValue(name: string): SEBSettingsValue {
    const value = singleValues.get(name);
    if (!value) {
        throw new Error("No Single Value" + name + " found");
    }

    return value;
}
</script> -->
