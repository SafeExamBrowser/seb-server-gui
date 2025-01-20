<template>

    <!------------top info box------------->
    <component :is="componentList[currentStep-1]"/>
    
    <!------------------------------------->



    <!------------------------------------->
    <!---------quiz import wizard---------->
    <!------------------------------------->
    <v-row>
        <v-col>
            <v-stepper 
                v-model="currentStep"
                elevation="4"
                class="rounded-lg"
                :items=steps>

                <template v-slot:item.1>
                    <v-card title="Step One" flat>...</v-card>
                </template>
            
                <template v-slot:item.2>
                    <v-card title="Step Two" flat>...</v-card>
                </template>
            
                <template v-slot:item.3>
                    <v-card title="Step Three" flat>...</v-card>
                </template>

                <template v-slot:item.4>
                    <v-card title="Step Four" flat>...</v-card>
                </template>

                <template v-slot:item.5>
                    <v-card title="Step Five" flat>...</v-card>
                </template>
                
            </v-stepper>
        </v-col>
    </v-row>
    <!------------------------------------->
    <!------------------------------------->
    <!------------------------------------->

</template>


<script setup lang="ts">
    import InfoBoxSelect from "@/components/views/quiz-import/info-box-content/InfoBoxSelect.vue"; 
    import InfoBoxChoose from "@/components/views/quiz-import/info-box-content/InfoBoxChoose.vue"; 
    import InfoBoxAdd from "@/components/views/quiz-import/info-box-content/InfoBoxAdd.vue"; 
    import InfoBoxSet from "@/components/views/quiz-import/info-box-content/InfoBoxSet.vue"; 
    import InfoBoxConfig from "@/components/views/quiz-import/info-box-content/InfoBoxConfig.vue"; 


    const currentStep = ref<number>(1);

    const steps: string[] = [
        "Select Exam", 
        "Choose Template",
        "Add Examination Supervisor",
        "Set Quit Password",
        "Configuration Summary"
    ];

    const componentList: Component = [
        InfoBoxSelect,
        InfoBoxChoose,
        InfoBoxAdd,
        InfoBoxSet,
        InfoBoxConfig
    ];


    watch(currentStep, () => {
        console.log("current step: " + currentStep.value)
    });


    


</script>

<style scoped>

</style>