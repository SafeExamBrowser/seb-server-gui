export type RouteName =
    | "HomePage"
    | "ExamDetail"
    | "ExamTemplateList"
    | "CreateExamTemplateWizard"
    | "ExamTemplateDetail"

    //User Accounts
    | "ProfileRoute"
    | "EditUserAccount"
    | "CreateUserAccount"
    | "UserAccountList"

    //Assessment Tools
    | "CreateAssessmentTool"
    | "AssessmentToolList"
    | "AssessmentToolDetailAndView"

    //Connection Configurations
    | "CreateConnectionConfiguration"
    | "ConnectionConfigurationList"
    | "ConnectionConfigurationDetailAndView"

    //Certificates
    | "CreateCertificate"
    | "CertificatesList"

    //Exams
    | "ExamList"

    //Monitoring
    | "MonitoringList"
    | "MonitoringOverview";

export const getRouteName = (name: RouteName): RouteName => name;
