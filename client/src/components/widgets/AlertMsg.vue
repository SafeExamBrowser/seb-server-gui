<template>
    <v-alert 
        v-if="props.alertProps.type == 'alert'"
        :title=props.alertProps.title
        :text="messages.find(item => item.key == props.alertProps.textKey)?.value"
        :color=props.alertProps.color 
        :icon=getIcon()>
    </v-alert>

    <v-snackbar 
        v-if="props.alertProps.type == 'snackbar'" 
        v-model="snackbar"
        :color="props.alertProps.color">

        {{ messages.find(item => item.key == props.alertProps.textKey)?.value}}

        <template v-slot:actions>
            <v-btn variant="text" @click="snackbar = false"> Close </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
    import { ref } from "vue";  

    const snackbar = ref<boolean>(true);

    const props = defineProps<{
        alertProps: AlertProps
    }>();

    const messages: {key: string, value: string}[] = [
        {
            key: "no-data",
            value: "No data available"
        },
        {
            key: "no-live-data",
            value: "No live sessions available"
        },
        {
            key: "no-group",
            value: "Group doesn't exist or is not active"
        },
        {
            key: "api-error",
            value: "Something went wrong, please try again"
        },
        {
            key: "login-error",
            value: "Please provide a correct pair of user name and password."
        },
        {
            key: "register-error",
            value: "Please try again."
        },
        {
            key: "timeout-error",
            value: "The connection to the remote server timed out. Please try again"
        },
        {
            key: "register-success",
            value: "Your registration was successful. You can now login"
        },
        {
            key: "changePassword-error",
            value: "Your password could not be changed. Please provide valid data."
        },
        {
            key: "changePassword-success",
            value: "Your password has been changed successfully."
        }
    ];

    function getIcon(): string{
        return "$" + props.alertProps.color
    }

</script>