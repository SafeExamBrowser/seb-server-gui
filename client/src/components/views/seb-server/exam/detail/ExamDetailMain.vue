<template>
    <v-row>
        <v-col>
            <v-sheet class="rounded-lg pa-8" elevation="4">
                <!----------title--------->
                <v-row>
                    <v-col>
                        <div
                            class="primary-text-color text-h5 font-weight-bold"
                        >
                            {{ translate("titles.examDetails") }}
                        </div>
                        <v-divider
                            class="border-opacity-25"
                            :thickness="2"
                        ></v-divider>
                    </v-col>
                </v-row>

                <!----------infos and actions--------->
                <v-row class="mt-10">
                    <v-spacer></v-spacer>
                    <!----------left side--------->
                    <v-col cols="6" xl="4">
                        <!----------test run--------->
                        <v-row>
                            <v-col>
                                <v-sheet class="rounded-lg pa-4" elevation="4">
                                    <v-row align="center">
                                        <v-col>
                                            {{
                                                translate(
                                                    "examDetail.main.testExam",
                                                )
                                            }}
                                        </v-col>
                                        <v-col align="right" cols="4">
                                            <v-btn
                                                v-if="
                                                    generalUtils.findEnumValue(
                                                        ExamStatusEnum,
                                                        examStore.selectedExam
                                                            ?.status,
                                                    ) == ExamStatusEnum.TEST_RUN
                                                "
                                                block
                                                color="primary"
                                                :disabled="
                                                    !ability.canDoExamAction(
                                                        GUIAction.DisableTestRun,
                                                        examStore.selectedExam,
                                                    )
                                                "
                                                rounded="sm"
                                                variant="flat"
                                                @click="applyTestRun()"
                                            >
                                                {{
                                                    translate(
                                                        "examDetail.main.testRunDisable",
                                                    )
                                                }}
                                            </v-btn>
                                            <v-btn
                                                v-else
                                                block
                                                color="primary"
                                                :disabled="
                                                    !ability.canDoExamAction(
                                                        GUIAction.ApplyTestRun,
                                                        examStore.selectedExam,
                                                    )
                                                "
                                                rounded="sm"
                                                variant="flat"
                                                @click="applyTestRun()"
                                            >
                                                {{
                                                    translate(
                                                        "examDetail.main.testRunApply",
                                                    )
                                                }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                    <v-tooltip activator="parent">
                                        {{
                                            translate(
                                                "examDetail.main.testTooltip",
                                            )
                                        }}
                                    </v-tooltip>
                                </v-sheet>
                            </v-col>
                        </v-row>

                        <!----------monitor exam--------->
                        <v-row
                            v-if="
                                ability.canDoExamAction(
                                    GUIAction.ShowMonitoring,
                                    examStore.selectedExam,
                                )
                            "
                            class="mt-6"
                        >
                            <v-col>
                                <v-card class="rounded-lg pa-4" elevation="4">
                                    <v-row align="center">
                                        <v-col>
                                            {{
                                                translate(
                                                    "examDetail.main.monitorExam",
                                                )
                                            }}
                                        </v-col>
                                        <v-col align="right" cols="4">
                                            <v-btn
                                                block
                                                color="primary"
                                                rounded="sm"
                                                variant="flat"
                                                @click="
                                                    navigateTo(
                                                        constants.MONITORING_OVERVIEW_ROUTE +
                                                            '/' +
                                                            examId,
                                                    )
                                                "
                                            >
                                                {{
                                                    translate(
                                                        "examDetail.main.monitorStart",
                                                    )
                                                }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!----------show finished exam data--------->
                        <v-row
                            v-if="
                                ability.canDoExamAction(
                                    GUIAction.ShowFinishedExamData,
                                    examStore.selectedExam,
                                )
                            "
                            class="mt-6"
                        >
                            <v-col>
                                <v-card class="rounded-lg pa-4" elevation="4">
                                    <v-row align="center">
                                        <v-col>
                                            {{
                                                translate(
                                                    "examDetail.main.showFinishedExamData",
                                                )
                                            }}
                                        </v-col>
                                        <v-col align="right" cols="4">
                                            <v-btn
                                                block
                                                color="primary"
                                                rounded="sm"
                                                variant="flat"
                                                @click="
                                                    navigateTo(
                                                        constants.FINISHED_EXAM_DATA_ROUTE +
                                                            '/' +
                                                            examId,
                                                    )
                                                "
                                            >
                                                {{
                                                    translate(
                                                        "examDetail.main.show",
                                                    )
                                                }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!----------template--------->
                        <v-row class="mt-10">
                            <v-col class="primary-text-color text-h6">
                                {{ translate("examDetail.main.examTemplate") }}
                            </v-col>
                            <v-col align="right">
                                <v-btn
                                    color="primary"
                                    density="compact"
                                    :disabled="
                                        examStore.selectedExamTemplate == null
                                    "
                                    icon="mdi-information-outline"
                                    variant="text"
                                    @click="openExamTemplateDialog()"
                                >
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-divider
                            class="border-opacity-25"
                            :thickness="2"
                        ></v-divider>

                        <v-row class="mt-1">
                            <v-col>
                                <div class="text-subtitle-1">
                                    <template
                                        v-if="
                                            examStore.selectedExamTemplate !=
                                            null
                                        "
                                    >
                                        {{
                                            examStore.selectedExamTemplate?.name
                                        }}
                                    </template>
                                    <template v-else> - </template>
                                </div>
                            </v-col>
                        </v-row>
                        <!----------------------->

                        <!-------supervisors------>
                        <v-row class="mt-10">
                            <v-col class="primary-text-color text-h6">
                                {{
                                    translate("examDetail.main.examSupervisors")
                                }}
                            </v-col>

                            <v-col align="right">
                                <v-btn
                                    color="primary"
                                    density="compact"
                                    icon="mdi-pencil-circle-outline"
                                    variant="text"
                                    @click="openSupervisorsDialog()"
                                >
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-divider
                            class="border-opacity-25"
                            :thickness="2"
                        ></v-divider>

                        <v-row>
                            <v-col>
                                <v-data-table
                                    class="rounded-lg elevation-2 mt-4"
                                    :headers="supervisorsTableHeaders"
                                    hide-default-footer
                                    item-value="id"
                                    :items="examStore.selectedExamSupervisors"
                                >
                                    <template
                                        #headers="{
                                            columns,
                                            isSorted,
                                            getSortIcon,
                                            toggleSort,
                                        }"
                                    >
                                        <TableHeaders
                                            :columns="columns"
                                            :get-sort-icon="getSortIcon"
                                            :header-refs-prop="
                                                supervisorsTableHeadersRef
                                            "
                                            :is-sorted="isSorted"
                                            :toggle-sort="toggleSort"
                                        >
                                        </TableHeaders>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <!------------------->

                        <!-------Groups------>
                        <v-row class="mt-10">
                            <v-col class="primary-text-color text-h6">
                                {{ translate("examDetail.main.groups") }}
                            </v-col>

                            <v-col align="right">
                                <v-btn
                                    color="primary"
                                    density="compact"
                                    :disabled="
                                        !ability.canDoExamAction(
                                            GUIAction.EditClientGroups,
                                            examStore.selectedExam,
                                        )
                                    "
                                    icon="mdi-plus-circle-outline"
                                    variant="text"
                                    @click="openAddClientGroupDialog()"
                                >
                                </v-btn>
                                <v-btn
                                    color="primary"
                                    density="compact"
                                    :disabled="
                                        !ability.canDoExamAction(
                                            GUIAction.EditClientGroups,
                                            examStore.selectedExam,
                                        )
                                    "
                                    icon="mdi-pencil-circle-outline"
                                    variant="text"
                                    @click="openClientGroupDialog()"
                                >
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-divider
                            class="border-opacity-25"
                            :thickness="2"
                        ></v-divider>

                        <v-row>
                            <v-col>
                                <!--@vue-ignore-->
                                <v-data-table
                                    class="rounded-lg elevation-2 mt-4"
                                    :headers="clientGroupTableHeaders"
                                    hide-default-footer
                                    item-value="id"
                                    :items="examStore.selectedClientGroups"
                                >
                                    <template
                                        #headers="{
                                            columns,
                                            isSorted,
                                            getSortIcon,
                                            toggleSort,
                                        }"
                                    >
                                        <TableHeaders
                                            :columns="columns"
                                            :get-sort-icon="getSortIcon"
                                            :header-refs-prop="
                                                clientGroupTableHeadersRef
                                            "
                                            :is-sorted="isSorted"
                                            :toggle-sort="toggleSort"
                                        >
                                        </TableHeaders>
                                    </template>

                                    <template #item.type="{ item }">
                                        {{
                                            translate(
                                                generalUtils.findEnumValue(
                                                    ClientGroupEnum,
                                                    item.type,
                                                ),
                                            )
                                        }}
                                    </template>

                                    <template #item.sp="{ item }">
                                        <v-icon
                                            :icon="
                                                item.isSPSGroup
                                                    ? 'mdi-check'
                                                    : ''
                                            "
                                        ></v-icon>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <!------------------->

                        <!--------quit password------>
                        <v-row class="mt-10">
                            <v-col>
                                <div class="primary-text-color text-h6">
                                    {{
                                        translate(
                                            "examDetail.main.quitPassword",
                                        )
                                    }}
                                </div>
                                <v-divider
                                    class="border-opacity-25"
                                    :thickness="2"
                                ></v-divider>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                    v-model="quitPassword"
                                    density="compact"
                                    :disabled="
                                        !ability.canDoExamAction(
                                            GUIAction.EditExamSettings,
                                            examStore.selectedExam,
                                        )
                                    "
                                    placeholder="Password"
                                    prepend-inner-icon="mdi-lock-outline"
                                    :type="
                                        passwordVisible ? 'text' : 'password'
                                    "
                                    variant="outlined"
                                    @update:focused="saveNewPassword($event)"
                                >
                                    <template #append-inner>
                                        <v-btn
                                            density="compact"
                                            :icon="
                                                passwordVisible
                                                    ? 'mdi-eye-off'
                                                    : 'mdi-eye'
                                            "
                                            variant="text"
                                            @click="
                                                passwordVisible =
                                                    !passwordVisible
                                            "
                                        >
                                        </v-btn>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------------->
                    </v-col>
                    <!----------------------->

                    <!-- <v-col cols="1"></v-col> -->
                    <v-spacer></v-spacer>

                    <!----------right side--------->
                    <v-col cols="6" xl="4">
                        <!----------edit/view seb settings--------->
                        <v-row>
                            <v-col>
                                <v-sheet class="rounded-lg pa-4" elevation="4">
                                    <v-row align="center">
                                        <v-col>
                                            {{
                                                translate(
                                                    getSEBSettingsNameKey(),
                                                )
                                            }}
                                        </v-col>

                                        <v-col align="right" cols="4">
                                            <v-btn
                                                block
                                                color="primary"
                                                :disabled="
                                                    sebSettingsStore.selectedContainerId ==
                                                    null
                                                "
                                                rounded="sm"
                                                variant="flat"
                                                @click="openSebSettingsDialog()"
                                            >
                                                {{
                                                    translate(
                                                        sebSettingsStore.readonly
                                                            ? "general.viewButton"
                                                            : "general.editButton",
                                                    )
                                                }}
                                            </v-btn>
                                            <v-tooltip
                                                v-if="
                                                    sebSettingsStore.selectedContainerId ==
                                                    null
                                                "
                                                activator="parent"
                                            >
                                                <p class="pre-line">
                                                    {{
                                                        translate(
                                                            "examDetail.main.noSEBSettings",
                                                        )
                                                    }}
                                                </p>
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>
                                </v-sheet>
                            </v-col>
                        </v-row>

                        <!----------exam config--------->
                        <v-row class="mt-6">
                            <v-col>
                                <v-sheet class="rounded-lg pa-4" elevation="4">
                                    <v-row align="center">
                                        <v-col>
                                            {{
                                                translate(
                                                    "examDetail.main.downloadExamConfig",
                                                )
                                            }}
                                        </v-col>
                                        <v-col align="right" cols="4">
                                            <v-btn
                                                block
                                                color="primary"
                                                :disabled="
                                                    !ability.canDoExamAction(
                                                        GUIAction.EditSEBSettings,
                                                        examStore.selectedExam,
                                                    )
                                                "
                                                rounded="sm"
                                                variant="flat"
                                                @click="
                                                    startExamConfigDownloadProcess()
                                                "
                                            >
                                                {{
                                                    translate(
                                                        "general.downloadButton",
                                                    )
                                                }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-sheet>
                            </v-col>
                        </v-row>

                        <!----------more options--------->
                        <v-row class="mt-6">
                            <v-col>
                                <v-card
                                    class="rounded-lg pa-4"
                                    color="primary"
                                    variant="outlined"
                                >
                                    <v-row align="center">
                                        <v-col>
                                            <div>
                                                {{
                                                    translate(
                                                        "examDetail.main.moreExamOptions",
                                                    )
                                                }}
                                            </div>

                                            <v-list
                                                class="mt-4"
                                                select-strategy="leaf"
                                            >
                                                <!----------Apply Screen Proctoring--------->
                                                <v-list-item>
                                                    <v-list-item-title
                                                        :class="[
                                                            !ability.canDoExamAction(
                                                                GUIAction.EditScreenProctoring,
                                                                examStore.selectedExam,
                                                            )
                                                                ? 'disabled-text-color'
                                                                : '',
                                                        ]"
                                                    >
                                                        {{
                                                            translate(
                                                                "examDetail.main.applySP",
                                                            )
                                                        }}
                                                    </v-list-item-title>
                                                    <template #append>
                                                        <v-list-item-action
                                                            class="flex-column align-right"
                                                        >
                                                            <v-switch
                                                                v-model="
                                                                    isScreenProctoringActive
                                                                "
                                                                color="primary"
                                                                :disabled="
                                                                    !ability.canDoExamAction(
                                                                        GUIAction.EditScreenProctoring,
                                                                        examStore.selectedExam,
                                                                    )
                                                                "
                                                                hide-details
                                                                @update:model-value="
                                                                    applyScreenProctoring()
                                                                "
                                                            >
                                                            </v-switch>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                                <v-divider
                                                    class="border-opacity-25"
                                                    :thickness="2"
                                                ></v-divider>

                                                <!----------Apply SEB Lock--------->
                                                <v-list-item>
                                                    <v-list-item-title
                                                        :class="[
                                                            hasSEBRestrictionFeature() &&
                                                            ability.canDoExamAction(
                                                                GUIAction.ApplySEBRestriction,
                                                                examStore.selectedExam,
                                                            )
                                                                ? ''
                                                                : 'disabled-text-color',
                                                        ]"
                                                    >
                                                        {{
                                                            translate(
                                                                "examDetail.main.applySebLock",
                                                            )
                                                        }}
                                                    </v-list-item-title>
                                                    <template #append>
                                                        <v-list-item-action
                                                            class="flex-column align-right"
                                                        >
                                                            <v-switch
                                                                v-model="
                                                                    isSEBLockActive
                                                                "
                                                                color="primary"
                                                                :disabled="
                                                                    !hasSEBRestrictionFeature() ||
                                                                    !ability.canDoExamAction(
                                                                        GUIAction.ApplySEBRestriction,
                                                                        examStore.selectedExam,
                                                                    )
                                                                "
                                                                hide-details
                                                                @update:model-value="
                                                                    applySEBLock()
                                                                "
                                                            >
                                                            </v-switch>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                                <v-divider
                                                    class="border-opacity-25"
                                                    :thickness="2"
                                                ></v-divider>

                                                <!----------SEB Keys--------->
                                                <v-list-item>
                                                    <v-list-item-title
                                                        :class="[
                                                            hasSEBRestrictionFeature() &&
                                                            ability.canDoExamAction(
                                                                GUIAction.ApplySEBRestriction,
                                                                examStore.selectedExam,
                                                            )
                                                                ? ''
                                                                : 'disabled-text-color',
                                                        ]"
                                                    >
                                                        {{
                                                            translate(
                                                                "examDetail.main.sebKeys",
                                                            )
                                                        }}
                                                    </v-list-item-title>
                                                    <template #append>
                                                        <v-list-item-action
                                                            class="flex-column align-right"
                                                        >
                                                            <v-icon
                                                                :disabled="
                                                                    !hasSEBRestrictionFeature() ||
                                                                    !ability.canDoExamAction(
                                                                        GUIAction.ApplySEBRestriction,
                                                                        examStore.selectedExam,
                                                                    )
                                                                "
                                                                icon="mdi-key-outline"
                                                                style="
                                                                    font-size: 30px;
                                                                "
                                                            >
                                                            </v-icon>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                                <v-divider
                                                    class="border-opacity-25"
                                                    :thickness="2"
                                                ></v-divider>

                                                <!----------Archive Exam--------->
                                                <v-list-item
                                                    v-if="
                                                        ability.canDo(
                                                            GUIAction.ArchiveExam,
                                                        )
                                                    "
                                                >
                                                    <v-list-item-title
                                                        :class="[
                                                            !ability.canDoExamAction(
                                                                GUIAction.ArchiveExam,
                                                                examStore.selectedExam,
                                                            )
                                                                ? 'disabled-text-color'
                                                                : '',
                                                        ]"
                                                    >
                                                        {{
                                                            translate(
                                                                "examDetail.main.archiveExam",
                                                            )
                                                        }}
                                                    </v-list-item-title>
                                                    <template #append>
                                                        <v-list-item-action
                                                            class="flex-column align-right"
                                                        >
                                                            <v-icon
                                                                :disabled="
                                                                    !ability.canDoExamAction(
                                                                        GUIAction.ArchiveExam,
                                                                        examStore.selectedExam,
                                                                    )
                                                                "
                                                                icon="mdi-archive-outline"
                                                                style="
                                                                    font-size: 30px;
                                                                "
                                                                @click="
                                                                    openArchiveDialog()
                                                                "
                                                            >
                                                            </v-icon>
                                                        </v-list-item-action>
                                                    </template>

                                                    <v-tooltip
                                                        v-if="
                                                            !ability.canDoExamAction(
                                                                GUIAction.ApplySEBRestriction,
                                                                examStore.selectedExam,
                                                            )
                                                        "
                                                        activator="parent"
                                                    >
                                                        {{
                                                            translate(
                                                                "examDetail.main.archiveTooltip",
                                                            )
                                                        }}
                                                    </v-tooltip>
                                                </v-list-item>
                                                <v-divider
                                                    v-if="
                                                        ability.canDo(
                                                            GUIAction.ArchiveExam,
                                                        )
                                                    "
                                                    class="border-opacity-25"
                                                    :thickness="2"
                                                ></v-divider>

                                                <!----------Delete Exam--------->
                                                <v-list-item>
                                                    <v-list-item-title>
                                                        {{
                                                            translate(
                                                                "examDetail.main.deleteExam",
                                                            )
                                                        }}
                                                    </v-list-item-title>
                                                    <template #append>
                                                        <v-list-item-action
                                                            class="flex-column align-right"
                                                        >
                                                            <v-icon
                                                                icon="mdi-delete-outline"
                                                                style="
                                                                    font-size: 30px;
                                                                "
                                                                @click="
                                                                    openDeleteDialog()
                                                                "
                                                            >
                                                            </v-icon>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                            </v-list>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                        <!----------------------->
                    </v-col>
                    <!----------end right side--------->
                    <v-spacer></v-spacer>
                </v-row>
                <!--------end info and action row------>
            </v-sheet>
        </v-col>
    </v-row>

    <!-----------supervisor dialog---------->
    <v-dialog v-model="supervisorsDialog" max-width="1200">
        <ExamDetailSupervisorsDialog
            :inital-supervisors="examStore.selectedExamSupervisors"
            @close-supervisors-dialog="closeSupervisorsDialog"
            @update-exam-supervisors="updateExamSupervisors"
        >
        </ExamDetailSupervisorsDialog>
    </v-dialog>

    <!-----------connection configuration dialog---------->
    <v-dialog
        v-if="connectionConfigurationsPar"
        v-model="configDialog"
        max-width="800"
    >
        <ExamDetailConfigDialog
            :connection-configurations="connectionConfigurationsPar"
            @close-config-dialog="closeConfigDialog"
            @download-exam-config="downloadExamConfig"
        >
        </ExamDetailConfigDialog>
    </v-dialog>

    <!-----------archive dialog---------->
    <v-dialog v-model="archiveDialog" max-width="800">
        <ExamDetailArchiveDialog
            @archive-exam="archiveExam"
            @close-archive-dialog="closeArchiveDialog"
        >
        </ExamDetailArchiveDialog>
    </v-dialog>

    <!-----------delete exam dialog---------->
    <v-dialog v-model="deleteDialog" max-width="800">
        <DeleteConfirmDialog
            info-text="This deletes the exam and the local import of a course or quiz in SEB Server."
            question-text="Are you sure you want to delete the exam?"
            title="Delete Exam"
            @close-delete-dialog="closeDeleteDialog"
            @delete-function="deleteExam"
        >
        </DeleteConfirmDialog>
    </v-dialog>

    <!-----------exam template dialog---------->
    <v-dialog v-model="examTemplateDialog" max-width="600">
        <ExamTemplateDialog
            :exam-template="examStore.selectedExamTemplate"
            @close-exam-template-dialog="closeExamTemplateDialog"
        >
        </ExamTemplateDialog>
    </v-dialog>

    <!-----------seb settings dialog---------->
    <v-dialog
        v-model="sebSettingsDialog"
        persistent
        height="80vh"
        max-width="1200"
    >
        <SebSettingsDialog @close-seb-settings-dialog="closeSebSettingsDialog">
        </SebSettingsDialog>
    </v-dialog>

    <!-----------group dialog---------->
    <v-dialog v-model="clientGroupDialog" max-width="1200">
        <ClientGroupListDialog
            @close-client-group-dialog="closeClientGroupDialog"
        >
        </ClientGroupListDialog>
    </v-dialog>

    <!-----------add groups dialog---------->
    <v-dialog v-model="addclientGroupDialog" max-width="800">
        <AddClientGroupDialog
            @close-add-client-group-dialog="closeAddClientGroupDialog"
        >
        </AddClientGroupDialog>
    </v-dialog>

    <!--alert msg-->
    <AlertMsg
        v-if="alertAvailable"
        :alert-props="{
            title: '',
            color: alertColor,
            type: 'snackbar',
            textKey: alertKey,
            timeout: 5000,
        }"
    >
    </AlertMsg>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useExamStore } from "@/stores/seb-server/examStore";
