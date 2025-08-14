<template>
    <div class="text-white text-h5 font-weight-black ml-10 mt-5 ">
        {{ translate("titles.settings") }}
    </div>
    <v-row class="mt-10 w-98 h-100">

        <!-- settings navigation-->
        <SettingsNavigation/>

        <v-col elevation="4" cols="9" class="bg-white rounded-lg">
            <v-row class="d-flex align-center justify-space-between px-6 pt-6">
                <div class="text-primary text-h5 font-weight-bold">
                    {{ translate("titles.createConnectionConfiguration") }}
                </div>
            </v-row>


            <v-divider class="custom-divider mx-6 my-4 mt-7"/>
            <v-row class="px-8 mt-2">
                <div class="text-body-2 text-grey-darken-1">
                    {{
                        translate("assessmentToolConnections.createAssessmentToolConnectionsPage.info.assessmentToolConnectionsCreationInfo")
                    }}
                </div>
            </v-row>

            <!-- Form-->
            <v-sheet class="rounded-lg mt-4" style="min-height: 46.9vh">
                <v-form ref="formRef" @keyup.enter="submit()">


                    <v-col cols="12" md="12" class="pa-0 mb-4 h-100">
                        <v-card-text>

                            <!-- First Section -->
                            <v-row dense>
                                <v-col>
                                    <!-- Institution-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            required
                                            prepend-inner-icon="mdi-domain"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.institutionLabel')"
                                            variant="outlined"
                                            v-model="institution"
                                            :items="institutions"
                                            item-title="name"
                                            item-value="modelId"
                                            :rules="[requiredRule]"
                                            disabled
                                        />
                                    </v-col>

                                    <!-- Type -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            required
                                            prepend-inner-icon="mdi-shape-outline"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.typeLabel')"
                                            variant="outlined"
                                            v-model="lmsType"
                                            :items="lmsTypeItems"
                                            item-title="label"
                                            item-value="value"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>
                                </v-col>

                                <!-- Second Section-->
                                <v-col>
                                    <!-- Name-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            prepend-inner-icon="mdi-account-outline"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.nameLabel')"
                                            variant="outlined"
                                            v-model="name"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>

                                </v-col>
                            </v-row>

                            <!-- Second Section -->
                            <v-row dense>
                                <v-col>
                                    <!-- Assessment Tool Server Address-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            prepend-inner-icon="mdi-server"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.assessmentToolServerAddressLabel')"
                                            variant="outlined"
                                            v-model="assessmentToolServerAddress"
                                            :rules="[requiredRule, httpPrefixRule]"
                                            validate-on="blur"
                                        />
                                    </v-col>

                                    <!-- Access Token-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            ref="confirmPasswordFieldRef"
                                            required
                                            :type="confirmPasswordVisible ? 'text' : 'password'"
                                            prepend-inner-icon="mdi-key-variant"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.accessTokenLabel')"
                                            variant="outlined"
                                            v-model="accessToken"
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
                                </v-col>
                                <v-col>
                                    <!-- Assessment Tool Server Username-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            prepend-inner-icon="mdi-account"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.assessmentToolServerUsernameLabel')"
                                            variant="outlined"
                                            v-model="assessmentToolServerUsername"
                                            :rules="[requiredRule]"
                                            validate-on="blur"
                                        />
                                    </v-col>

                                    <!-- Assessment Tool Server Password-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            :type="passwordVisible ? 'text' : 'password'"
                                            prepend-inner-icon="mdi-lock-outline"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.assessmentToolServerPasswordLabel')"
                                            variant="outlined"
                                            v-model="assessmentToolServerPassword"
                                            :rules="[requiredRule]"
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
                                </v-col>

                            </v-row>

                            <!-- Third Section for proxy stuff -->
                            <v-row dense>
                                <v-divider class="custom-divider mx-1 my-2"/>

                                <v-col>
                                    <!-- With Proxy -->
                                    <v-col cols="6" md="6" class="custom-padding-textbox">
                                        <div class="d-flex align-center justify-space-between w-100">
                                            <label class="text-grey-darken-1 text-body-1 ml-11">
                                                {{
                                                    translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.withProxyLabel')
                                                }}
                                            </label>

                                            <v-switch
                                                v-model="withProxy"
                                                inset
                                                hide-details
                                                density="compact"
                                                color="primary"
                                                class="ml-4"
                                                :aria-label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.withProxyAria')"
                                            />
                                        </div>
                                    </v-col>
                                </v-col>
                            </v-row>

                            <v-row dense>
                                <v-col>
                                    <!-- Animated expansion -->
                                    <v-expand-transition>
                                        <div v-show="withProxy">
                                            <v-row>
                                                <v-col>
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            prepend-inner-icon="mdi-server"
                                                            density="compact"
                                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyHostLabel')"
                                                            variant="outlined"
                                                            v-model="proxyHost"
                                                            :rules="[requiredIfProxyRule]"
                                                            validate-on="blur"
                                                        />
                                                    </v-col>

                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            prepend-inner-icon="mdi-numeric"
                                                            density="compact"
                                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyPortLabel')"
                                                            variant="outlined"
                                                            v-model="proxyPort"
                                                            type="number"
                                                            inputmode="numeric"
                                                            :rules="[requiredIfProxyRule, portNumberRule]"
                                                            validate-on="blur"
                                                        />
                                                    </v-col>
                                                </v-col>
                                                <v-col>
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            prepend-inner-icon="mdi-account-outline"
                                                            density="compact"
                                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyUsernameLabel')"
                                                            variant="outlined"
                                                            v-model="proxyUsername"
                                                            :rules="[requiredIfProxyRule]"
                                                            validate-on="blur"
                                                        />
                                                    </v-col>

                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            :type="proxyPasswordVisible ? 'text' : 'password'"
                                                            prepend-inner-icon="mdi-lock-outline"
                                                            density="compact"
                                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyPasswordLabel')"
                                                            variant="outlined"
                                                            v-model="proxyPassword"
                                                            :rules="[requiredIfProxyRule]"
                                                            validate-on="blur"
                                                        >
                                                            <template #append-inner>
                                                                <v-btn
                                                                    density="compact"
                                                                    variant="text"
                                                                    :icon="proxyPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                                    @click="proxyPasswordVisible = !proxyPasswordVisible"
                                                                />
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-expand-transition>
                                </v-col>

                            </v-row>


                        </v-card-text>
                    </v-col>
                </v-form>
            </v-sheet>

            <!-- Buttons-->
            <v-row class="px-6 pt-0">
                <v-col cols="12" md="12" class="pa-0 mb-4">
                    <div class="d-flex justify-end">
                        <v-btn
                            rounded="sm"
                            color="black"
                            variant="outlined"
                            @click="navigateTo(constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE)"
                        >
                            {{ translate("general.cancelButton") }}
                        </v-btn>

                        <v-btn
                            rounded="sm"
                            color="primary"
                            variant="flat"
                            class="ml-2"
                            @click="submit()"
                            :disabled="isCreateDisabled"
                        >
                            {{ translate("general.createButton") }}
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {useAppBarStore, useLayoutStore} from '@/stores/store';
import {translate} from '@/utils/generalUtils';
import * as constants from '@/utils/constants';
import moment from "moment-timezone";
import {getInstitutions} from "@/services/seb-server/component-services/registerAccountViewService";
import {createUserAccount} from "@/services/seb-server/component-services/userAccountViewService";
import {navigateTo} from "@/router/navigation";
import {UserRoleEnum} from '@/models/userRoleEnum';
import {useI18n} from "vue-i18n";
import {useUserAccountStore as useAuthenticatedUserAccountStore} from "@/stores/authentication/authenticationStore";
import {createAssessmentTool} from "@/services/seb-server/component-services/assessmentToolViewService";
import {LMSTypeEnum} from "@/models/seb-server/assessmentToolEnums";


