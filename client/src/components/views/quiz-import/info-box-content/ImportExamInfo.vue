<template>

    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pl-8 pt-8 pb-8"
                height="300">

                <!------------title row------------->
                <v-row>
                    <v-col>
                        <div class="primary-text-color text-h4 font-weight-bold">
                            Select Exam
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
                                    Search:
                                </v-col>
                                <v-col cols="9" class="mb-6">
                                    <v-text-field
                                        single-line
                                        hide-details
                                        v-model="quizImportStore.searchField"
                                        type="text"
                                        append-inner-icon="mdi-magnify"
                                        density="compact"
                                        placeholder="Search Exams"
                                        variant="outlined">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <!----------------------------------->

                            <!------------start date------------->
                            <v-row align="center">
                                <v-col class="mb-2"> 
                                    Start:
                                </v-col>
                                <v-col cols="9" class="mb-2">
                                    <VueDatePicker 
                                        v-model="quizImportStore.startDate"  
                                        auto-position="bottom"
                                        format="dd.MM.yyyy"
                                        :teleport="true"
                                        :enable-time-picker="false">
                                    </VueDatePicker>
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
                                        @click="clearForm()">
                                        Cancel
                                    </v-btn>

                                    <v-btn 
                                        rounded="sm" 
                                        color="primary" 
                                        variant="flat" 
                                        class="ml-2"
                                        @click="loadExamItemsCaller()">
                                        Search
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
    import VueDatePicker from "@vuepic/vue-datepicker";
    import {useQuizImportStore} from "@/stores/quizImportStore";

    //stores
    const quizImportStore = useQuizImportStore();

    //emits - call loadExamItemsCaller in parent
    const emit = defineEmits<{
        loadExamItemsCaller: any;
    }>();

    function loadExamItemsCaller(){
        emit("loadExamItemsCaller");
    }

    function clearForm(){
        quizImportStore.searchField = "";
        quizImportStore.startDate = null;
        loadExamItemsCaller();
    }

</script>

<style scoped>


</style>