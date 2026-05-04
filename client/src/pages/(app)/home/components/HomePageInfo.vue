<template>
    <v-row data-testid="homePageInfo-page-container" dense>
        <!-- Title -->
        <v-col
            class="pl-10"
            cols="12"
            data-testid="homePageInfo-title-col"
            md="10"
        >
            <div
                class="primary-text-color text-h4 font-weight-bold"
                data-testid="homePageInfo-title-text"
            >
                {{ translate("titles.home") }}
            </div>
        </v-col>

        <v-col
            class="pl-10"
            cols="12"
            data-testid="homePageInfo-spacer-col"
            md="2"
        ></v-col>
    </v-row>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";
</script>
