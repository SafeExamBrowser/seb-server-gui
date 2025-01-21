<template>

    <!------------top info box------------->
    <component :is="infoBoxComponents[currentStep-1]"/>
    <!------------------------------------->


    <!---------wizard---------->
    <v-row>
        <v-col>
            <v-stepper 
                v-model="currentStep"
                elevation="4"
                class="rounded-lg"
                :items=steps>

                <template v-slot:item.1>
                    <component :is="mainContentComponents[0]"/>
                </template>
            
                <template v-slot:item.2>
                    <component :is="mainContentComponents[1]"/>
                </template>
            
                <template v-slot:item.3>
                    <component :is="mainContentComponents[2]"/>
                </template>

                <template v-slot:item.4>
                    <component :is="mainContentComponents[3]"/>
                </template>

                <template v-slot:item.5>
                    <component :is="mainContentComponents[4]"/>
                </template>
                
            </v-stepper>
        </v-col>
    </v-row>
    <!------------------------------------->

</template>


<script setup lang="ts">
    import InfoBoxSelect from "@/components/views/quiz-import/info-box-content/InfoBoxSelect.vue"; 
    import MainContentSelect from "@/components/views/quiz-import/main-content/MainContentSelect.vue"; 
    import InfoBoxChoose from "@/components/views/quiz-import/info-box-content/InfoBoxChoose.vue";
    import MainContentChoose from "@/components/views/quiz-import/main-content/MainContentChoose.vue"; 
    import InfoBoxAdd from "@/components/views/quiz-import/info-box-content/InfoBoxAdd.vue"; 
    import MainContentAdd from "@/components/views/quiz-import/main-content/MainContentAdd.vue"; 
    import InfoBoxSet from "@/components/views/quiz-import/info-box-content/InfoBoxSet.vue";
    import MainContentSet from "@/components/views/quiz-import/main-content/MainContentSet.vue"; 
    import InfoBoxConfig from "@/components/views/quiz-import/info-box-content/InfoBoxConfig.vue"; 
    import MainContentConfig from "@/components/views/quiz-import/main-content/MainContentConfig.vue"; 



    const currentStep = ref<number>(1);

    const steps: string[] = [
        "Select Exam", 
        "Choose Template",
        "Add Examination Supervisor",
        "Set Quit Password",
        "Configuration Summary"
    ];

    const infoBoxComponents: Component = [
        InfoBoxSelect,
        InfoBoxChoose,
        InfoBoxAdd,
        InfoBoxSet,
        InfoBoxConfig
    ];

    const mainContentComponents: Component = [
        MainContentSelect,
        MainContentChoose,
        MainContentAdd,
        MainContentSet,
        MainContentConfig
    ];


    watch(currentStep, () => {
        console.log("current step: " + currentStep.value)
    });


    


</script>

<style scoped>

</style>