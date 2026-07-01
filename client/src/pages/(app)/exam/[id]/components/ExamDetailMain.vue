<template>
    <v-row>
        <v-col>
            <v-sheet class="rounded-lg pa-8" elevation="2">
                <!----------title--------->
                <v-row>
                    <v-col>
                        <div
                            class="text-primary text-headline-small font-weight-bold"
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
                        <!----------basic settings--------->
                        <v-row>
                            <v-col>
                                <BoxBasicSettings
                                    :basic-settings="basicSettings"
                                />
                            </v-col>
                        </v-row>

                        <!----------test run--------->
                        <v-row>
                            <v-col>
                                <v-sheet class="rounded-lg pa-4" elevation="2">
                                    <v-row class="align-center">
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
                                <v-card class="rounded-lg pa-4" elevation="2">
                                    <v-row class="align-center">
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
                                                @click="openMonitoringOverview"
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
                                <v-card class="rounded-lg pa-4" elevation="2">
                                    <v-row class="align-center">
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
                                                @click="openFinishedExamData"
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
                            <v-col class="text-primary text-title-large">
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
                                <div class="text-body-large">
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
                            <v-col class="text-primary text-title-large">
                                {{
                                    translate("examDetail.main.examSupervisors")
                                }}
                            </v-col>

                            <v-col align="right">
                                <v-btn
                                    :disabled="
                                        !ability.canDoExamAction(
                                            GUIAction.EditSupervisors,
                                            examStore.selectedExam,
                                        )
                                    "
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
                                    class="rounded-lg elevation-1 mt-4"
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
                            <v-col class="text-primary text-title-large">
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
                                    class="rounded-lg elevation-1 mt-4"
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
                                <div class="text-primary text-title-large">
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
                                <v-sheet class="rounded-lg pa-4" elevation="2">
                                    <v-row class="align-center">
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
                                                    !seb_settings_context
                                                "
                                                rounded="sm"
                                                variant="flat"
                                                @click="openSebSettingsDialog()"
                                            >
                                                {{
                                                    translate(
                                                        isSEBSettingsReadonly()
                                                            ? "general.viewButton"
                                                            : "general.editButton",
                                                    )
                                                }}
                                            </v-btn>
                                            <v-tooltip
                                                v-if="!seb_settings_context"
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
                                <v-sheet class="rounded-lg pa-4" elevation="2">
                                    <v-row class="align-center">
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
                                    <v-row class="align-center">
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
                                                                ? 'text-disabled'
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
                                                <v-list-item
                                                    v-if="
                                                        hasSEBRestrictionFeature()
                                                    "
                                                >
                                                    <v-list-item-title
                                                        :class="[
                                                            hasSEBRestrictionFeature() &&
                                                            ability.canDoExamAction(
                                                                GUIAction.ApplySEBRestriction,
                                                                examStore.selectedExam,
                                                            )
                                                                ? ''
                                                                : 'text-disabled',
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
                                                    v-if="
                                                        hasSEBRestrictionFeature()
                                                    "
                                                    class="border-opacity-25"
                                                    :thickness="2"
                                                ></v-divider>

                                                <!----------SEB Keys--------->
                                                <v-list-item>
                                                    <v-list-item-title
                                                        :class="[
                                                            ability.canDoExamAction(
                                                                GUIAction.ApplySEBRestriction,
                                                                examStore.selectedExam,
                                                            )
                                                                ? ''
                                                                : 'text-disabled',
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
                                                                :disabled="
                                                                    !ability.canDoExamAction(
                                                                        GUIAction.DeleteExam,
                                                                        examStore.selectedExam,
                                                                    )
                                                                "
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
        <SebSettingsDialog
            v-if="seb_settings_context"
            :context="seb_settings_context"
            :active-s-e-b-client-connection="activeClients"
            :dialog-title="getSEBSettingsTitle()"
            @close-seb-settings-dialog="closeSebSettingsDialog"
        >
        </SebSettingsDialog>
    </v-dialog>

    <!-----------group dialog---------->
    <v-dialog v-model="clientGroupDialog" max-width="1200">
        <ClientGroupListDialog
            :exam-id="examId"
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
import AlertMsg from "@/components/widgets/AlertMsg.vue";
import { ref, onBeforeMount, ComputedRef, computed } from "vue";
import { useExamStore } from "@/stores/seb-server/examStore.ts";
import * as examService from "@/services/seb-server/examService.ts";
import * as sebSettingsService from "@/services/seb-server/sebSettingsService.ts";
import * as assessmentToolService from "@/services/seb-server/assessmentToolService.ts";
import * as examTemplateService from "@/services/seb-server/examTemplateService.ts";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import * as connectionConfigurationService from "@/services/seb-server/connectionConfigurationInfoService.ts";

