<template>

    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pl-8 pt-8"
                height="250">

                <!------------title row------------->
                <v-row>
                    <div class="title-container text-h4 font-weight-black mb-6">
                        Select Exam
                    </div>
                </v-row>
                <!----------------------------------->

                <!------------search and info row------------->
                <v-row>

                    <v-col cols="4" class="pr-10">
                        <v-text-field
                            v-model="quizImportStore.searchField"
                            type="text"
                            append-inner-icon="mdi-magnify"
                            density="compact"
                            placeholder="Search Exams"
                            variant="outlined">
                        </v-text-field>
                    </v-col>

                    <v-col cols="6" class="pl-16 pr-16">
                        <!------------Time Period------------->
                        <v-row align="center">
                            <v-col cols="1">
                                {{ $t('searchForm.period') }}:
                            </v-col>
                            <v-col cols="1">
                                <v-radio    
                                    :aria-label="$t('searchForm.period')"
                                    v-model="timePeriodRadio" 
                                    @click="radioButtonEvent('period')">
                                </v-radio>
                            </v-col>
                            <v-col>
                                {{ $t('searchForm.last') }}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    hide-details    
                                    single-line
                                    type="number"
                                    density="compact"
                                    variant="solo"
                                    v-model="timePeriodField"
                                    :disabled="!timePeriodRadio"
                                    :aria-label="$t('searchForm.last')"> 
                                </v-text-field> 
                            </v-col>
                            <v-col>
                                <v-select
                                    hide-details
                                    density="compact"
                                    variant="outlined"  
                                    v-model="timePeriodSelect"
                                    :items="[
                                        {title: $t('timePeriod.day'), value: 1},
                                        {title: $t('timePeriod.week'), value: 2},
                                        {title: $t('timePeriod.month'), value: 3},
                                        {title: $t('timePeriod.year'), value: 4}
                                    ]"   
                                    :disabled="!timePeriodRadio">
                                </v-select>
                            </v-col>
                        </v-row>
                        <!----------------------------------->

                        <!------------Time Selection------------->
                        <v-row align="center">
                            <v-col cols="1">
                                {{ $t('searchForm.between') }}:
                            </v-col>
                            <v-col cols="1">
                                <v-radio 
                                    :aria-label="$t('searchForm.between')"
                                    v-model="timeSelectionRadio" 
                                    @click="radioButtonEvent('selection')">
                                </v-radio>
                            </v-col>
                            <v-col>
                                <VueDatePicker 
                                    range
                                    format="dd.MM.yyyy HH:mm"
                                    v-model="timeSelectionPicker"  
                                    :teleport="true"
                                    :disabled="!timeSelectionRadio">
                                </VueDatePicker>
                            </v-col>
                        </v-row>
                        <!----------------------------------->
                    </v-col>

                    <v-col cols="2">
                        223/223
                    </v-col>
                </v-row>
                <!----------------------------------->

            </v-sheet>
        </v-col>
    </v-row>








</template>

<script setup lang="ts">
    import VueDatePicker from "@vuepic/vue-datepicker";
    import {useQuizImportStore} from "@/stores/quizImportStore";

    //stores
    const quizImportStore = useQuizImportStore();


    //time and date selection
    const timePeriodField = ref<number>(1);
    const timePeriodRadio = ref<boolean>(true);
    const timePeriodSelect = ref<number>(2);
    const timeSelectionRadio = ref<boolean>(false);
    const timeSelectionPicker = ref(null);





    function radioButtonEvent(button: string){
        if(button == "period"){
            timePeriodRadio.value = true;
            timeSelectionRadio.value = false;
        }

        if(button == "selection"){
            timeSelectionRadio.value = true;
            timePeriodRadio.value = false;
        }
    }


</script>

<style scoped>


</style>