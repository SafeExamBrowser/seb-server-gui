<template>
    <BasicPage
        :title="$t('titles.examTemplateList')"
        :bread-crumb="[
            {
                label: $t('titles.examTemplateList'),
            },
        ]"
        :data-test-id="dataTestId"
    >
        <template #PanelTop>
            <SearchBar
                v-model="list.searchInputValue"
                search-text="examTemplateList.info.nameSearchPlaceholder"
                :filter-sections="list.filterSections"
                :filter-values="list.selectedFilters"
                :data-test-id="dataTestId"
                @search="list.onSearch"
                @clear="list.onClearSearch"
                @update:filter-values="list.setFilters"
                @clear-filters="list.clearAll"
            />
        </template>
        <template #PanelMain>
            <!-- TODO @andrei: properly display errors, once we have a proper generic error component -->
            <div v-if="deleteFlow.error">
                {{ deleteFlow.error }}
            </div>
            <div v-else-if="copyFlow.error">
                {{ copyFlow.error }}
            </div>
            <LoadingFallbackComponent :loading="false" :errors="list.errors">
                <EntityTable
                    :headers="list.headers"
                    :items="list.items"
                    :page-count="list.pageCount"
                    :options="list.options"
                    :loading="list.loading"
                    :detail-route="list.detailRoute"
                    :cell-formatters="list.cellFormatters"
                    :actions="list.actions"
                    :data-test-id="dataTestId"
                    @update:options="list.loadItems"
                >
                    <template #cell-examType="{ formattedValue }">
                        <v-chip size="small" variant="tonal">
                            {{ formattedValue }}
                        </v-chip>
                    </template>
                </EntityTable>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>

    <DeleteConfirmDialog
        v-model="deleteFlow.dialogOpen"
        :detail-text="deleteFlow.detailText"
        translation-key-prefix="examTemplateList"
        @confirm="deleteFlow.confirm"
    />
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useExamTemplateOverview } from "./composables/useExamTemplateOverview.ts";

const dataTestId = "examTemplates";

const { list, deleteFlow, copyFlow } = useExamTemplateOverview();
</script>
