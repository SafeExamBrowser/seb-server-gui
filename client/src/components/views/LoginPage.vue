<template>
    <v-main>
        <v-container class="fill-height d-flex align-center justify-center">

            <v-card class="pa-10">
                <div class="d-flex ml-15 mr-15 justify-center">
                    <img class="logo-img" src="/img/seb-logo-no-border.png" :alt="translate('screenReader.logo')" />
                </div>
                <div class="d-flex ml-15 mr-15 mt-5 justify-center">
                    <div class="text-h6">{{translate('loginPage.title')}}</div>
                </div>

                <div class="mt-10">
                    <AlertMsg 
                        v-if="loginError"
                        :alertProps="{
                            title: '',
                            color: 'error',
                            type: 'alert',
                            textKey: 'login-error'
                        }">
                    </AlertMsg>
                    <AlertMsg 
                        v-if="loadingStore.isTimeout"
                        :alertProps="{
                            title: '',
                            color: 'error',
                            type: 'alert',
                            textKey: 'timeout-error'
                        }">
                    </AlertMsg>
                </div>
                
                <v-card-title class="mt-10">
                    {{translate('loginPage.signIn')}}
                </v-card-title>
                <v-card-subtitle>
                    <span class="text-subtitle">
                        {{translate('loginPage.description')}}
                    </span>
                </v-card-subtitle>

                <v-card-text>
                    <v-form @keyup.enter="signIn()">
                        <v-text-field   
                            prepend-inner-icon="mdi-account-outline"
                            density="compact"
                            :placeholder="translate('loginPage.usernamePlaceholder')"
                            variant="outlined"
                            v-model="username">
                        </v-text-field>

                        <v-text-field
                            :type="passwordVisible ? 'text' : 'password'"
                            prepend-inner-icon="mdi-lock-outline"
                            density="compact"
                            :placeholder="translate('loginPage.passwordPlaceholder')"
                            variant="outlined"
                            v-model="password">

                            <template v-slot:append-inner>
                                <v-btn
                                    density="compact"
                                    variant="text"
                                    :icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click="passwordVisible = !passwordVisible">
                                </v-btn>
                            </template>

                        </v-text-field>

                        <v-btn
                            block
                            rounded="sm" 
                            color="primary"
                            @click="signIn()">
                            {{translate('loginPage.signIn')}}
                        </v-btn>

                    </v-form>

                    <div class="text-center mt-7">
                        <span>
                            {{translate('loginPage.noAccount')}} 
                        </span>
                        <span 
                            class="text-decoration-underline text-blue"
                            role="button" 
                            tabindex="0" 
                            @keydown="handleTabKeyEvent($event, 'navigate')">
                            <router-link :to=constants.REGISTER_ROUTE>
                                {{translate('loginPage.register')}}
                            </router-link>
                        </span>
                    </div>

                </v-card-text>

            </v-card>

        </v-container>
    </v-main>
</template>
  
<script setup lang="ts">
    import { ref, computed } from "vue";
    import * as authenticationService from "@/services/api-services/authenticationService";
    import {navigateTo} from "@/router/navigation";
    import { useLoadingStore, useAuthStore } from "@/stores/store";
    import { useTheme } from "vuetify";
    import * as constants from "@/utils/constants";
    import {translate} from "@/utils/generalUtils";

    const username = ref("");
    const password = ref("");
    const loginError = ref(false);

    const passwordVisible = ref<boolean>(false);

    //stores
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();

    //theme
    const theme = useTheme();
    const localStorageTheme: string | null = localStorage.getItem("theme");
    theme.global.name.value = localStorageTheme ?? theme.global.name.value ?? "light";
    const isDark = computed<boolean>(() => theme.global.current.value.dark);

    async function signIn(){
        loginError.value = false;
        loadingStore.isTimeout = false;

        try{
            const tokenObject: Token = await authenticationService.login(username.value, password.value);
            authStore.login(tokenObject.access_token, tokenObject.refresh_token);

        }catch(error){
            loginError.value = true;
        }
    }

    //todo: extract this function into a global file
    function handleTabKeyEvent(event: any, action: string){
        if (event.key == 'Enter' || event.key == ' ') {

            if(action == "navigate"){
                navigateTo(constants.REGISTER_ROUTE);
            }
        }
    }

</script>
  
<style scoped>

    .invert{
        filter: invert(1);
    }

    .logo-img {
        max-width: 150px;
        width: 100%;
        height: auto; 
    }

</style>