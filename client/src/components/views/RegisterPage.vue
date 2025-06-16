<template>
    <v-main>
        <v-container class="fill-height d-flex align-center justify-center">
            <v-row justify="center" class="w-100">
                <v-col cols="12" sm="6" md="6" lg="8">
                    <v-card class="pa-8">

                        <div class="d-flex ml-15 mr-15 justify-center">
                            <img class="logo-img" src="/img/seb-logo-no-border.png" alt="SEB Logo"/>
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
                            <v-form ref="formRef" @keyup.enter="register()">
                                <v-row dense>
                                    <v-col cols="12" md="6">
                                        <v-select
                                            required
                                            prepend-inner-icon="mdi-domain"
                                            density="compact"
                                            label="Institution *"
                                            variant="outlined"
                                            v-model="selectedInstitution"
                                            :items="institutions"
                                            item-title="name"
                                            item-value="modelId"
                                            :rules="[requiredRule]"
                                            :disabled="institutionSelectDisabled"
                                        />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            required
                                            prepend-inner-icon="mdi-account-outline"
                                            density="compact"
                                            label="Username *"
                                            variant="outlined"
                                            v-model="username"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            required
                                            prepend-inner-icon="mdi-account-outline"
                                            density="compact"
                                            label="Name *"
                                            variant="outlined"
                                            v-model="name"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            required
                                            prepend-inner-icon="mdi-account-outline"
                                            density="compact"
                                            label="Surname *"
                                            variant="outlined"
                                            v-model="surname"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            prepend-inner-icon="mdi-email-outline"
                                            density="compact"
                                            label="Email"
                                            variant="outlined"
                                            v-model="email"
                                            :rules="[emailRule]"
                                            validate-on="blur"
                                        />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-select
                                            required
                                            prepend-inner-icon="mdi-map-clock-outline"
                                            density="compact"
                                            label="Time zone *"
                                            variant="outlined"
                                            v-model="timezone"
                                            :items="timezoneOptions"
                                            :rules="[requiredRule]"
                                            :return-object="false"
                                        />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            required
                                            :type="passwordVisible ? 'text' : 'password'"
                                            prepend-inner-icon="mdi-lock-outline"
                                            density="compact"
                                            label="Password *"
                                            variant="outlined"
                                            v-model="password"
                                            :rules="[requiredRule, passwordRule]"
                                            validate-on="blur"
                                        >
                                            <template v-slot:append-inner>
                                                <v-btn
                                                    density="compact"
                                                    variant="text"
                                                    :icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                    @click="passwordVisible = !passwordVisible"
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            required
                                            :type="confirmPasswordVisible ? 'text' : 'password'"
                                            prepend-inner-icon="mdi-lock-outline"
                                            density="compact"
                                            label="Confirm password *"
                                            variant="outlined"
                                            v-model="confirmPassword"
                                            :rules="[requiredRule, confirmPasswordRule]"
                                            validate-on="blur"
                                            class="mb-2"
                                        >
                                            <template v-slot:append-inner>
                                                <v-btn
                                                    density="compact"
                                                    variant="text"
                                                    :icon="confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                    @click="confirmPasswordVisible = !confirmPasswordVisible"
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-btn
                                            block
                                            rounded="sm"
                                            color="primary"
                                            @click="register()">
                                            Register
                                        </v-btn>
                                    </v-col>
                                </v-row>

                                <div class="text-center mt-7">
                                    <span>Already have an account?</span>
                                    <span
                                        class="text-decoration-underline"
                                        role="button"
                                        tabindex="0"
                                        @keydown="handleTabKeyEvent($event, 'navigate')"
                                    >
                        <router-link :to="constants.DEFAULT_ROUTE">Login</router-link>
                      </span>
                                </div>
                            </v-form>
                        </v-card-text>


                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script setup lang="ts">
    import {ref} from "vue";
    import {navigateTo} from "@/router/navigation";
    import * as constants from "@/utils/constants";
    import {
        getInstitutions,
        registerUserAccount
    } from "@/services/seb-server/component-services/registerAccountViewService";
    import moment from "moment-timezone";


    //form fields
    const selectedInstitution = ref<string>("")
    const name = ref<string>("");
    const surname = ref<string>("");
    const username = ref<string>("");
    const email = ref<string>();
    const timezone = ref<string>("");
    const password = ref<string>("");
    const confirmPassword = ref<string>("");

    //error handling
    const registerError = ref(false);
    const registerSuccess = ref(false);

    //password icon logic
    const passwordVisible = ref<boolean>(false);
    const confirmPasswordVisible = ref<boolean>(false);

    //institution setters
    const institutions = ref<Institution[]>([]);
    const institutionSelectDisabled = ref(false);

    //validation rules
    const requiredRule = (v: string) => !!v || 'This field is required';
    const passwordRule = (v: string) =>
        (v && v.length >= 8) || 'Password must be at least 8 characters';
    const formRef = ref();
    const confirmPasswordRule = (v: string) =>
        v === password.value || 'Passwords must match';
    const emailRule = (v: string) =>
        !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Invalid email format';

    //load timezones
    const timezoneOptions = moment.tz.names();

    //fetch Institutions
    onMounted(async () => {
        const result = await getInstitutions();
        if (result && result.length > 0) {
            institutions.value = result;

            if (result.length === 1) {
                selectedInstitution.value = result[0].modelId;
                institutionSelectDisabled.value = true;
            }
        }
    });

    //register
    const register = async () => {
        registerError.value = false;
        registerSuccess.value = false;

        const {valid} = await formRef.value.validate();
        if (!valid) {
            console.warn("Form is invalid — not submitting.");
            return;
        }

        try {
            const result = await registerUserAccount(
                selectedInstitution.value,
                name.value,
                surname.value,
                username.value,
                password.value,
                confirmPassword.value,
                timezone.value,
                email.value,
            );

            if (result) {
                registerSuccess.value = true;

                setTimeout(() => {
                    navigateTo(constants.DEFAULT_ROUTE);
                }, 2500);
            } else {
                registerError.value = true;
            }
        } catch (error) {
            console.error(error);
            //todo error handle
            registerError.value = true;
        }
    };


    //todo: extract this function into a global file
    function handleTabKeyEvent(event: any, action: string) {
        if (event.key == 'Enter' || event.key == ' ') {

            if (action == "navigate") {
                navigateTo(constants.DEFAULT_ROUTE);
            }
        }
    }
</script>

<style scoped>

    .logo-img {
        width: 100%;
        max-width: 150px;
        height: auto;
        margin-bottom: 1rem;
    }


    .v-card-text {
        padding-top: 3rem;
    }
    .v-messages {
        min-height: 20px; /* Reserve space for validation messages */
    }


</style>
