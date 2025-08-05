<template>
    <v-row>
        <v-col cols="12">
            <!-- Infos -->
            <v-row>
                <v-col cols="12">
                    <HonePageInfo />
                </v-col>
            </v-row>

            <!-- Main movable things here -->
            <v-row>
                <v-col cols="12">
                    <div class="dashboard-toolbar">
                        <v-btn color="primary" @click="addWidget">Add Widget</v-btn>
                        <v-btn color="error" @click="clearWidgets">Clear All</v-btn>
                    </div>
                    <div class="grid-stack"></div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

import { useAppBarStore } from '@/stores/store';
import { useAuthStore, useUserAccountStore } from '@/stores/authentication/authenticationStore';
import { useI18n } from 'vue-i18n';
import { translate } from '@/utils/generalUtils';
import HonePageInfo from '@/components/views/seb-server/home/HonePageInfo.vue';

const appBarStore = useAppBarStore();
const authStore = useAuthStore();
const i18n = useI18n();

let grid: GridStack;

const addWidget = () => {
    const nodeCount = grid.engine.nodes.length + 1;
    grid.addWidget({
        w: 2,
        h: 2,
        el: createWidgetElement(nodeCount)
    });
};



const clearWidgets = () => {
    grid.removeAll();
};

const createWidgetElement = (index: number): HTMLElement => {
    const el = document.createElement('div');
    el.innerHTML = `
    <div class="grid-stack-item-content">
      <div class="v-sheet theme--light elevation-1 pa-4">
        <strong>Widget ${index}</strong>
        <div>Content</div>
      </div>
    </div>
  `;
    return el;
};




onMounted(() => {
    appBarStore.title = translate('titles.home');
    console.log(useUserAccountStore().userAccount);

    grid = GridStack.init({
        column: 6,
        float: true,
        cellHeight: 100,
        resizable: {
            handles: 'all'
        }
    });
});
</script>

<style scoped>
.grid-stack-item-content {
    background: #2196F3;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border-radius: 4px;
    font-weight: bold;
}

.dashboard-toolbar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}
</style>
