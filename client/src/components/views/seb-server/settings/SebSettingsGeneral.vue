<template>
    <v-row>
        <!-- Administrator Password -->
        <v-col :class="sebSettingsStore.fp">
            {{ translate("sebSettings.generalView.adminPassword") }}
            <v-text-field
                ref="adminPasswordFieldRef"
                v-model="hashedAdminPasswordVal"
                density="compact"
                single-line
                :rules="[adminPasswordRule]"
                :type="adminPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                :disabled="sebSettingsStore.readonly"
                max-width="600"
                @update:focused="
                    saveAdminPassword(
                        $event,
                        hashedAdminPassword.id,
                        hashedAdminPasswordVal,
                    )
                "
            >
                <template #append-inner>
                    <v-btn
                        density="compact"
                        :icon="adminPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        variant="text"
                        @click="adminPasswordVisible = !adminPasswordVisible"
                    />
                </template>
            </v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <!-- Confirm Administrator Password -->
        <v-col :class="sebSettingsStore.fp">
            {{ translate("sebSettings.generalView.confirmAdminPassword") }}
            <v-text-field
                ref="confirmAdminPasswordFieldRef"
                v-model="confirmAdminPassword"
                class="mb-2"
                density="compact"
                required
                :rules="[confirmAdminPasswordRule]"
                :type="confirmAdminPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                max-width="600"
                @update:focused="
                    saveAdminPassword(
                        $event,
                        hashedAdminPassword.id,
                        hashedAdminPasswordVal,
                    )
                "
            >
                <template #append-inner>
                    <v-btn
                        density="compact"
                        :icon="
                            confirmAdminPasswordVisible
                                ? 'mdi-eye-off'
                                : 'mdi-eye'
                        "
                        variant="text"
                        @click="
                            confirmAdminPasswordVisible =
                                !confirmAdminPasswordVisible
                        "
                    />
                </template>
            </v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <v-col :class="sebSettingsStore.cp">
            <v-checkbox-btn
                v-model="allowQuitVal"
                :disabled="sebSettingsStore.readonly"
                :label="translate('sebSettings.generalView.allowQuit')"
                @update:model-value="
                    saveSingleValue(
                        allowQuit.id,
                        allowQuitVal ? 'true' : 'false',
                    )
                "
            ></v-checkbox-btn>
            <v-tooltip activator="parent" location="top left" max-width="400">
                {{ translate("sebSettings.generalView.allowQuit_tooltip") }}
            </v-tooltip>
        </v-col>
    </v-row>
    <v-row>
        <!-- Quit Password -->
        <v-col :class="sebSettingsStore.fp">
            {{ translate("sebSettings.generalView.quitPassword") }}
            <v-text-field
                ref="quitPasswordFieldRef"
                v-model="hashedQuitPasswordVal"
                density="compact"
                single-line
                :rules="[quitPasswordRule]"
                :type="quitPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                :disabled="sebSettingsStore.readonly"
                max-width="600"
                @update:focused="
                    saveQuitPassword(
                        $event,
                        hashedQuitPassword.id,
                        hashedQuitPasswordVal,
                    )
                "
            >
                <template #append-inner>
                    <v-btn
                        density="compact"
                        :icon="quitPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        variant="text"
                        @click="quitPasswordVisible = !quitPasswordVisible"
                    />
                </template>
            </v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <!-- Confirm Quit Password -->
        <v-col :class="sebSettingsStore.fp">
            {{ translate("sebSettings.generalView.confirmQuitPassword") }}
            <v-text-field
                ref="confirmQuitPasswordFieldRef"
                v-model="confirmQuitPassword"
                class="mb-2"
                density="compact"
                required
                :rules="[confirmQuitPasswordRule]"
                :type="confirmQuitPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                max-width="600"
                @update:focused="
                    saveQuitPassword(
                        $event,
                        hashedQuitPassword.id,
                        hashedQuitPasswordVal,
                    )
                "
            >
                <template #append-inner>
                    <v-btn
                        density="compact"
                        :icon="
                            confirmQuitPasswordVisible
                                ? 'mdi-eye-off'
                                : 'mdi-eye'
                        "
                        variant="text"
                        @click="
                            confirmQuitPasswordVisible =
                                !confirmQuitPasswordVisible
                        "
                    />
                </template>
            </v-text-field>
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

