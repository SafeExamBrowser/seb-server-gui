<template>
    <v-col cols="3" class="pt-0 h-100">
        <v-sheet  class="rounded-lg ml-6 w-100 h-100 bg-primary">
            <v-col class="pt-0">
                <v-divider class="section-divider" />

                <v-list-item class="px-0 nav-hover">
                    <router-link class="link-color nav-link" :to="constants.ASSESSMENT_TOOL_CONNECTIONS">
                        {{ translate("titles.assessmentToolConnections") }}
                    </router-link>
                </v-list-item>

                <v-divider class="section-divider" />

                <v-list-item class="px-0 nav-hover">
                    <span class="link-color nav-link">{{ translate("navigation.routeNames.connectionConfiguration") }}</span>
                </v-list-item>

                <v-divider class="section-divider" />

                <v-list-item class="px-0 nav-hover">
                    <span class="link-color nav-link">{{ translate("navigation.routeNames.certificates") }}</span>
                </v-list-item>

                <v-divider class="section-divider" />

                <v-list-item class="px-0 nav-hover">
                    <router-link class="link-color nav-link" :to="constants.USER_ACCOUNTS_ROUTE">{{ translate("navigation.routeNames.userAccounts") }}</router-link>
                </v-list-item>

                <v-divider class="section-divider mb-10" />
            </v-col>

        </v-sheet>
    </v-col>
</template>
<script setup lang="ts">
import * as constants from "@/utils/constants";
import {translate} from "@/utils/generalUtils";
</script>

<style scoped>
.nav-hover:hover .nav-link {
    color: #215caf;
}

.nav-link {
    transition: color 0.4s ease;
    margin-left: 10px;
}

.nav-hover {
    transition: background 0.4s ease;
    border-radius: 4px;
    background: transparent;
    padding-left: 8px;
    width: 85% !important;
}

.nav-hover:hover {
    background: linear-gradient(
        to right,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.98) 10%,
        rgba(255, 255, 255, 0.96) 20%,
        rgba(255, 255, 255, 0.93) 25%,
        rgba(255, 255, 255, 0.90) 30%,
        rgba(255, 255, 255, 0.86) 40%,
        rgba(255, 255, 255, 0.80) 60%,
        rgba(255, 255, 255, 0.70) 68%,
        rgba(255, 255, 255, 0.60) 75%,
        rgba(255, 255, 255, 0.45) 82%,
        rgba(33, 92, 175, 0.20) 88%,
        rgba(33, 92, 175, 0.12) 92%,
        rgba(33, 92, 175, 0.08) 96%,
        rgba(33, 92, 175, 0.04) 98%,
        rgba(33, 92, 175, 0.01) 99%,
        rgba(33, 92, 175, 0) 100%
    );
}

.link-color {
    color: white;
    text-decoration: none;
}

.section-divider {
    background-color: white !important;
    height: 1px !important;
    opacity: 1 !important;
    width: 85% !important;
}

.w-98 {
    width: 98% !important;
}

.custom-divider {
    background-color: #DCDCDC !important;
    height: 1px;
    width: 100%;
}

.success-message-div {
    margin-top: 25.5rem;
    width: 85% !important;
}

.custom-padding-textbox {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
}

.custom-role-checkbox {
    display: flex;
    align-items: center;
    gap: 0.0rem;
}

.custom-role-checkbox input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #215CAE;
    border-radius: 50%;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    flex-shrink: 0;
}

.custom-role-checkbox input[type="checkbox"]:checked {
    border-width: 6px;
}

.custom-role-checkbox label {
    color: #215caf;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    font-family: Roboto, sans-serif;
    letter-spacing: 0.15px;
    cursor: pointer;
}
</style>
