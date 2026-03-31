export type RouteName =
    | "ExamTemplateList"
    | "CreateExamTemplateWizard"

    //User Accounts
    | "CreateUserAccount";

export const getRouteName = (name: RouteName): RouteName => name;
