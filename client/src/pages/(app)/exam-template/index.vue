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
            <div v-if="deleteError" class="px-6 pt-4 text-error">
                {{ deleteError }}
            </div>
            <div v-else-if="copyError" class="px-6 pt-4 text-error">
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
import { computed, ref } from "vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import { useExamTemplates } from "./composables/api/useExamTemplates.ts";
import { useDeleteExamTemplate } from "./composables/api/useDeleteExamTemplate.ts";
import { useCopyExamTemplate } from "./composables/api/useCopyExamTemplate.ts";
import { useExamTemplateTableHeaders } from "./composables/useExamTemplateTableHeaders.ts";
import { useExamTemplateTableActions } from "./composables/useExamTemplateTableActions.ts";
import {
    useExamTemplateFilters,
    EXAM_TYPE_FILTER_KEY,
} from "./composables/useExamTemplateFilters.ts";
import {
    isExamTemplateTableItem,
    type ExamTemplateTableItem,
} from "./types.ts";

const dataTestId = "examTemplates";

const router = useRouter();

const examTemplateDetailRoute = (
    item: ExamTemplateTableItem,
): RouteLocationAsRelative => ({
    name: "/(app)/exam-template/[id]/",
    params: { id: String(item.id) },
});

const tableDetailRoute = (item: TableItem): RouteLocationAsRelative | null => {
    if (!isExamTemplateTableItem(item)) {
        return null;
    }

    return examTemplateDetailRoute(item);
};

const { headers, cellFormatters } = useExamTemplateTableHeaders();
const filterSections = useExamTemplateFilters();

const {
    searchInputValue,
    searchField,
    selectedFilters,
    options,
    loadItems,
    onSearch,
    onClearSearch,
    setFilters,
    clearAll,
} = useUrlTableState(async () => {
    await fetchExamTemplates();
}, [EXAM_TYPE_FILTER_KEY]);

options.value.sortBy = [{ key: "name", order: "asc" }];

const selectedExamType = computed(
    () => selectedFilters.value[EXAM_TYPE_FILTER_KEY],
);

const {
    data,
    loading: isLoading,
    error,
    fetchData: fetchExamTemplates,
} = useExamTemplates(options, searchField, selectedExamType);

const items = computed(() => data.value?.content ?? []);
const pageCount = computed(() => data.value?.number_of_pages ?? 0);
const errors = computed(() => (error.value ? [error.value] : []));

const {
    mutateData: deleteTemplate,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteExamTemplate();
const {
    mutateData: copyTemplate,
    loading: copyLoading,
    error: copyError,
} = useCopyExamTemplate();

const tableLoading = computed(
    () => isLoading.value || deleteLoading.value || copyLoading.value,
);

const reloadAndClampPage = async () => {
    await fetchExamTemplates();

    const total = pageCount.value;

    if (options.value.page <= total) {
        return;
    }

    options.value.page = Math.max(1, total);

    await fetchExamTemplates();
};

const deleteTarget = ref<ExamTemplateTableItem | null>(null);
const deleteDialogOpen = ref(false);

const deleteDetailText = computed(() =>
    deleteTarget.value ? String(deleteTarget.value.name ?? "") : "",
);

const openDeleteDialog = (item: ExamTemplateTableItem) => {
    deleteTarget.value = item;
    deleteDialogOpen.value = true;
};

const confirmDelete = async () => {
    const target = deleteTarget.value;
    deleteDialogOpen.value = false;

    if (!target) {
        return;
    }

    await deleteTemplate(target.id);

    if (deleteError.value !== undefined) {
        return;
    }

    await reloadAndClampPage();
};

const tableActions = useExamTemplateTableActions({
    onEdit: (item) => {
        void router.push(examTemplateDetailRoute(item));
    },
    onCopy: async (item) => {
        await copyTemplate(item.id);

        if (copyError.value !== undefined) {
            return;
        }

        await fetchExamTemplates();
    },
    onDelete: openDeleteDialog,
});

const entityTableActions = computed<TableAction[]>(() =>
    tableActions.value.map((action) => ({
        ...action,
        onClick: (item: TableItem) => {
            if (!isExamTemplateTableItem(item)) {
                return;
            }

            return action.onClick(item);
        },
        visible: action.visible
            ? (item: TableItem) => {
                  if (!isExamTemplateTableItem(item)) {
                      return false;
                  }

                  return action.visible?.(item) ?? false;
              }
            : undefined,
        disabled: action.disabled
            ? (item: TableItem) => {
                  if (!isExamTemplateTableItem(item)) {
                      return false;
                  }

                  return action.disabled?.(item) ?? false;
              }
            : undefined,
    })),
);
</script>
