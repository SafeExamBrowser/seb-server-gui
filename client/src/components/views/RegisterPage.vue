<template>
    <v-main>
        <v-container class="fill-height d-flex align-center justify-center">

            <v-card class="pa-10">
                <div class="d-flex ml-15 mr-15 justify-center">
                    <img class="logo-img" src="/img/seb-logo-no-border.png" alt="SEB Logo" />
                </div>
                <div class="d-flex ml-15 mr-15 mt-5 justify-center">
                    <div class="text-h6">SEB Server</div>
                </div>

                <div class="mt-10">
                    <AlertMsg
                        v-if="registerError"
                        :alertProps="{
                            title: '',
                            color: 'error',
                            type: 'alert',
                            textKey: 'register-error'
                        }">
                    </AlertMsg>
                    <AlertMsg
                        v-if="registerSuccess"
                        :alertProps="{
                            title: '',
                            color: 'success',
                            type: 'alert',
                            textKey: 'register-success'
                        }">
                    </AlertMsg>
                </div>

                <v-card-title class="mt-10">
                    Register
                </v-card-title>
                <v-card-subtitle>Please fill the form to register for a SEB Server account.</v-card-subtitle>

                <v-card-text>
                    <v-form @keyup.enter="register()">

                        <!--name-->
                        <v-text-field
                            required
                            prepend-inner-icon="mdi-account-outline"
                            density="compact"
                            placeholder="Name *"
                            variant="outlined"
                            v-model="name">
                        </v-text-field>

                        <!--surname-->
                        <v-text-field
                            required
                            prepend-inner-icon="mdi-account-outline"
                            density="compact"
                            placeholder="Surname *"
                            variant="outlined"
                            v-model="surname">
                        </v-text-field>

                        <!--username-->
                        <v-text-field
                            required
                            prepend-inner-icon="mdi-account-outline"
                            density="compact"
                            placeholder="Username *"
                            variant="outlined"
                            v-model="username">
                        </v-text-field>

                        <!--email-->
                        <v-text-field
                            prepend-inner-icon="mdi-email-outline"
                            density="compact"
                            placeholder="Email"
                            variant="outlined"
                            v-model="email">
                        </v-text-field>

                        <!--timezone-->
                        <v-text-field
                            prepend-inner-icon="mdi-map-clock-outline"
                            density="compact"
                            placeholder="Time zone"
                            variant="outlined"
                            v-model="timezone">
                        </v-text-field>

                        <!--password-->
                        <v-text-field
                            required
                            :type="passwordVisible ? 'text' : 'password'"
                            prepend-inner-icon="mdi-lock-outline"
                            density="compact"
                            placeholder="Password *"
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

                        <!--confirm password-->
                        <v-text-field
                            required
                            :type="confirmPasswordVisible ? 'text' : 'password'"
                            prepend-inner-icon="mdi-lock-outline"
                            density="compact"
                            placeholder="Confirm password *"
                            variant="outlined"
                            v-model="confirmPassword">

                            <template v-slot:append-inner>
                                <v-btn
                                    density="compact"
                                    variant="text"
                                    :icon="confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click="confirmPasswordVisible = !confirmPasswordVisible">
                                </v-btn>
                            </template>
                        </v-text-field>

                        <!--register button-->
                        <v-btn
                            block
                            rounded="sm"
                            color="primary"
                            @click="register()">
                            Register
                        </v-btn>

                    </v-form>

                    <div class="text-center mt-7">
                        <span>
                            Already have an account?
                        </span>
                        <span
                            class="text-decoration-underline"
                            role="button"
                            tabindex="0"
                            @keydown="handleTabKeyEvent($event, 'navigate')">
                            <router-link :to=constants.DEFAULT_ROUTE>Login</router-link>
                        </span>
                    </div>

                </v-card-text>

            </v-card>

        </v-container>
    </v-main>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    // import * as userAccountService from "@/services/api-services/userAccountService";
    import {navigateTo} from "@/router/navigation";
    import * as constants from "@/utils/constants";

    //form fields
    const name = ref<string>("");
    const surname = ref<string>("");
    const username = ref<string>("");
    const email = ref<string>();
    const timezone = ref<string>();
    const password = ref<string>("");
    const confirmPassword = ref<string>("");

    //error handling
    const registerError = ref(false);
    const registerSuccess = ref(false);

    //password icon logic
    const passwordVisible = ref<boolean>(false);
    const confirmPasswordVisible = ref<boolean>(false);


    async function register(){
        registerError.value = false;
        registerSuccess.value = false;

        try{
            // const userAccount: object = await userAccountService.register(name.value, surname.value, username.value, password.value, confirmPassword.value, email.value, timezone.value);
            registerSuccess.value = true;

        }catch(error){
            //todo: add better error handling
            console.error(error)
            registerError.value = true;
        }

    }

    //todo: extract this function into a global file
    function handleTabKeyEvent(event: any, action: string){
        if (event.key == 'Enter' || event.key == ' ') {

            if(action == "navigate"){
                navigateTo(constants.DEFAULT_ROUTE);
            }
        }
    }

</script>


<style scoped>

    .logo-img {
        max-width: 150px;
        width: 100%;
        height: auto; 
    }

</style>
