<template>
    <v-snackbar
        v-model="errorStore.isError"
        :color="errorStore.errorProps.color"
        :timeout="
            errorStore.errorProps.timeout ? errorStore.errorProps.timeout : 5000
        "
    >
        <template v-if="isDetails">
            <div class="text-h6 font-weight-bold">
                {{ getText() }}
            </div>
            {{ errorStore.errorProps.details }}
        </template>

        <template v-else>
            {{ getText() }}
        </template>

        <template #actions>
            <v-btn
                v-if="errorStore.errorProps.details"
                variant="text"
                @click="isDetails = !isDetails"
            >
                <template v-if="!isDetails"> Show Details </template>
                <template v-else> Hide Details </template>
            </v-btn>

            <v-btn variant="text" @click="errorStore.isError = false">
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useErrorStore } from "@/stores/seb-server/errorStore";
import { storeToRefs } from "pinia";

// store
const errorStore = useErrorStore();
const errorStoreRef = storeToRefs(errorStore);

const isDetails = ref<boolean>(false);

watch(errorStoreRef.isError, () => {
    // details not visible on next error
    if (!errorStore.isError) {
        isDetails.value = false;
    }
});

function getText(): string {
    if (errorStore.errorProps.textKey) {
        const found = messages.find(
            (item) => item.key === errorStore.errorProps.textKey,
        );
        if (found) return found.value;
    }

    if (errorStore.errorProps.textCustom) {
        return errorStore.errorProps.textCustom;
    }

    return "An error has occurred";
}

const messages: { key: string; value: string }[] = [
    {
        key: "no-data",
        value: "No data available",
    },
    {
        key: "no-live-data",
        value: "No live sessions available",
    },
    {
        key: "no-group",
        value: "Group doesn't exist or is not active",
    },
    {
        key: "api-error",
        value: "Something went wrong, please try again",
    },
    {
        key: "login-error",
        value: "Please provide a correct pair of user name and password.",
    },
    {
        key: "register-error",
        value: "Please try again.",
    },
    {
        key: "timeout-error",
        value: "The connection to the remote server timed out. Please try again",
    },
    {
        key: "register-success",
        value: "Your registration was successful. You can now login",
    },
    {
        key: "changePassword-error",
        value: "Your password could not be changed. Please provide valid data.",
    },
    {
        key: "changePassword-success",
        value: "Your password has been changed successfully.",
    },
    {
        key: "exam-duplicate",
        value: "This exam is already prepared",
    },
    {
        key: "exam-update-successful",
        value: "Exam successfully updated",
    },
    {
        key: "exam-update-failed",
        value: "Exam update failed",
    },
    {
        key: "activate-screen-proctoring-failed",
        value: "Activation of screen proctoring failed",
    },
    {
        key: "deactivate-screen-proctoring-failed",
        value: "Deactivation of screen proctoring failed",
    },
    {
        key: "no-assessment-tool",
        value: "No assessment tool connected to SEB Server. Contact your institutional Administrator.",
    },
];
</script>