const appBarStore = useAppBarStore();
const layoutStore = useLayoutStore();

//fields
const institution = ref<string | null>(null);
const name = ref<string>("");
const lmsType = ref<LMSTypeEnum | null>(null);
const assessmentToolServerAddress = ref<string>("");
const assessmentToolServerUsername = ref<string>("");
const assessmentToolServerPassword = ref<string>("");
const accessToken = ref<string>("");
const withProxy = ref<boolean>(false);

const proxyHost = ref<string>('');
const proxyPort = ref<string>('');
const proxyUsername = ref<string>('');
const proxyPassword = ref<string>('');
const proxyPasswordVisible = ref<boolean>(false);

const i18n = useI18n();

const formRef = ref();

const createdSuccess = ref(false);
const passwordVisible = ref<boolean>(false);
const confirmPasswordVisible = ref<boolean>(false);
const confirmPasswordFieldRef = ref();
const institutionSelectDisabled = ref(true);
const createdAssessmentToolName = ref<string>("");

const institutions = ref<Institution[]>([]);
const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();


//validation rules
const requiredMessage = translate("assessmentToolConnections.createAssessmentToolConnectionsPage.validation.required");
const invalidPortMessage = translate("assessmentToolConnections.createAssessmentToolConnectionsPage.validation.invalidPort") || "Invalid port";
const httpPrefixMessage = translate("assessmentToolConnections.createAssessmentToolConnectionsPage.validation.httpPrefix") || "Must start with http://";

