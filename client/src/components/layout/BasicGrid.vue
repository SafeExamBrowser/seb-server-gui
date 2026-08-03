<!--
    The slots are rendered sorted by name, not in declaration order.
    You can Prefix slot names with numbers to control theo order.
-->
<template>
    <div class="basic-grid-container">
        <div class="basic-grid ga-6">
            <div
                v-for="name in Object.keys($slots).sort()"
                :key="name"
                class="d-flex flex-column"
            >
                <slot :name="name" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.basic-grid-container {
    container-type: inline-size;
}

.basic-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
}

/* sadly we must hardcode the 960px here and can't derive it from the vuetify theme */
@container (min-width: 960px) {
    .basic-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
