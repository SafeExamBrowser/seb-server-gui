<template>
    <!-----------gallery image---------->
    <v-hover v-slot="{isHovering, props}">
        <!--todo: add max height  -->
        <v-img
            eager
            tabindex="0"   
            @focus="setTabFocus($event)"
            @keydown="registerKeyPress($event)"
            @mousedown="registerKeyPress($event)"
            v-if="screenshot"
            v-bind="props"
            class="img-styling" 
            @dblclick="openDialog()"
            :aspect-ratio="16/9"
            :class="{'on-hover': isHovering}"
            :src="linkService.getLatestImageLink(screenshot, timestamp.toString())">

            <div v-if="isHovering || galleryStore.focusedImageIndexes[index]" class="hover-overlay d-flex">
                <v-row>
                    <v-col>
                        <div v-if="appBarStore.galleryIsMetadataEnabled">
                            <v-expansion-panels color="#404040">
                                <v-expansion-panel  
                                    :title="i18n.t('galleryView.metadata')">
                                    <v-expansion-panel-text>
                                        <v-row v-for="(value, key) in galleryViewService.getScreenshotMetadata(screenshot.metaData)" :key="key" no-gutters>
                                            <v-col>
                                                {{key}}
                                            </v-col>
                                            <v-col>
                                                {{value}}
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </div>
                    </v-col>
                </v-row>

                <v-row align="end">
                    <v-col>
                        <v-sheet class="d-flex pa-2 button-row">
                            <div class="text-body-1 title-box">
                                <template v-if="appBarStore.galleryIsNameEnabled">{{screenshot.clientName}}</template>
                                <template v-if="appBarStore.galleryIsNameEnabled && appBarStore.galleryIsIpEnabled"> / </template>
                                <template v-if="appBarStore.galleryIsIpEnabled">{{screenshot.clientIp}}</template>
                            </div>
                            <v-spacer></v-spacer>
                            <span>
                                <v-btn 
                                    rounded="sm" 
                                    color="white" 
                                    variant="outlined" 
                                    icon="mdi-arrow-expand"
                                    size="small"
                                    :aria-label="i18n.t('galleryView.screenReader.expandImage')"
                                    @click="openDialog()">
                                </v-btn>

                                <v-btn
                                    rounded="sm" 
                                    color="primary" 
                                    variant="flat" 
                                    class="ml-2"
                                    icon="mdi-video"
                                    size="small"
                                    :aria-label="i18n.t('galleryView.screenReader.openProcotringView')"
                                    @click="galleryViewService.navigateToProctoringView(screenshot, groupUuid)">
                                </v-btn>
                            </span>
                        </v-sheet>
                    </v-col>
                </v-row>
            </div>
        </v-img>
        <v-img 
            v-else 
            eager
            class="content-filler"
            :aspect-ratio="16/9"
            :src="linkService.getLatestImageLink(screenshot, timestamp.toString())">
        </v-img>
    </v-hover>
    <!-------------------------->

    <!-----------expanded image---------->      
    <v-dialog v-model="dialog" max-width="1500">
        <v-card>
            <v-img 
                eager
                v-if="screenshot"
                class="img-styling"
                :aspect-ratio="16/9"
                :src="expandedScreenshotLink">

                <div class="hover-overlay-expanded d-flex">
                    <v-row>
                        <v-col>
                            <div>
                                <v-expansion-panels>
                                    <v-expansion-panel>
                                        <v-expansion-panel-title color="#404040">
                                            
                                            <template v-slot:default="{ expanded }">
                                                <v-icon
                                                    class="mr-2"
                                                    :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'">
                                                </v-icon>
                                                {{ $t('galleryView.metadata') }}
                                            </template>
                                            
                                            <template v-slot:actions="{ expanded }">
                                                <v-btn
                                                    color="white" 
                                                    variant="outlined" 
                                                    rounded="sm"
                                                    icon="mdi-arrow-collapse"
                                                    size="small"
                                                    :aria-label="i18n.t('galleryView.screenReader.collapseImage')"
                                                    @click="closeDialog()">
                                                </v-btn>
                                            </template>

                                        </v-expansion-panel-title>
                                        <v-expansion-panel-text>
                                            <div class="metadata-container">
                                                <v-table density="compact">
                                                    <tbody>
                                                        <tr v-for="(value, key) in galleryViewService.getScreenshotMetadata(screenshot.metaData)" 
                                                            :key="key">
                                                            <td>
                                                                {{key}}
                                                            </td>
                                                            <td align="right">
                                                                {{value}}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </v-table>
                                            </div>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </div>
                        </v-col>
                    </v-row>

                    <v-row align="end">
                        <v-col>
                            <v-sheet class="d-flex pa-2 button-row">
                                <div class="text-body-1 title-box">
                                    {{screenshot.clientName}} / {{screenshot.clientIp}}
                                </div>
                                <v-spacer></v-spacer>
                                <span>
                                    <v-btn
                                        rounded="sm" 
                                        color="primary" 
                                        variant="flat" 
                                        class="ml-2"
                                        icon="mdi-video"
                                        size="small"
                                        :aria-label="i18n.t('galleryView.screenReader.openProcotringView')"
                                        @click="galleryViewService.navigateToProctoringView(screenshot, groupUuid)">
                                    </v-btn>
                                </span>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </div>

            </v-img>
        </v-card>
    </v-dialog>
    <!-------------------------->
