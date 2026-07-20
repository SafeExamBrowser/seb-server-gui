<template>
    <ActionButton
        v-if="excludeFromDeletionVisible"
        :active="excludedFromDeletion"
        @click="handleClick"
    >
        <v-icon start>mdi-delete-off-outline</v-icon>
        {{
            $t(
                excludedFromDeletion
                    ? "examDetail.sidePanel.actions.excludedFromDeletion"
                    : "examDetail.sidePanel.actions.excludeFromDeletion",
            )
        }}
    </ActionButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { GUIAction, useAbilities } from "@/services/ability.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import ActionButton from "./ActionButton.vue";

const props = defineProps<{
    exam?: Exam;
}>();

const emit = defineEmits<{
    toggle: [];
}>();

const ability = useAbilities();

const excludeFromDeletionVisible = computed(() =>
    ability.canDoExamAction(
        GUIAction.EXCLUDE_FROM_DELETION,
        props.exam ?? null,
    ),
);

const excludedFromDeletion = computed(
    () => props.exam?.excludeFromDeletion ?? false,
);

const handleClick = () => {
    emit("toggle");
};
</script>
