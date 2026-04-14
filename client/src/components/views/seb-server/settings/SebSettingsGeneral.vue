<template>
    <v-row>
        <!-- Administrator Password -->
        <v-col>
            <v-text-field
                ref="adminPasswordFieldRef"
                v-model="hashedAdminPasswordVal"
                :label="translate('sebSettings.generalView.adminPassword')"
                density="compact"
                :rules="[adminPasswordRule]"
                :type="adminPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                :disabled="sebSettingsStore.readonly"
                max-width="600"
                @update:focused="
                    saveAdminPassword($event, hashedAdminPasswordVal)
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
        <v-col class="pt-1 pb-1">
            <v-text-field
                ref="confirmAdminPasswordFieldRef"
                v-model="confirmAdminPassword"
                :label="
                    translate('sebSettings.generalView.confirmAdminPassword')
                "
                class="mb-2"
                density="compact"
                required
                :rules="[confirmAdminPasswordRule]"
                :type="confirmAdminPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                max-width="600"
                @update:focused="
                    saveAdminPassword($event, hashedAdminPasswordVal)
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
        <v-col class="pt-1 pb-1 pl-0">
            <v-checkbox-btn
                v-model="allowQuitVal"
                max-width="600"
                :disabled="sebSettingsStore.readonly"
                :label="translate('sebSettings.generalView.allowQuit')"
                @update:model-value="
                    sebSettingsStore.saveSingleValue(
                        'allowQuit',
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
        <v-col>
            <v-text-field
                ref="quitPasswordFieldRef"
                v-model="hashedQuitPasswordVal"
                :label="translate('sebSettings.generalView.quitPassword')"
                density="compact"
                :rules="[quitPasswordRule]"
                :type="quitPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                :disabled="sebSettingsStore.readonly"
                max-width="600"
                @update:focused="
                    saveQuitPassword($event, hashedQuitPasswordVal)
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
        <v-col>
            <v-text-field
                ref="confirmQuitPasswordFieldRef"
                v-model="confirmQuitPassword"
                :label="
                    translate('sebSettings.generalView.confirmQuitPassword')
                "
                class="mb-2"
                density="compact"
                required
                :rules="[confirmQuitPasswordRule]"
                :type="confirmQuitPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                max-width="600"
                @update:focused="
                    saveQuitPassword($event, hashedQuitPasswordVal)
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
import { ref, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";

const sebSettingsStore = useSEBSettingsStore();
const i18n = useI18n();

const allowQuitVal = ref<boolean>(false);

const hashedAdminPasswordVal = ref<string>("");
const adminPasswordVisible = ref<boolean>(false);
const confirmAdminPassword = ref<string>("");
const confirmAdminPasswordVisible = ref<boolean>(false);
const adminPasswordRule = () => {
    if (hashedAdminPasswordVal.value.trim() !== hashedAdminPasswordVal.value) {
        return translate("sebSettings.pwdSpaces", i18n);
    }

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
const confirmAdminPasswordRule = () => {
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
const quitPasswordRule = () => {
    if (hashedQuitPasswordVal.value.trim() !== hashedQuitPasswordVal.value) {
        return translate("sebSettings.pwdSpaces", i18n);
    }

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
const confirmQuitPasswordRule = () => {
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

let clearValidations = false;

onBeforeMount(async () => {
    initSettings();
});

async function initSettings() {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    await sebSettingsStore.fetchSingleValues(ViewType.GENERAL);

    allowQuitVal.value = sebSettingsStore.getBooleanValue("allowQuit");
    hashedAdminPasswordVal.value = sebSettingsStore.getStringValue(
        "hashedAdminPassword",
    );
    confirmAdminPassword.value = sebSettingsStore.getStringValue(
        "hashedAdminPassword",
    );
    hashedQuitPasswordVal.value =
        sebSettingsStore.getStringValue("hashedQuitPassword");
    confirmQuitPassword.value =
        sebSettingsStore.getStringValue("hashedQuitPassword");
}

async function saveAdminPassword(focusIn: boolean, value: string) {
    if (
        !focusIn &&
        hashedAdminPasswordVal.value.trim() === hashedAdminPasswordVal.value &&
        hashedAdminPasswordVal.value === confirmAdminPassword.value
    ) {
        sebSettingsStore.saveSingleValue("hashedAdminPassword", value);
    }
}

async function saveQuitPassword(focusIn: boolean, value: string) {
    if (
        !focusIn &&
        hashedQuitPasswordVal.value.trim() === hashedQuitPasswordVal.value &&
        hashedQuitPasswordVal.value === confirmQuitPassword.value
    ) {
        sebSettingsStore.saveSingleValue("hashedQuitPassword", value);
    }
}
</script>
