<template>

    <v-row dense>
        <!-- Breadcrumb -->
        <v-col cols="12" md="10" class="pl-5 mb-1">
            <div class="path-text d-flex align-center">
            <span
                class="breadcrumb-link"
                @click="navigateTo(constants.HOME_PAGE_ROUTE)"
            >
                {{ translate("titles.home") }}
            </span>
                <span class="breadcrumb-arrow">›</span>
            </div>
        </v-col>

        <!-- Title -->
        <v-col cols="12" md="10" class="pl-10">
            <div class="primary-text-color text-h4 font-weight-bold">
                {{ translate("titles.createTemplate") }}
            </div>
        </v-col>

        <v-col cols="12" md="2" class="pl-10"></v-col>
    </v-row>


    <!-- Main Content -->
    <v-container class="px-md-10 px-5 mt-4">
        <v-row class="mt-16" align="stretch" justify="start" no-gutters>
            <v-spacer/>
            <v-col cols="10">
                <v-row>
                    <!-- Info -->
                    <div class="section-heading ml-1 text-h5 font-weight-bold text-primary">
                        {{ translate("templates.createTemplate.info") }}
                    </div>
                    <div class="heading-underline mt-3"></div>

                    <!-- Configuration Template -->
                    <v-col cols="12" md="6" class="pr-md-3 mb-4 mb-md-0">
                        <v-card
                            class="template-card"
                            variant="flat"
                            elevation="0"
                            role="button"
                            tabindex="0"
                            @click="goToSebClientCreation"
                            @keyup.enter="goToSebClientCreation"
                            @keyup.space.prevent="goToSebClientCreation"
                        >
                            <v-row no-gutters class="template-card__content">
                                <v-col cols="7" class="template-card__text">
                                    <div class="template-card__title">
                                        {{ translate("templates.createTemplate.sebClientTemplate") }}

                                    </div>
                                    <div class="template-card__body mt-3">
                                        {{ translate("templates.createTemplate.sebClientTemplateInfo") }}

                                    </div>
                                </v-col>

                                <v-spacer/>
                                <div class="card-divider"></div>
                                <v-col cols="1" class="right-rail d-flex align-center">
                                    <v-btn class="chevron-btn mx-2" icon variant="text"
                                           aria-label="Create Configuration Template">
                                        <v-icon icon="mdi-chevron-right"></v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>

                    <!-- Exam Template -->
                    <v-col cols="12" md="6" class="pl-md-3">
                        <v-card
                            class="template-card"
                            variant="flat"
                            elevation="0"
                            role="button"
                            tabindex="0"
                            @click="goToExamTemplateCreation"
                            @keyup.enter="goToExamTemplateCreation"
                            @keyup.space.prevent="goToExamTemplateCreation"
                        >
                            <v-row no-gutters class="template-card__content">
                                <v-col cols="7" class="template-card__text">
                                    <div class="template-card__title">
                                        {{ translate("templates.createTemplate.examTemplate") }}
                                    </div>
                                    <div class="template-card__body mt-3">
                                        {{ translate("templates.createTemplate.examTemplateInfo") }}

                                    </div>
                                </v-col>

                                <v-spacer/>
                                <div class="card-divider"></div>
                                <v-col cols="1" class="right-rail d-flex align-center">
                                    <v-btn class="chevron-btn mr-2 mt-2 mb-2" icon variant="text"
                                           aria-label="Create Exam Template">
                                        <v-icon icon="mdi-chevron-right"></v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-spacer/>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import {translate} from "@/utils/generalUtils";
import {navigateTo} from "@/router/navigation";
import * as constants from "@/utils/constants";

const goToSebClientCreation = () => navigateTo(constants.CREATE_SEB_CLIENT_TEMPLATE_ROUTE);
const goToExamTemplateCreation = () => navigateTo(constants.CREATE_EXAM_TEMPLATE_ROUTE);
</script>

<style scoped>
.heading-underline {
    height: 1px;
    width: 100%;
    background: #e2e2e2;
    border-radius: 999px;
}

.template-card {
    position: relative;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    background: #fff;
    transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease, border-color 160ms ease;
    box-shadow: 0 2px 10px rgba(20, 40, 80, 0.04);
    cursor: pointer;
    min-height: 180px;
    padding-left: 22px;
}

.template-card:hover,
.template-card:focus-visible {
    transform: scale(1.01);
    border-color: color-mix(in oklab, #215caf 25%, rgba(0, 0, 0, 0.06));
    background-color: color-mix(in oklab, #215caf 6%, #fff);
    box-shadow: 0 8px 24px rgba(20, 40, 80, 0.1);
    outline: none;
}

.template-card__content {
    display: flex;
    align-items: stretch;
    padding: 24px 20px;
}

.template-card__text {
    flex: 1 1 auto;
    min-width: 0;
}

.template-card__title {
    color: #215caf;
    font-weight: 800;
    font-size: clamp(20px, 2.2vw, 24px);
    line-height: 1.1;
    letter-spacing: 0.1px;
}

.template-card__body {
    color: rgba(0, 0, 0, 0.7);
    font-size: 0.98rem;
    line-height: 1.5;
}

.right-rail {
    gap: 0;
}

.card-divider {
    width: 1px;
    background: #e5e7eb;
}

.chevron-btn :deep(.v-btn__content) {
    transform: translateX(0);
    transition: transform 160ms ease;
}

.template-card:hover .chevron-btn :deep(.v-btn__content),
.template-card:focus-visible .chevron-btn :deep(.v-btn__content) {
    transform: translateX(2px);
}

/* Responsive */
@media (max-width: 960px) {
    .template-card__content {
        padding: 20px 16px;
    }
}
</style>