import * as userAccountService from "@/services/seb-server/userAccountService.ts";
import * as clientGroupService from "@/services/seb-server/clientGroupService.ts";
import * as generalUtils from "@/utils/generalUtils.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import DeleteConfirmDialog from "@/components/widgets/DeleteConfirmDialog.vue";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum.ts";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import { translate } from "@/utils/generalUtils.ts";
import { LMSFeatureEnum } from "@/models/seb-server/assessmentToolEnums.ts";
import { GUIAction, useAbilities } from "@/services/ability.ts";
import { useRouter } from "vue-router";
import { UserAccount } from "@/models/userAccount.ts";
import { ScreenProctoringSettings } from "@/models/seb-server/screenProctoring.ts";
import { BasicSettings, Exam } from "@/models/seb-server/exam.ts";
import { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration.ts";
import { ClientGroups } from "@/models/seb-server/clientGroup.ts";
import { AssessmentTool } from "@/models/seb-server/assessmentTool.ts";
import { ExamTemplate } from "@/models/seb-server/examTemplate.ts";
import ExamDetailSupervisorsDialog from "@/pages/(app)/exam/[id]/components/dialogs/ExamDetailSupervisorsDialog.vue";
import ExamDetailConfigDialog from "@/pages/(app)/exam/[id]/components/dialogs/ExamDetailConfigDialog.vue";
import ClientGroupListDialog from "@/pages/(app)/exam/[id]/components/dialogs/client-group/ClientGroupListDialog.vue";
import AddClientGroupDialog from "@/pages/(app)/exam/[id]/components/dialogs/client-group/AddClientGroupDialog.vue";
import ExamTemplateDialog from "@/components/widgets/ExamTemplateDialog.vue";
import SebSettingsDialog from "@/components/widgets/sebSettings/SebSettingsDialog.vue";
import { activateScreenProctoring } from "@/services/seb-server/screenProctoringService.ts";
import * as timeUtils from "@/utils/timeUtils.ts";
import { SEBSettingsContext } from "@/components/widgets/sebSettings/types.ts";
import BoxBasicSettings from "@/pages/(app)/exam/[id]/components/BoxBasicSettings/BoxBasicSettings.vue";

const router = useRouter();
const props = defineProps<{
    id: string;
}>();
// general
const isPageInitializing = ref<boolean>(true);

// stores
const examStore = useExamStore();
const ability = useAbilities();

// exam
const examId = props.id;

const basicSettings = computed<BasicSettings>(() => ({
    quizName: examStore.selectedExam?.quizName ?? "",
    description: examStore.selectedExam?.description ?? "",
    startURL: examStore.selectedExam?.startURL ?? "",
    quizStartTime: examStore.selectedExam?.quizStartTime ?? "",
    quizEndTime: examStore.selectedExam?.quizEndTime ?? "",
    type: examStore.selectedExam?.type ?? "",
    status: examStore.selectedExam?.status ?? "",
}));

function openMonitoringOverview() {
    void router.push({
        name: "/(app)/monitoring/[examId]/",
        params: { examId },
    });
}
// TODO reroute to finished exam once implemented
function openFinishedExamData() {
    return;
}

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
const activeClients = ref<number>(0);
const seb_settings_context: ComputedRef<SEBSettingsContext | undefined> =
    computed(() => {
        if (!examStore.selectedExam) {
            return undefined;
        }

        const acNum = activeClients.value ? activeClients.value : 0;

        return {
            isExam: true,
            containerId: examStore.selectedExam.id.toString(),
            readonly: isSEBSettingsReadonly() || acNum > 0,
            ignoreSEBService: ref<boolean>(false),
        };
    });

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

    const numActiveClients =
        await sebSettingsService.getActiveSEBClients(examId);
    activeClients.value = numActiveClients ? numActiveClients : 0;

    setQuitPassword();
    setScreenProctoring();

    isPageInitializing.value = false;
});