</template>


<script setup lang="ts">
    import { ref, computed, onBeforeMount } from "vue";
    import * as galleryViewService from "@/services/screen-proctoring/component-services/galleryViewService";
    import * as linkService from "@/services/screen-proctoring/component-services/linkService";
    import { useAppBarStore, useGalleryStore } from "@/stores/store";
    import { useI18n } from "vue-i18n";

    //props
    const props = defineProps<{
        screenshot: ScreenshotData | undefined,
        timestamp: number,
        groupUuid: string,
        index: number
    }>();

    //store
    const appBarStore = useAppBarStore();
    const galleryStore = useGalleryStore();

    //i18n
    const i18n = useI18n();

    //dialog - expanded image
    const dialog = ref(false);

    //accessibility
    const isTabFocused = ref<boolean>(false);
    const lastKeyPressed = ref<string | null>("Tab");

    onBeforeMount(() => {
        galleryStore.focusedImageIndexes[props.index] = false;
    });

    function openDialog(){
        dialog.value = true;
    }

    function closeDialog(){
        dialog.value = false;
    }

    const expandedScreenshotLink = computed<string>(() => {
        return linkService.getLatestImageLink(props.screenshot, props.timestamp.toString());
    });                                                         

    function setTabFocus(event: any){   
        if(lastKeyPressed.value != "Tab" || lastKeyPressed.value == null){
            return;
        }

        galleryStore.focusedImageIndexes[props.index] = true;

        for(let i = 0; i < galleryStore.focusedImageIndexes.length; i++){
            if(i != props.index){
                galleryStore.focusedImageIndexes[i] = false;
            }
        }

        lastKeyPressed.value = null
    }

    function registerKeyPress(event: any){
        lastKeyPressed.value = event.key;
    }

</script>

<style scoped>

    .img-styling{
        background-color: black;
    }

    .img-styling .hover-overlay {
        position: absolute;                     
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 0;
        background-color: rgba(255, 255, 255, 0.3);
        flex-direction: column;
        justify-content: space-between;
    }

    .img-styling .hover-overlay-expanded {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 0;
        flex-direction: column;
        justify-content: space-between;
    }

    .button-row {
        background-color: #404040;
        align-items: center;
        justify-content: center;
    }

    .title-box{
        color: white;
    }

    .content-filler{
        visibility: hidden;
    }

    .metadata-container{
        margin: auto;
        width: 60%;
    }

</style>