const requiredRule = (v: string) => !!v || requiredMessage;

const httpPrefixRule = (v: string) => /^https?:\/\//i.test(v) || httpPrefixMessage;


// Required only when withProxy is true
const requiredIfProxyRule = (v: string) => {
    if (!withProxy.value) return true;
    return (!!v && v.toString().trim().length > 0) || requiredMessage;
};

// Port number rule (1..65535)
const portNumberRule = (v: string) => {
    if (!withProxy.value) return true;
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 65535 || invalidPortMessage;
};


const lmsTypeItems = Object.values(LMSTypeEnum).map((v) => ({
    label: translate(`assessmentToolConnections.lmsTypes.${v}`),
    value: v as LMSTypeEnum,
}));


onMounted(async () => {
    appBarStore.title = translate("titles.createAssessmentTool");
    layoutStore.setBlueBackground(true);

    const user = authenticatedUserAccountStore.userAccount;

    const result: Institution[] | null = await getInstitutions();
    institutions.value = result ?? [];


    const userInstitutionId = String(user?.institutionId);
    const matchedInstitution = institutions.value.find(inst => inst.modelId === userInstitutionId);

    if (matchedInstitution) {
        institution.value = matchedInstitution.modelId;
        institutionSelectDisabled.value = true;
        institutions.value = [matchedInstitution];
    } else {
        console.warn("User's institution not found in fetched institutions.");
    }
});

// Create button disabled state
const isCreateDisabled = computed(() => {
    const baseMissing =
        !institution.value ||
        !name.value.trim() ||
        !lmsType.value ||
        !assessmentToolServerAddress.value.trim() ||
        !assessmentToolServerUsername.value.trim() ||
        !assessmentToolServerPassword.value.trim();

    if (baseMissing) return true;

    if (!withProxy.value) return false;

    // withProxy on → require proxy fields
    const proxyMissing =
        !proxyHost.value.trim() ||
        !proxyPort.value.trim() ||
        !proxyUsername.value.trim() ||
        !proxyPassword.value.trim();

    // validates port range
    const n = Number(proxyPort.value);
    const badPort = !(Number.isInteger(n) && n >= 1 && n <= 65535);

    return proxyMissing || badPort;
});


async function submit() {
    const {valid} = await formRef.value.validate();
    if (!valid) return;
    // Prepare the request
    const createAssessmentToolsParams: CreateAssessmentToolPar = {
        institutionId: institution.value!,
        name: name.value,
        lmsType: lmsType.value!,
        lmsUrl: assessmentToolServerAddress.value,
        lmsClientname: assessmentToolServerUsername.value,
        lmsClientsecret: assessmentToolServerPassword.value,
        lmsRestApiToken: accessToken.value,
        ...(withProxy.value ? {
            lmsProxyHost: proxyHost.value,
            lmsProxyPort: Number(proxyPort.value.trim()).toString(),
            lmsProxyAuthUsername: proxyUsername.value,
            lmsProxyAuthSecret: proxyPassword.value,
        } : {})
    };

    // Call the service
    const createdAssessmentToolResponse: any | null = await createAssessmentTool(createAssessmentToolsParams);

    if (createdAssessmentToolResponse == null) {
        return;
    } else {
        createdAssessmentToolName.value = createdAssessmentToolResponse.name;
        createdSuccess.value = true;
        setTimeout(() => {
            createdSuccess.value = false;
            navigateTo(constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE);
        }, 1500);

    }
}

onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});


</script>

<style scoped>
.nav-hover:hover .nav-link {
    color: #215caf;
}


.w-98 {
    width: 98% !important;
}

.custom-divider {
    background-color: #DCDCDC !important;
    height: 1px;
    width: 100%;
}


.custom-padding-textbox {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
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