const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

const allowQuitVal = ref<boolean>(false);

const hashedAdminPasswordVal = ref<string>("");
const adminPasswordVisible = ref<boolean>(false);
const confirmAdminPassword = ref<string>("");
const confirmAdminPasswordVisible = ref<boolean>(false);
const adminPasswordRule = (v: string) => {
    if (hashedAdminPasswordVal.value === confirmAdminPassword.value) {
        if (!clearValidations) {
            clearValidations = true;
            confirmAdminPasswordFieldRef.value?.validate?.();
            clearValidations = false;
        }
        return true;
    }
    return translate("sebSettings.pwdMismatch", i18n);
};
const confirmAdminPasswordRule = (v: string) => {
    if (hashedAdminPasswordVal.value === confirmAdminPassword.value) {
        if (!clearValidations) {
            clearValidations = true;
            adminPasswordFieldRef.value?.validate?.();
            clearValidations = false;
        }
        return true;
    }
    return translate("sebSettings.pwdMismatch", i18n);
};
const adminPasswordFieldRef = ref();
const confirmAdminPasswordFieldRef = ref();

const hashedQuitPasswordVal = ref<string>("");
const quitPasswordVisible = ref<boolean>(false);
const confirmQuitPassword = ref<string>("");
const confirmQuitPasswordVisible = ref<boolean>(false);
const quitPasswordRule = (v: string) => {
    if (hashedQuitPasswordVal.value === confirmQuitPassword.value) {
        if (!clearValidations) {
            clearValidations = true;
            confirmQuitPasswordFieldRef.value?.validate?.();
            clearValidations = false;
        }
        return true;
    }
    return translate("sebSettings.pwdMismatch", i18n);
};
const confirmQuitPasswordRule = (v: string) => {
    if (hashedQuitPasswordVal.value === confirmQuitPassword.value) {
        if (!clearValidations) {
            clearValidations = true;
            quitPasswordFieldRef.value?.validate?.();
            clearValidations = false;
        }
        return true;
    }
    return translate("sebSettings.pwdMismatch", i18n);
};
const quitPasswordFieldRef = ref();
const confirmQuitPasswordFieldRef = ref();

// the parent component identifier
let componentId: string;

// field SEBSettingsValue
let hashedAdminPassword: SEBSettingsValue;
let allowQuit: SEBSettingsValue;
let hashedQuitPassword: SEBSettingsValue;
let clearValidations = false;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const generalSettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.GENERAL,
            componentId,
            sebSettingsStore.isExam,
        );
    if (generalSettings == null) {
        return;
    }

    const singleValues: Map<string, SEBSettingsValue> = new Map<
        string,
        SEBSettingsValue
    >(Object.entries(generalSettings.singleValues));

    allowQuit = singleValues.get("allowQuit")!;
    allowQuitVal.value = stringToBoolean(allowQuit.value);

    hashedAdminPassword = singleValues.get("hashedAdminPassword")!;
    hashedAdminPasswordVal.value = hashedAdminPassword.value;
    confirmAdminPassword.value = hashedAdminPassword.value;

    hashedQuitPassword = singleValues.get("hashedQuitPassword")!;
    hashedQuitPasswordVal.value = hashedQuitPassword.value;
    confirmQuitPassword.value = hashedQuitPassword.value;
});

async function saveSingleValue(valId: number, value: string) {
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        valId.toString(),
        value,
        sebSettingsStore.isExam,
    );
}

async function saveAdminPassword(
    focusIn: boolean,
    valId: number,
    value: string,
) {
    if (
        !focusIn &&
        hashedAdminPasswordVal.value === confirmAdminPassword.value
    ) {
        saveSingleValue(valId, value);
    }
}

async function saveQuitPassword(
    focusIn: boolean,
    valId: number,
    value: string,
) {
    if (!focusIn && hashedQuitPasswordVal.value === confirmQuitPassword.value) {
        saveSingleValue(valId, value);
    }
}
</script>