//= =======exam api===========
async function getExam() {
    const examResponse: Exam | null = await examService.getExam(examId);

    if (examResponse == null) {
        return;
    }

    examStore.selectedExam = examResponse;
    isSEBLockActive.value = await examService.checkSEBLock(examId);
}

async function updateExam(isSupervisorsManualUpdate?: boolean) {
    alertAvailable.value = false;

    if (examStore.selectedExam == null) {
        return;
    }

    const updateExamResponse: Exam | null = await examService.updateExam(
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
        await assessmentToolService.getAssessmentTool(lmsId);
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

    const applySEBLockResponse: Exam | null = await applySEBLockService(
        examStore.selectedExam.id.toString(),
        enable,
    );

    if (applySEBLockResponse == null) {
        isSEBLockActive.value = !enable;
        return;
    }

    examStore.selectedExam = applySEBLockResponse;
}

//SEB Lock
async function applySEBLockService(
    id: string,
    enableSEBLock: boolean,
): Promise<Exam | null> {
    try {
        return enableSEBLock
            ? await examService.addSEBLock(id)
            : await examService.removeSEBLock(id);
    } catch {
        return null;
    }
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
            await userAccountService.getUserAccountById(
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
        await connectionConfigurationService.getConnectionConfigurationsActive();

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
    const blobResponse =
        await connectionConfigurationService.downloadExamConfig(
            examStore.selectedExam.id.toString(),
            connectionId,
        );

    if (blobResponse == null) {
        return;
    }

    createDownloadLink(examStore.selectedExam.quizName, blobResponse);
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

    const saveScreenProcResponse: Exam | null = await activateScreenProctoring(
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

// exam service is right
async function deleteExam() {
    const deleteExamResponse: unknown = await examService.deleteExam(examId);

    if (deleteExamResponse == null) {
        return;
    }
    await router.push({ name: "/(app)/exam/" });
}

//= ==============exam template logic====================
async function getExamTemplate() {
    if (examStore.selectedExam?.examTemplateId == null) {
        return;
    }
    const examTemplateResponse: ExamTemplate | null =
        await examTemplateService.getExamTemplate(
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
        await examTemplateService.getExamTemplateSp(String(tmpl.id));

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
        await monitoringService.applyTestRun(examId);
    if (applyTestRunResponse == null) {
        return;
    }

    updateExam();
}

//= ==============SEB settings logic====================
function getSEBSettingsTitle(): string {
    const fullSEBSettings = ability.canDo(GUIAction.EditFullSEBSettings);

    return isSEBSettingsReadonly()
        ? fullSEBSettings
            ? "examDetail.main.sebSettings"
            : "examDetail.main.appNetworkSettings"
        : fullSEBSettings
          ? "examDetail.main.editSEBSettings"
          : "examDetail.main.editAppNetworkSettings";
}

function isSEBSettingsReadonly(): boolean {
    return !ability.canDoExamAction(
        GUIAction.EditSEBSettings,
        examStore.selectedExam,
    );
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
        await sebSettingsService.publish(examId, true);
    } else {
        await sebSettingsService.undoChanges(examId, true);
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
        await clientGroupService.getClientGroups(examId);

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

//= ==============exam connection config logic====================
function createDownloadLink(examName: string | undefined, blob: Blob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", getExamConfigFileName(examName));
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function getExamConfigFileName(examName: string | undefined): string {
    if (examName == null) {
        return "";
    }

    examName = examName?.replaceAll(" ", "_");

    return `${examName}_${timeUtils.getCurrentDateString()}.seb`;
}
</script>

<style scoped>
.pre-line {
    white-space: pre-line;
}
</style>
