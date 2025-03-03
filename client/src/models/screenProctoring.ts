type ScreenProctoringSettings = {
    examId?: number;
    enableScreenProctoring?: boolean;
    spsServiceURL?: string;
    spsAPIKey?: string;
    spsAPISecret?: string;
    spsAccountId?: string;
    spsAccountPassword?: string; 
    collectingStrategy?: string;
    collectingGroupName?: string;
    collectingGroupSize?: number;
    sebGroupsSelection?: string;
    bundled?: boolean;
    confirmChangeStrategy?: boolean;
};