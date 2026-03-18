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
            <v-col cols="3">
                <SettingsNavigation> </SettingsNavigation>
            </v-col>

            <v-col cols="9" class="fill-height overflow-y-auto">
                <v-card
                    elevation="4"
                    rounded="lg"
                    class="fill-height overflow-y-auto mr-16"
                >
                    <v-row>
                        <v-col>
                            <PageTitle :name="props.title" />
                        </v-col>

                        <!-- Add action button here  (it should be optional and passed along from usage -->
                        <v-col>
                            <slot name="ActionButton"></slot>
                        </v-col>
                    </v-row>
                    <!-- Add vertical line here  -->
                    <horizontal-divider-line />

                    <slot name="PanelMain"></slot>
                    <!-- actual content here  -->
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useAppBarStore, useLayoutStore } from "@/stores/store";
import SettingsNavigation from "@/components/views/seb-server/settings-navigation/SettingsNavigation.vue";
import { translate } from "@/utils/generalUtils.ts";
import PageTitle from "@/components/views/seb-server/settings-navigation/widgets/PageTitle.vue";
import HorizontalDividerLine from "@/components/views/seb-server/settings-navigation/widgets/HorizontalDividerLine.vue";

const layoutStore = useLayoutStore();
const appBarStore = useAppBarStore();

const props = defineProps<{
    title: string;
}>();

onBeforeMount(() => {
    layoutStore.setBlueBackground(true);
    appBarStore.title = props.title;
});

onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});
</script>
