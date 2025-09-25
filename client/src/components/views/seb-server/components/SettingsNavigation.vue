<template>
    <v-col class="pt-0 h-100" cols="3">
        <v-sheet class="rounded-lg ml-6 w-100 h-100 bg-primary">
            <v-col class="pt-0">
                <v-divider class="section-divider" />
                <v-list-item
                    v-if="ability.canView(GUIComponent.LMSSetups)"
                    class="px-0 nav-hover"
                >
                    <router-link
                        class="link-color nav-link"
                        data-testid="settingsNavigation-assessmentToolConnections-link"
                        :to="constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE"
                    >
                        {{ translate("titles.assessmentToolConnections") }}
                    </router-link>
                </v-list-item>

                <v-divider
                    v-if="ability.canView(GUIComponent.ConnectionConfigs)"
                    class="section-divider"
                />
                <v-list-item
                    v-if="ability.canView(GUIComponent.ConnectionConfigs)"
                    class="px-0 nav-hover"
                >
                    <router-link
                        class="link-color nav-link"
                        data-testid="settingsNavigation-connectionConfigurations-link"
                        :to="constants.CONNECTION_CONFIGURATIONS_ROUTE"
                    >
                        {{
                            translate(
                                "navigation.routeNames.connectionConfiguration",
                            )
                        }}
                    </router-link>
                </v-list-item>

                <v-divider
                    v-if="ability.canView(GUIComponent.Certificates)"
                    class="section-divider"
                />
                <v-list-item
                    v-if="ability.canView(GUIComponent.Certificates)"
                    class="px-0 nav-hover"
                >
                    <router-link
                        class="link-color nav-link"
                        data-testid="settingsNavigation-certificates-link"
                        :to="constants.CERTIFICATES_ROUTE"
                    >
                        {{ translate("navigation.routeNames.certificates") }}
                    </router-link>
                </v-list-item>

                <v-divider
                    v-if="ability.canView(GUIComponent.UserAccounts)"
                    class="section-divider"
                />
                <v-list-item
                    v-if="ability.canView(GUIComponent.UserAccounts)"
                    class="px-0 nav-hover"
                >
                    <router-link
                        class="link-color nav-link"
                        data-testid="settingsNavigation-userAccounts-link"
                        :to="constants.USER_ACCOUNTS_ROUTE"
                    >
                        {{
                            translate("navigation.routeNames.userAccounts")
                        }}</router-link
                    >
                </v-list-item>

                <v-divider class="section-divider mb-10" />
            </v-col>
        </v-sheet>
    </v-col>
</template>

<script setup lang="ts">
import * as constants from "@/utils/constants";
import { translate } from "@/utils/generalUtils";
import { GUIComponent, useAbilities } from "@/services/ability";
import { navigateTo } from "@/router/navigation";
import { onBeforeMount } from "vue";

const ability = useAbilities();

onBeforeMount(async () => {
    // check user rights and go back to home if not allowed to view this page
    if (!ability.canView(GUIComponent.UserAccounts)) {
        navigateTo(constants.HOME_PAGE_ROUTE);
        return;
    }
});
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
        rgba(255, 255, 255, 0.9) 30%,
        rgba(255, 255, 255, 0.86) 40%,
        rgba(255, 255, 255, 0.8) 60%,
        rgba(255, 255, 255, 0.7) 68%,
        rgba(255, 255, 255, 0.6) 75%,
        rgba(255, 255, 255, 0.45) 82%,
        rgba(33, 92, 175, 0.2) 88%,
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
    background-color: #dcdcdc !important;
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
    gap: 0rem;
}

.custom-role-checkbox input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #215cae;
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
