<template>
    <v-col>
        <v-row>
            <!-- Password Input -->
            <v-col>
                <v-text-field
                    ref="passwordFieldRef"
                    v-model="passwordVal"
                    :label="translate(label)"
                    density="compact"
                    :rules="[passwordRule]"
                    :type="passwordVisible ? 'text' : 'password'"
                    validate-on="eager"
                    variant="outlined"
                    :disabled="sebSettingsStore.readonly"
                    max-width="600"
                    @update:focused="savePassword($event, passwordVal)"
                >
                    <template #append-inner>
                        <v-btn
                            density="compact"
                            :icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                            variant="text"
                            @click="passwordVisible = !passwordVisible"
                        />
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <!-- Confirm Password Input -->
            <v-col>
                <v-text-field
                    ref="confirmPasswordFieldRef"
                    v-model="confirmPassword"
                    :label="translate(confirmLabel)"
                    class="mb-2"
                    density="compact"
                    required
                    :rules="[confirmPasswordRule]"
                    :type="confirmPasswordVisible ? 'text' : 'password'"
                    validate-on="eager"
                    variant="outlined"
                    max-width="600"
                    @update:focused="savePassword($event, passwordVal)"
                >
                    <template #append-inner>
                        <v-btn
                            density="compact"
                            :icon="
                                confirmPasswordVisible
                                    ? 'mdi-eye-off'
                                    : 'mdi-eye'
                            "
                            variant="text"
                            @click="
                                confirmPasswordVisible = !confirmPasswordVisible
                            "
                        />
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
    </v-col>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
import { translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";

const sebSettingsStore = useSEBSettingsStore();
const i18n = useI18n();

const passwordVal = ref<string>("");
const passwordVisible = ref<boolean>(false);
const confirmPassword = ref<string>("");
const confirmPasswordVisible = ref<boolean>(false);

const props = defineProps<{
    name: string;
    label: string;
    confirmLabel: string;
    tooltip: string | null;
}>();

let clearValidations = false;

const passwordRule = () => {
    if (!passwordVal.value) return true;
    if (passwordVal.value.trim() !== passwordVal.value) {
        return translate("sebSettings.pwdSpaces", i18n);
    }

    if (passwordVal.value === confirmPassword.value) {
        if (!clearValidations) {
            clearValidations = true;
            confirmPasswordFieldRef.value?.validate?.();
            clearValidations = false;
        }
        return true;
    }
    return translate("sebSettings.pwdMismatch", i18n);
};

const confirmPasswordRule = () => {
    if (passwordVal.value === confirmPassword.value) {
        if (!clearValidations) {
            clearValidations = true;
            passwordFieldRef.value?.validate?.();
            clearValidations = false;
        }
        return true;
    }
    return translate("sebSettings.pwdMismatch", i18n);
};
const passwordFieldRef = ref();
const confirmPasswordFieldRef = ref();

onMounted(() => {
    passwordVal.value = sebSettingsStore.getStringValue(props.name);
    confirmPassword.value = sebSettingsStore.getStringValue(props.name);
});

async function savePassword(focusIn: boolean, value: string) {
    if (
        !focusIn &&
        passwordVal.value.trim() === passwordVal.value &&
        passwordVal.value === confirmPassword.value
    ) {
        sebSettingsStore.saveSingleValue(props.name, value);
    }
}
</script>
