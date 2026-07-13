<template>
    <v-row>
        <v-col
            v-for="(_, name) in $slots"
            :key="name"
            cols="12"
            md="6"
            class="d-flex flex-column"
        >
            <slot :name="name" />
        </v-col>
    </v-row>
</template>
