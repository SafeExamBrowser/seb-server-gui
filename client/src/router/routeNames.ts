export type RouteName =
    | "ExamTemplateList"
    | "CreateExamTemplateWizard"
    | "ExamTemplateDetail"

    //User Accounts
    | "CreateUserAccount"
    | "UserAccountList"

    //Assessment Tools
    | "CreateAssessmentTool"
    | "AssessmentToolList"

    //Connection Configurations
    | "CreateConnectionConfiguration"
    | "ConnectionConfigurationList"

    //Certificates
    | "CreateCertificate"
    | "CertificatesList";

export const getRouteName = (name: RouteName): RouteName => name;
