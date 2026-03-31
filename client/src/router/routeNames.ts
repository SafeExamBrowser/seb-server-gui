export type RouteName =
    | "ExamTemplateList"
    | "CreateExamTemplateWizard"
    | "ExamTemplateDetail";

export const getRouteName = (name: RouteName): RouteName => name;