import * as constants from "@/utils/constants";
import * as examViewService from "@/services/seb-server/component-services/examViewService";
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
import * as assessmentToolViewService from "@/services/seb-server/component-services/assessmentToolViewService";
import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
import * as clientGroupViewService from "@/services/seb-server/component-services/clientGroupViewService";
import * as generalUtils from "@/utils/generalUtils";
import { navigateTo } from "@/router/navigation";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum";
import DeleteConfirmDialog from "@/components/widgets/DeleteConfirmDialog.vue";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import { translate } from "@/utils/generalUtils";
import { LMSFeatureEnum } from "@/models/seb-server/assessmentToolEnums";
import { GUIAction, useAbilities } from "@/services/ability";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { useRoute } from "vue-router";
import { UserAccount } from "@/models/userAccount";
import { ExamConfigMapping } from "@/models/seb-server/sebSettings";
import { ScreenProctoringSettings } from "@/models/seb-server/screenProctoring";
import { Exam } from "@/models/seb-server/exam";
import { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration";
import { ClientGroups } from "@/models/seb-server/clientGroup";
import { AssessmentTool } from "@/models/seb-server/assessmentTool";
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import ExamDetailSupervisorsDialog from "@/components/views/seb-server/exam/detail/dialogs/ExamDetailSupervisorsDialog.vue";
import ExamDetailConfigDialog from "@/components/views/seb-server/exam/detail/dialogs/ExamDetailConfigDialog.vue";
import ExamDetailArchiveDialog from "@/components/views/seb-server/exam/detail/dialogs/ExamDetailArchiveDialog.vue";
import ClientGroupListDialog from "@/components/views/seb-server/exam/detail/dialogs/client-group/ClientGroupListDialog.vue";
import AddClientGroupDialog from "@/components/views/seb-server/exam/detail/dialogs/client-group/AddClientGroupDialog.vue";
import ExamTemplateDialog from "@/components/widgets/ExamTemplateDialog.vue";
import SebSettingsDialog from "@/components/views/seb-server/settings/SebSettingsDialog.vue";

// general
const isPageInitalizing = ref<boolean>(true);

// stores
const examStore = useExamStore();
const sebSettingsStore = useSEBSettingsStore();
const ability = useAbilities();

// exam
const examId = useRoute().params.examId.toString();

// pw field
const passwordVisible = ref<boolean>(false);
const quitPassword = ref<string>("");

// supervisors table
const supervisorsTableHeadersRef = ref<(HTMLElement | null)[]>([]);
const supervisorsTableHeaders = ref([
    { title: translate("examDetail.main.supervisorUsername"), key: "username" },
    { title: translate("examDetail.main.supervisorName"), key: "name" },
    { title: translate("examDetail.main.supervisorSurname"), key: "surname" },
]);

// supervisors dialog
const supervisorsDialog = ref<boolean>(false);
let initialSupervisorsIds: string[] = [];

// exam config dialog
const configDialog = ref<boolean>(false);
const connectionConfigurationsPar = ref<ConnectionConfigurations | null>(null);

// archive dialog
const archiveDialog = ref<boolean>(false);

// exam template dialog
const examTemplateDialog = ref<boolean>(false);

// delete exam
const deleteDialog = ref<boolean>(false);

// alert
const alertAvailable = ref<boolean>();
const alertColor = ref<string>("");
const alertKey = ref<string>("");

// SEB lock
const isSEBLockActive = ref<boolean>(false);

// screen proctoring
const isScreenProctoringActive = ref<boolean>(false);

// seb settings
const sebSettingsDialog = ref<boolean>(false);

// client groups
const clientGroupDialog = ref<boolean>(false);
const clientGroupTableHeadersRef = ref<(HTMLElement | null)[]>([]);
const clientGroupTableHeaders = ref([
    {
        title: translate("examDetail.main.tableHeadersGroupName"),
        key: "name",
        width: "45%",
    },
    {
        title: translate("examDetail.main.tableHeadersGroupType"),
        key: "type",
        width: "45%",
    },
    {
        title: translate("examDetail.main.tableHeadersScreenProctoring"),
        key: "sp",
        width: "10%",
        center: true,
        align: "center",
    },
]);

// add client groups
const addclientGroupDialog = ref<boolean>(false);

onBeforeMount(async () => {
    examStore.clearSelectedValues();

    await getExam();
    await getExamTemplate();
    await getTemplateGroupsWithSp();
    await getAssessmentTool();
    await getExamSupervisors();
    await getClientGroups();
    await getSEBSettings();

    setQuitPassword();
    setScreenProctoring();

    isPageInitalizing.value = false;
});

//= =======exam api===========
async function getExam() {
    const examResponse: Exam | null = await examViewService.getExam(examId);

    if (examResponse == null) {
        return;
    }

    examStore.selectedExam = examResponse;
    isSEBLockActive.value = await examViewService.hasSEBLock(examId);
}

async function updateExam(isSupervisorsManualUpdate?: boolean) {
    alertAvailable.value = false;

    if (examStore.selectedExam == null) {
        return;
    }

    const updateExamResponse: Exam | null = await examViewService.updateExam(
        examId,
        examStore.selectedExam,
    );

    if (updateExamResponse == null) {
        return;
    }

    if (isSupervisorsManualUpdate) {
        getExamSupervisors();
    }

    alertAvailable.value = true;
    alertColor.value = "success";
    alertKey.value = "exam-update-successful";

    examStore.selectedExam = updateExamResponse;
}

//= =============seb lock logic=================
async function getAssessmentTool() {
    const lmsId: number | undefined = examStore.selectedExam?.lmsSetupId;

    if (lmsId == null) {
        return;
    }

    const assessmentToolResponse: AssessmentTool | null =
        await assessmentToolViewService.getAssessmentTool(lmsId);
    if (assessmentToolResponse == null) {
        return;
    }

    examStore.relatedAssessmentTool = assessmentToolResponse;
}

function hasSEBRestrictionFeature(): boolean {
    if (examStore.relatedAssessmentTool) {
        return generalUtils.hasLMSFeature(
            examStore.relatedAssessmentTool.lmsType,
            LMSFeatureEnum.SEB_RESTRICTION,
        );
    }
    return false;
}

async function applySEBLock() {
    if (isSEBLockActive.value) {
        changeSEBLock(true);
        return;
    }

    changeSEBLock(false);
}

async function changeSEBLock(enable: boolean) {
    if (examStore.selectedExam == null) {
        return;
    }

    const applySEBLockResponse: Exam | null =
        await examViewService.applySEBLock(
            examStore.selectedExam.id.toString(),
            enable,
        );

    if (applySEBLockResponse == null) {
        isSEBLockActive.value = !enable;
        return;
    }

    examStore.selectedExam = applySEBLockResponse;
}

//= ==============supervisors logic====================
async function getExamSupervisors() {
    if (examStore.selectedExam?.supporter == null) {
        return;
    }

    if (examStore.selectedExam.supporter.length === 0) {
        examStore.selectedExamSupervisors = [];
        return;
    }

    examStore.selectedExamSupervisors = [];
    for (let i = 0; i < examStore.selectedExam.supporter.length; i++) {
        const userAccount: UserAccount | null =
            await userAccountViewService.getUserAccountById(
                examStore.selectedExam.supporter[i],
            );

        if (userAccount === null || userAccount === undefined) {
            continue;
        }

        examStore.selectedExamSupervisors.push(userAccount);
    }
}

function openSupervisorsDialog() {
    // add supervisors id to list to determine change
    fillAlreadySelectedSupervisors();
    supervisorsDialog.value = true;
}

function closeSupervisorsDialog() {
    supervisorsDialog.value = false;
}

async function updateExamSupervisors(selectedExamSupervisors: UserAccount[]) {
    if (examStore.selectedExam == null) {
        return;
    }

    examStore.selectedExam.supporter = selectedExamSupervisors.map(
        (supervisor) => supervisor.uuid,
    );
    await updateExam(true);
    closeSupervisorsDialog();
}

function fillAlreadySelectedSupervisors() {
    initialSupervisorsIds = [];
    for (let i = 0; i < examStore.selectedExamSupervisors.length; i++) {
        initialSupervisorsIds.push(examStore.selectedExamSupervisors[i].uuid);
    }
}

//= ==============password logic====================
function setQuitPassword() {
    if (
        examStore.selectedExam?.quitPassword == null ||
        examStore.selectedExam?.quitPassword === ""
    ) {
        return;
    }

    quitPassword.value = examStore.selectedExam?.quitPassword;
}

async function saveNewPassword(focusIn: boolean) {
    if (!focusIn) {
        updateQuitPassword();
    }
}

async function updateQuitPassword() {
    if (
        examStore.selectedExam == null ||
        quitPassword.value === examStore.selectedExam?.quitPassword
    ) {
        return;
    }

    examStore.selectedExam.quitPassword = quitPassword.value;
    updateExam();
}

//= ==============exam config logic====================
function openConfigDialog(connectionConfigurations: ConnectionConfigurations) {
    connectionConfigurationsPar.value = connectionConfigurations;
    configDialog.value = true;
}

function closeConfigDialog() {
    configDialog.value = false;
}

async function startExamConfigDownloadProcess() {
    const connectionConfigurations: ConnectionConfigurations | null =
        await examViewService.getConnectionConfigurations();

    if (connectionConfigurations == null) {
        return;
    }

    if (connectionConfigurations.content.length === 1) {
        downloadExamConfig(connectionConfigurations.content[0].id.toString());
        return;
    }

    openConfigDialog(connectionConfigurations);
}

async function downloadExamConfig(connectionId: string) {
    if (configDialog.value) {
        closeConfigDialog();
    }

    if (examStore.selectedExam == null) {
        return;
    }

    const blobResponse = await examViewService.downloadExamConfig(
        examStore.selectedExam.id.toString(),
        connectionId,
    );

    if (blobResponse == null) {
        return;
    }

    examViewService.createDownloadLink(
        examStore.selectedExam.quizName,
        blobResponse,
    );
}

//= ==============monitor & archive exam logic====================
function openArchiveDialog() {
    archiveDialog.value = true;
}

function closeArchiveDialog() {
    archiveDialog.value = false;
}

async function archiveExam() {
    closeArchiveDialog();

    if (examStore.selectedExam == null) {
        return;
    }

    const archiveExamResponse: Exam | null = await examViewService.archiveExam(
        examStore.selectedExam.id.toString(),
    );

    if (archiveExamResponse == null) {
        return;
    }

    updateExam();
}

//= ==============screen proctoring logic====================
function setScreenProctoring() {
    if (examStore.selectedExam == null) {
        return;
    }

    if (
        examStore.selectedExam.additionalAttributes.enableScreenProctoring ===
        "true"
    ) {
        isScreenProctoringActive.value = true;
    }
}

async function applyScreenProctoring() {
    if (isScreenProctoringActive.value) {
        changeScreenProctoringSettings(true);
        return;
    }

    changeScreenProctoringSettings(false);
}

async function changeScreenProctoringSettings(enable: boolean) {
    if (examStore.selectedExam == null) {
        return;
    }

    const saveScreenProcResponse: Exam | null =
        await examViewService.activateScreenProctoring(
            examStore.selectedExam.id.toString(),
            enable,
        );

    if (saveScreenProcResponse == null) {
        isScreenProctoringActive.value = !enable;
        return;
    }

    examStore.selectedExam = saveScreenProcResponse;
}

//= ==============delete exam logic====================
function openDeleteDialog() {
    deleteDialog.value = true;
}

function closeDeleteDialog() {
    deleteDialog.value = false;
}

async function deleteExam() {
    const deleteExamResponse: undefined | null =
        await examViewService.deleteExam(examId);

    if (deleteExamResponse == null) {
        return;
    }

    navigateTo(constants.EXAM_ROUTE);
}

//= ==============exam template logic====================
async function getExamTemplate() {
    if (examStore.selectedExam?.examTemplateId == null) {
        return;
    }

    const examTemplateResponse: ExamTemplate | null =
        await examViewService.getExamTemplate(
            examStore.selectedExam?.examTemplateId.toString(),
        );

    if (examTemplateResponse == null) {
        return;
    }

    examStore.selectedExamTemplate = examTemplateResponse;
}

async function getTemplateGroupsWithSp() {
    const tmpl = examStore.selectedExamTemplate;
    if (!tmpl || tmpl.id == null) return;

    const examTemplateSp: ScreenProctoringSettings | null =
        await examViewService.getExamTemplateSp(String(tmpl.id));

    if (!examTemplateSp) return;

    examStore.templateGroupsWithSp = generalUtils.createNumberIdList(
        examTemplateSp.spsSEBGroupsSelection,
    );
}

function openExamTemplateDialog() {
    examTemplateDialog.value = true;
}

function closeExamTemplateDialog() {
    examTemplateDialog.value = false;
}

//= ==============test run logic====================
// calling this function again after test run has been applied disables the test run
async function applyTestRun() {
    const applyTestRunResponse: Exam | null =
        await examViewService.applyTestRun(examId);

    if (applyTestRunResponse == null) {
        return;
    }

    updateExam();
}

//= ==============settings logic====================
async function getSEBSettings() {
    sebSettingsStore.clearAll();
    const configs: ExamConfigMapping[] | null =
        await sebSettingsService.getExamConfigMapping(examId);
    if (configs != null && configs.length > 0) {
        // init sebSettingsStore to work with Exam SEB Settings context
        sebSettingsStore.isExam = true;
        if (examStore.selectedExam != null) {
            sebSettingsStore.selectedContainerId = examStore.selectedExam.id;
            if (examStore.selectedExam != null) {
                sebSettingsStore.readonly = !ability.canDoExamAction(
                    GUIAction.EditSEBSettings,
                    examStore.selectedExam,
                );
                if (!sebSettingsStore.readonly) {
                    // check also if there are no active SEB clients, otherwise set so on storage
                    const numActiveClients =
                        await sebSettingsService.getActiveSEBClients(examId);
                    if (numActiveClients != null && numActiveClients > 0) {
                        sebSettingsStore.readonly = true;
                        sebSettingsStore.activeSEBClientConnection =
                            numActiveClients;
                    }
                }
            } else {
                sebSettingsStore.readonly = true;
            }

            const fullSEBSettings = ability.canDo(
                GUIAction.EditFullSEBSettings,
            );
            sebSettingsStore.dialogTitle = sebSettingsStore.readonly
                ? fullSEBSettings
                    ? "examDetail.main.sebSettings"
                    : "examDetail.main.appNetworkSettings"
                : fullSEBSettings
                  ? "examDetail.main.editSEBSettings"
                  : "examDetail.main.editAppNetworkSettings";
        }
        // TODO this is only for testing, remove it when done
        //sebSettingsStore.activeSEBClientConnection = 2;
    }
}

function getSEBSettingsNameKey() {
    const fullSEBSettings = ability.canDo(GUIAction.EditFullSEBSettings);
    return fullSEBSettings
        ? "examDetail.main.sebSettings"
        : "examDetail.main.appNetworkSettings";
}

function openSebSettingsDialog() {
    sebSettingsDialog.value = true;
}

async function closeSebSettingsDialog(apply?: boolean) {
    sebSettingsDialog.value = false;
    if (apply) {
        await sebSettingsService.publish(examId);
    } else {
        await sebSettingsService.undoChanges(examId);
    }
}

//= ==============groups logic====================
function openClientGroupDialog() {
    clientGroupDialog.value = true;
}

function closeClientGroupDialog(isChange?: boolean) {
    clientGroupDialog.value = false;

    if (isChange) {
        getClientGroups();
    }
}

async function getClientGroups() {
    if (examStore.selectedExam == null) {
        return;
    }

    const clientGroupResponse: ClientGroups | null =
        await clientGroupViewService.getClientGroups(examId);

    if (clientGroupResponse == null) {
        return;
    }

    examStore.selectedClientGroups = clientGroupResponse.content;
}

//= ==============add groups logic====================
function openAddClientGroupDialog() {
    addclientGroupDialog.value = true;
}

function closeAddClientGroupDialog(isChange?: boolean) {
    addclientGroupDialog.value = false;

    if (isChange) {
        getClientGroups();
    }
}
</script>

<style scoped>
.pre-line {
    white-space: pre-line;
}
</style>
