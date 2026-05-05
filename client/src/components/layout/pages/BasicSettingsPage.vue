<template>
    <div class="fill-height d-flex flex-column">
        <v-row class="flex-grow-0 flex-shrink-0">
            <v-col>
                <div
                    class="text-white text-h5 font-weight-black ml-10 mt-5"
                    data-testid="settings-title"
                >
                    {{ translate("titles.settings") }}
                </div>
            </v-col>
        </v-row>
        <v-row>
            <!--- Left Settings -->
            <v-col cols="3">
                <SettingsNavigation />
            </v-col>

            <!--- Right side white panel -->
            <v-col cols="9" class="fill-height overflow-y-auto">
                <v-card
                    elevation="4"
                    rounded="lg"
                    class="fill-height overflow-y-auto mr-16"
                >
                    <v-row>
                        <v-col class="pt-8 pl-12">
                            <PageTitle :name="props.title" />
                        </v-col>

                        <v-col>
                            <slot name="ActionButton"></slot>
                        </v-col>
                    </v-row>
                    <horizontal-divider-line />

                    <slot name="PanelMain"></slot>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";
import HorizontalDividerLine from "@/components/layout/pages/widgets/HorizontalDividerLine.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import PageTitle from "@/components/widgets/PageTitle.vue";

const props = defineProps<{
    title: string;
}>();
</script>
