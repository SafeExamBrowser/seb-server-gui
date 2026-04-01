export type RouteName =
    | "ExamTemplateList"
    | "CreateExamTemplateWizard"
    | "ExamTemplateDetail"
    | "CreateUserAccount";
export const getRouteName = (name: RouteName): RouteName => name;
