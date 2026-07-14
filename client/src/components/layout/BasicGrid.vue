<!--
    The slots are rendered sorted by name, not in declaration order.
    You can Prefix slot names with numbers to control theo order.
-->
<template>
    <v-row>
        <v-col
            v-for="name in Object.keys($slots).sort()"
            :key="name"
            cols="12"
            md="6"
            class="d-flex flex-column"
        >
            <slot :name="name" />
        </v-col>
    </v-row>
</template>
