<template>

    <v-row>
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pl-4 pt-3 pr-4">

                <!------------title row------------->
                <v-row>
                    <v-col>
                        <div class="primary-text-color text-h5 font-weight-bold">
                            {{translate("quizImportWizard.examInfo.title")}}
                        </div>
                    </v-col>
                </v-row>
                <!----------------------------------->

                <v-row>
                    <v-spacer></v-spacer>
                    <v-col>

                        <v-form
                            @keyup.enter="loadExamItemsCaller()"
                            @keyup.esc="clearForm()">
                            <!------------search field------------->
                            <v-row align="center">
                                <v-col class="mb-6">
                                    {{translate("quizImportWizard.examInfo.search")}}
                                </v-col>
                                <v-col cols="9" class="mb-6">
                                    <v-text-field
                                        single-line
                                        hide-details
                                        v-model="quizImportStore.searchField"
                                        type="text"
                                        append-inner-icon="mdi-magnify"
                                        density="compact"
                                        :aria-label="translate('quizImportWizard.examInfo.searchPlaceholder')"
                                        :placeholder="translate('quizImportWizard.examInfo.searchPlaceholder')"
                                        variant="outlined">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <!----------------------------------->

                            <!------------start date------------->
                            <v-row align="center">
                                <v-col class="mb-2">
                                    {{translate("quizImportWizard.examInfo.start")}}
                                </v-col>
                                <v-col cols="9" class="mb-2">
                                    <v-date-input
                                        single-line
                                        hide-details
                                        v-model="datepicker"
                                        density="compact"
                                        variant="outlined"
                                        :aria-label="translate('quizImportWizard.examInfo.searchPlaceholder')"
                                        placeholder="dd.MM.yyyy"
                                        display-date-format="dd.MM.yyyy"
                                        input-format="dd.MM.yyyy"
                                        prepend-icon=""
                                        append-inner-icon="mdi-calendar">
                                    </v-date-input>
                                </v-col>
                            </v-row>
                            <!----------------------------------->

                            <!------------Buttons------------->
                            <v-row>
                                <v-col align="right">
                                    <v-btn
                                        rounded="sm"
                                        color="black"
                                        variant="outlined"
                                        @click="clearForm()"
                                        :aria-label="translate('general.cancelButton')">
                                        {{translate("general.cancelButton")}}
                                    </v-btn>

                                    <v-btn
                                        rounded="sm"
                                        color="primary"
                                        variant="flat"
                                        class="ml-2"
                                        @click="loadExamItemsCaller()"
                                        :aria-label="translate('general.searchButton')">
                                        {{translate("general.searchButton")}}
                                    </v-btn>

                                </v-col>
                            </v-row>
                            <!----------------------------------->
                        </v-form>

                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>

            </v-sheet>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import {useQuizImportStore} from "@/stores/seb-server/quizImportStore";
    import { VDateInput } from "vuetify/labs/VDateInput";
    import {translate} from "@/utils/generalUtils";


    //stores
    const quizImportStore = useQuizImportStore();

    //emits - call loadExamItemsCaller in parent
    const emit = defineEmits<{
        loadExamItemsCaller: any;
    }>();

    //datepicker
    const datepicker = ref();


    function loadExamItemsCaller(){
        if(datepicker != null && datepicker.value != null){
            quizImportStore.startTimestamp = datepicker.value.getTime();
        }

        quizImportStore.forceNewSearch = true;
        emit("loadExamItemsCaller");
    }

    function clearForm(){
        quizImportStore.searchField = "";
        datepicker.value = null;
        quizImportStore.startTimestamp = null;
        loadExamItemsCaller();
    }

</script>

<style scoped>
</style>
