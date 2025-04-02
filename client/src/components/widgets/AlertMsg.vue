<template>
    <v-alert 
        v-if="props.alertProps.type == 'alert'"
        :title=props.alertProps.title
        :text="getText()"
        :color=props.alertProps.color 
        :icon=getIcon()>
    </v-alert>

    <v-snackbar 
        v-if="props.alertProps.type == 'snackbar'" 
        v-model="snackbar"
        :color="props.alertProps.color"
        :timeout="props.alertProps.timeout ? props.alertProps.timeout : 5000">
        
        {{ translate("warnings." + props.alertProps.textKey) }}
        
        <template v-slot:actions>
            <v-btn variant="text" @click="snackbar = false"> Close </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup lang="ts">
    import { ref } from "vue";  
    import {translate} from "@/utils/generalUtils";

    const snackbar = ref<boolean>(true);

    const props = defineProps<{
        alertProps: AlertProps
    }>();


    function getText(): string{
        if(props.alertProps.customText != null){
            return props.alertProps.customText;
        }

        const message: string | undefined = translate("warnings." + props.alertProps.textKey);

        if(message != null){
            return message;
        }

        return "";
    }

    function getIcon(): string{
        return "$" + props.alertProps.color
    }

</script>