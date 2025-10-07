<template>
    <Step
        :title="$t('createTemplateExam.steps.clientGroup.title')"
        :subtitle="$t('createTemplateExam.steps.clientGroup.subtitle')"
    >
        <AddGroup />
        <ClientGroupTable />
    </Step>
</template>
