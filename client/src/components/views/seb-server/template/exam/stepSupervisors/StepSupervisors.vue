<template>
    <!-- TODO @alain: implement -->
    <div>
        <div>Step Supervisors</div>
        <v-btn @click="handleButtonReadyClick">Ready!</v-btn>
    </div>
</template>

<script setup lang="ts">
import { useStepSupervisorsStore } from "./store";

const store = useStepSupervisorsStore();

const handleButtonReadyClick = () => {
    store.markAsReady();
};
</script>
