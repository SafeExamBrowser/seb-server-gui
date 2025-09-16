<template>
    <!-- TODO @alain: implement -->
    <div>
        <div>Step Supervisors</div>
        <v-btn @click="handleReadyClick">Ready!</v-btn>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["ready"]);

const handleReadyClick = () => {
    emit("ready");
};
</script>
