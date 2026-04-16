<template>
    <v-col>
        <v-row>
            <!-- Password Input -->
            <v-col>
                <v-text-field
                    ref="passwordFieldRef"
                    v-model="password"
                    :label="translate(label)"
                    density="compact"
                    :rules="[passwordRule]"
                    :type="passwordVisible ? 'text' : 'password'"
                    validate-on="eager"
                    variant="outlined"
                    :disabled="sebSettingsStore.readonly || disabled"
                    max-width="600"
                    @update:focused="savePassword($event)"
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
                    :disabled="sebSettingsStore.readonly || disabled"
                    validate-on="eager"
                    variant="outlined"
                    max-width="600"
                    @update:focused="savePassword($event)"
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

const password = ref<string>("");
const passwordVisible = ref<boolean>(false);
const confirmPassword = ref<string>("");
const confirmPasswordVisible = ref<boolean>(false);

const props = defineProps<{
    name: string;
    label: string;
    confirmLabel: string;
    disabled?: boolean;
}>();

defineExpose({
    password,
});

let clearValidations = false;

const passwordRule = () => {
    if (!password.value) return true;
    if (password.value.trim() !== password.value) {
        return translate("sebSettings.pwdSpaces", i18n);
    }

    if (password.value === confirmPassword.value) {
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
    if (password.value === confirmPassword.value) {
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
    password.value = sebSettingsStore.getStringValue(props.name);
    confirmPassword.value = sebSettingsStore.getStringValue(props.name);
});

async function savePassword(focusIn: boolean) {
    if (focusIn) return;
    if (password.value === confirmPassword.value) {
        if (!password.value) {
            sebSettingsStore.saveSingleValue(props.name, "");
        } else if (password.value.trim() === password.value) {
            sebSettingsStore.saveSingleValue(props.name, password.value);
        }
    }
}
</script>
