<template>
    <v-sheet class="rounded-lg ml-6 w-100 h-100 bg-primary">
        <v-col class="pt-0">
            <NavigationSection
                :title="translate('titles.settings')"
                :items="items"
                :show-title="false"
            />
        </v-col>
    </v-sheet>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { translate } from "@/utils/generalUtils";
import { useAbilities } from "@/services/ability";
import NavigationSection from "@/components/widgets/navigationWidgets/NavigationSection.vue";
import { buildSettingsNavigationItems } from "@/components/widgets/navigationWidgets/navigationSections";

const ability = useAbilities();

const items = computed(() =>
    buildSettingsNavigationItems(ability, "settingsNavigation"),
);
</script>
