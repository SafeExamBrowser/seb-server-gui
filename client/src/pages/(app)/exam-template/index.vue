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
                v-model="searchInputValue"
                search-text="examTemplateList.info.nameSearchPlaceholder"
                :filter-sections="filterSections"
                :filter-values="selectedFilters"
                :data-test-id="dataTestId"
                @search="onSearch"
                @clear="onClearSearch"
                @update:filter-values="setFilters"
                @clear-filters="clearAll"
            />
        </template>
        <template #PanelMain>
            <!-- TODO @andrei: properly display errors, once we have a proper generic error component -->
            <div v-if="deleteError">
                {{ deleteError }}
            </div>
            <div v-else-if="copyError">
                {{ copyError }}
            </div>
            <LoadingFallbackComponent :loading="false" :errors="errors">
                <EntityTable
                    :headers="headers"
                    :items="items"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="tableLoading"
                    :detail-route="tableDetailRoute"
                    :cell-formatters="cellFormatters"
                    :actions="entityTableActions"
                    :data-test-id="dataTestId"
                    @update:options="loadItems"
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
        v-model="deleteDialogOpen"
        :detail-text="deleteDetailText"
        translation-key-prefix="examTemplateList"
        @confirm="confirmDelete"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useExamTemplateTableHeaders } from "./composables/useExamTemplateTableHeaders.ts";
import { useExamTemplateTableActions } from "./composables/useExamTemplateTableActions.ts";
import { useExamTemplateList } from "./composables/useExamTemplateList.ts";
import { useExamTemplateDeleteFlow } from "./composables/useExamTemplateDeleteFlow.ts";
import { useExamTemplateCopyFlow } from "./composables/useExamTemplateCopyFlow.ts";
import {
    isExamTemplateTableItem,
    type ExamTemplateTableItem,
} from "./types.ts";

const dataTestId = "examTemplates";

const router = useRouter();

const createExamTemplateDetailRoute = (
    item: ExamTemplateTableItem,
): RouteLocationAsRelative => ({
    name: "/(app)/exam-template/[id]/",
    params: { id: item.id },
});

const tableDetailRoute = (item: TableItem): RouteLocationAsRelative | null => {
    if (!isExamTemplateTableItem(item)) {
        return null;
    }

    return createExamTemplateDetailRoute(item);
};

const { headers, cellFormatters } = useExamTemplateTableHeaders();

const {
    items,
    pageCount,
    loading,
    errors,
    options,
    searchInputValue,
    selectedFilters,
    filterSections,
    onSearch,
    onClearSearch,
    setFilters,
    clearAll,
    loadItems,
    reload: reloadList,
} = useExamTemplateList();

const {
    deleteDialogOpen,
    deleteDetailText,
    deleteError,
    deleteLoading,
    openDeleteDialog,
    confirmDelete,
} = useExamTemplateDeleteFlow({ reloadList });

const { copy, copyLoading, copyError } = useExamTemplateCopyFlow({
    reloadList,
});

const tableLoading = computed(
    () => loading.value || deleteLoading.value || copyLoading.value,
);

const entityTableActions = useExamTemplateTableActions({
    onEdit: (item) => {
        router.push(createExamTemplateDetailRoute(item));
    },
    onCopy: (item) => {
        copy(item);
    },
    onDelete: openDeleteDialog,
});
</script>
