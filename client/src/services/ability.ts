import { computed } from "vue";

import { useCurrentUserQuery } from "@/composables/useCurrentUser";
import { useGuiAbilitiesQuery } from "@/composables/useGuiAbilities";
import { FeatureEnum, featureNameMapping } from "@/models/features";
import { GUIAction, GUIComponent } from "@/models/guiAbilities";
import { Exam } from "@/models/seb-server/exam";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum";
import * as apiService from "@/services/apiService";
import * as generalUtils from "@/utils/generalUtils";

export { GUIAction, GUIComponent };

// NOTE: anhefti, This acts as the Ability-Interface and should be used in generic components
export type AbilityLike = {
    canView: (component: GUIComponent) => boolean;
    canDo: (action: GUIAction) => boolean;
    isExamSupporter: (exam: Exam) => boolean;
    canDoExamAction: (action: GUIAction, exam: Exam | null) => boolean;
};

const examStatusActions = new Map<ExamStatusEnum, Set<GUIAction>>();

let systemFeaturesFetched = false;
let systemFeatures = new Map<string, boolean>();

// -----------------------------------------------------------------------
// Exam Status ability mapping (SEBSERV-685)

// ExamStatusEnum.UP_COMING
examStatusActions.set(
    ExamStatusEnum.UP_COMING,
    new Set<GUIAction>([
        GUIAction.EDIT_EXAM_SETTINGS,
        GUIAction.DELETE_EXAM,
        GUIAction.APPLY_TEST_RUN,
        GUIAction.EXPORT_EXAM_CLIENT_CONFIG,
        GUIAction.VIEW_ASK_SETTINGS,
        GUIAction.EDIT_ASK_SETTINGS,
        GUIAction.EDIT_SCREEN_PROCTORING,
        GUIAction.EDIT_SEB_SETTINGS,
        GUIAction.EDIT_SUPERVISORS,
        GUIAction.EDIT_INDICATORS,
        GUIAction.EDIT_CLIENT_GROUPS,
        GUIAction.APPLY_SEB_RESTRICTION,
    ]),
);

// ExamStatusEnum.TEST_RUN
examStatusActions.set(
    ExamStatusEnum.TEST_RUN,
    new Set<GUIAction>([
        GUIAction.EDIT_EXAM_SETTINGS,
        GUIAction.DELETE_EXAM,
        GUIAction.DISABLE_TEST_RUN,
        GUIAction.EXPORT_EXAM_CLIENT_CONFIG,
        GUIAction.VIEW_ASK_SETTINGS,
        GUIAction.EDIT_ASK_SETTINGS,
        GUIAction.EDIT_SCREEN_PROCTORING,
        GUIAction.EDIT_SEB_SETTINGS,
        GUIAction.EDIT_SUPERVISORS,
        GUIAction.EDIT_INDICATORS,
        GUIAction.EDIT_CLIENT_GROUPS,
        GUIAction.APPLY_SEB_RESTRICTION,
        GUIAction.SHOW_MONITORING,
    ]),
);

// ExamStatusEnum.RUNNING
examStatusActions.set(
    ExamStatusEnum.RUNNING,
    new Set<GUIAction>([
        GUIAction.EDIT_EXAM_SETTINGS,
        GUIAction.DELETE_EXAM,
        GUIAction.EXPORT_EXAM_CLIENT_CONFIG,
        GUIAction.VIEW_ASK_SETTINGS,
        GUIAction.EDIT_ASK_SETTINGS,
        GUIAction.EDIT_SCREEN_PROCTORING,
        GUIAction.EDIT_SEB_SETTINGS,
        GUIAction.EDIT_SUPERVISORS,
        GUIAction.EDIT_INDICATORS,
        GUIAction.EDIT_CLIENT_GROUPS,
        GUIAction.APPLY_SEB_RESTRICTION,
        GUIAction.SHOW_MONITORING,
    ]),
);

// ExamStatusEnum.FINISHED
examStatusActions.set(
    ExamStatusEnum.FINISHED,
    new Set<GUIAction>([
        GUIAction.EDIT_EXAM_SETTINGS,
        GUIAction.ARCHIVE_EXAM,
        GUIAction.DELETE_EXAM,
        GUIAction.EXPORT_EXAM_CLIENT_CONFIG,
        GUIAction.VIEW_ASK_SETTINGS,
        GUIAction.EDIT_SUPERVISORS,
        GUIAction.APPLY_SEB_RESTRICTION,
        GUIAction.SHOW_FINISHED_EXAM_DATA,
    ]),
);

// ExamStatusEnum.ARCHIVED
examStatusActions.set(
    ExamStatusEnum.ARCHIVED,
    new Set<GUIAction>([
        GUIAction.DELETE_EXAM,
        GUIAction.VIEW_ASK_SETTINGS,
        GUIAction.SHOW_FINISHED_EXAM_DATA,
        GUIAction.EXCLUDE_FROM_DELETION,
    ]),
);

async function hasSystemFeature(feature: FeatureEnum): Promise<boolean> {
    if (!systemFeaturesFetched) {
        // fetch from server
        const response: Map<string, boolean> | null = (
            await apiService.getRequest({
                url: "/quiz",
                options: { _authType: "seb" },
            })
        ).data;
        if (response) {
            systemFeatures = response;
            systemFeaturesFetched = true;
        }
    }

    if (!systemFeaturesFetched) {
        return false;
    }

    const fName = featureNameMapping.get(feature);
    if (!fName) {
        return false;
    }

    return systemFeatures.get(fName) ?? false;
}

export const useAbilities = () => {
    const { data: currentUser } = useCurrentUserQuery();
    const { data: guiAbilities } = useGuiAbilitiesQuery();

    const viewableComponents = computed(
        () => new Set<string>(guiAbilities.value?.components),
    );
    const allowedActions = computed(
        () => new Set<string>(guiAbilities.value?.actions),
    );

    function canView(view: GUIComponent): boolean {
        return viewableComponents.value.has(view);
    }

    function canDo(action: GUIAction): boolean {
        return allowedActions.value.has(action);
    }

    // This would be for special case, when we need to know if a user has Exam access on Exam supporter mapping
    function isExamSupporter(exam: Exam): boolean {
        const user = currentUser.value;
        if (user == null) return false;

        // check if the user is assigned as supporter
        if (exam.supporter.includes(user.uuid)) return true;

        return false;
    }

    function canDoExamAction(action: GUIAction, exam: Exam | null): boolean {
        if (exam == null) {
            return false;
        }

        const user = currentUser.value;
        if (user == null) return false;
        if (user.institutionId != exam.institutionId) {
            return false;
        }

        if (!canDo(action)) {
            return false;
        }

        const examStatus: ExamStatusEnum | null = generalUtils.findEnumValue(
            ExamStatusEnum,
            exam.status,
        );
        if (examStatus == null) {
            return false;
        }

        const statusSet = examStatusActions.get(examStatus);
        if (statusSet) {
            return statusSet.has(action);
        }

        return false;
    }

    return {
        canView,
        canDo,
        isExamSupporter,
        canDoExamAction,
        hasSystemFeature,
    };
};

// In the pages or in the code we can then just use this like

// in components... :disabled="!canDo(GUIAction.DELETE_EXAM)"
// in code... if (canDo(GUIAction.DELETE_EXAM)) ...
// for special cases: :disabled="!(canDo(GUIAction.EDIT_EXAM_SETTINGS) || isExamSupporter(exam))"
