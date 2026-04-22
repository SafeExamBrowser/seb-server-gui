export type RouteName =
    // Unregistered Routes
    | "LoginPage"
    | "RegisterPage"

    // Default Pages
    | "HomePage"
    | "NavigationOverview"

    //Exams
    | "ExamDetail"
    | "ExamTemplateList"
    | "CreateExamTemplateWizard"
    | "ExamTemplateDetail"

    //Quiz
    | "QuizImport"

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
    | "MonitoringOverview"
    | "MonitoringClients";

export const getRouteName = (name: RouteName): RouteName => name;
