// All hardcoded fixture data for the mocked SEB Server backend.
// The request-handling logic lives in mockBackend.ts.

export const MOCK_USERNAME = "testmain";
export const MOCK_PASSWORD = "testmain";

export const TOKEN_RESPONSE = {
    access_token: "e2e-mock-access-token",
    refresh_token: "e2e-mock-refresh-token",
    // seconds; large enough that no token refresh fires mid-test
    expires_in: 3600,
};

export const MOCK_CURRENT_USER = {
    uuid: "test-main",
    institutionId: 11,
    creationDate: "2019-01-01T00:00:00.000Z",
    name: "Test",
    surname: "Main",
    username: MOCK_USERNAME,
    email: "test-main@main.nomail",
    active: true,
    directLogin: true,
    localAccount: true,
    language: "en",
    timezone: "UTC",
    userRoles: [
        "SEB_SERVER_ADMIN",
        "INSTITUTIONAL_ADMIN",
        "EXAM_ADMIN",
        "EXAM_SUPPORTER",
        "TEACHER",
    ],
};

export const GUI_ABILITIES = {
    components: [
        "NAVIGATION_OVERVIEW",
        "HOME",
        "SETTINGS",
        "INSTITUTIONS",
        "EDIT_INSTITUTION",
        "CREATE_INSTITUTION",
        "USER_ACCOUNTS",
        "EDIT_USER_ACCOUNT",
        "CREATE_USER_ACCOUNT",
        "CONNECTION_CONFIGURATIONS",
        "EDIT_CONNECTION_CONFIGURATION",
        "CREATE_CONNECTION_CONFIGURATION",
        "ASSESSMENT_TOOLS",
        "EDIT_ASSESSMENT_TOOL",
        "CREATE_ASSESSMENT_TOOL",
        "CERTIFICATES",
        "EXAM_TEMPLATES",
        "CREATE_EXAM_TEMPLATE",
        "EXAM_TEMPLATE_DETAIL",
        "EXAMS",
        "ADD_EXAM_WITH_URL",
        "CREATE_EXAM_WIZARD",
        "EXAM_DETAIL",
        "PROFILE",
        "MONITORING",
        "MONITORING_DETAIL",
        "MONITORING_CLIENTS",
        "MONITORING_CLIENT_DETAIL",
        "SCREEN_PROCTORING_APPLICATION_SEARCH",
        "GALLERY",
        "SCREEN_PROCTORING_RECORDING",
        "SCREEN_PROCTORING_SEARCH",
        "ANALYZE_EXAMS",
        "ARCHIVE_EXAMS",
        "SCHEDULED_DELETIONS",
        "CREATE_SCHEDULED_DELETION",
        "SCHEDULED_DELETION_REPORT",
    ],
    actions: [
        "SHOW_INSTITUTION_COLUMN",
        "OFFER_SERVER_ADMIN_ROLE",
        "CHOOSE_INSTITUTION",
        "EXCLUDE_FROM_DELETION",
        "EDIT_FULL_SEB_SETTINGS",
        "EDIT_RESTRICTED_SEB_SETTINGS",
        "EDIT_BASIC_SETTINGS",
        "EDIT_SCREEN_PROCTORING",
        "SHOW_SEB_KEYS",
        "EDIT_SUPERVISORS",
        "EDIT_CLIENT_GROUPS",
        "APPLY_DISABLE_TEST_RUN",
        "APPLY_SEB_LOCK",
        "DOWNLOAD_EXAM_CONNECTION",
        "DELETE_EXAM",
        "EDIT_PROFILE_FIELDS",
        "CHANGE_OWN_PASSWORD",
        "QUIT_ALL_CLIENTS",
        "QUIT_CLIENTS",
        "EDIT_INDICATORS",
        "SHOW_FINISHED_EXAM_DATA",
    ],
};

// Mirrors the seb-server e2e Flyway seed (V200): institutions 11-13.
export const INSTITUTIONS = [
    { id: 11, name: "SEB Server", active: true },
    { id: 12, name: "Test Institution", active: false },
    { id: 13, name: "ETHZ", active: true },
];

export const INSTITUTION_NAMES = INSTITUTIONS.map((institution) => ({
    modelId: String(institution.id),
    name: institution.name,
}));

// Mirrors the V240 assessment-tool seed rows the 05 specs reference.
export const LMS_SETUPS = [true, false, false, false, false, true].map(
    (active, index) => ({
        id: 9101 + index,
        institutionId: 11,
        name: `e2e-getall-assessment-tool-${String(index + 1).padStart(2, "0")}`,
        lmsType: "MOCKUP",
        lmsUrl: "https://mockup.example",
        lmsClientname: "mockup-client",
        lmsClientsecret: "",
        lmsRestApiToken: "e2e-rest-api-token",
        active,
        updateTime: 0,
        connectionId: `e2e-conn-${9101 + index}`,
        integrationActive: false,
    }),
);

// Mirrors the V230 connection-configuration seed rows (ids 9001-9006).
export const CLIENT_CONFIGURATIONS = [true, false, true, true, true, true].map(
    (active, index) => ({
        id: 9001 + index,
        institutionId: 11,
        name: `e2e-getall-connection-config-${String(index + 1).padStart(2, "0")}`,
        sebConfigPurpose: "START_EXAM",
        sebServerPingTime: 1000,
        vdiSetup: "NO",
        sebServerFallback: false,
        date: "2026-06-30T08:21:13.000Z",
        cert_encryption_asym: false,
        active,
        lastUpdateTime: "2026-03-09T15:39:26.921Z",
        lastUpdateUser: "test-main",
        exam_selection: [],
    }),
);

// No spec reads exam templates directly; they exist so the exam-wizard
// prerequisite is satisfied and the Exams list "Prepare" button stays enabled.
// (Only used by the currently commented-out /exam-template/names route.)
export const EXAM_TEMPLATE_NAMES = [9201, 9202].map((id) => ({
    modelId: String(id),
    entityType: "EXAM_TEMPLATE",
    name: `e2e-exam-template-${id}`,
}));

export const EXAM_TEMPLATES = [
    {
        id: 7,
        institutionId: 11,
        name: "NadimTest1",
        description: "test",
        examType: "BYOD",
        supporter: ["test-main"],
        configurationTemplateId: 16,
        institutionalDefault: false,
        lmsIntegration: true,
        clientConfigurationId: 1001,
        indicatorTemplates: [],
        CLIENT_GROUP_TEMPLATES: [],
        EXAM_ATTRIBUTES: {
            spsCollectingStrategy: "APPLY_SEB_GROUPS",
            spsCollectingGroupName: "Fallback Group",
            enableScreenProctoring: "true",
            spsSEBGroupsSelection: "",
        },
    },
    {
        id: 6,
        institutionId: 11,
        name: "NadimTest12341234",
        description: "test",
        examType: "MANAGED",
        supporter: ["test-main"],
        configurationTemplateId: 14,
        institutionalDefault: false,
        lmsIntegration: true,
        clientConfigurationId: 1001,
        indicatorTemplates: [],
        CLIENT_GROUP_TEMPLATES: [],
        EXAM_ATTRIBUTES: {
            spsCollectingStrategy: "APPLY_SEB_GROUPS",
            spsCollectingGroupName: "Fallback Group",
            enableScreenProctoring: "true",
            spsSEBGroupsSelection: "",
        },
    },
    {
        id: 8,
        institutionId: 11,
        name: "NadimTest2",
        description: "test",
        examType: "VDI",
        supporter: ["test-main"],
        configurationTemplateId: 18,
        institutionalDefault: false,
        lmsIntegration: true,
        clientConfigurationId: 1001,
        indicatorTemplates: [],
        CLIENT_GROUP_TEMPLATES: [],
        EXAM_ATTRIBUTES: {
            spsCollectingStrategy: "APPLY_SEB_GROUPS",
            spsCollectingGroupName: "Fallback Group",
            enableScreenProctoring: "true",
            spsSEBGroupsSelection: "",
        },
    },
    {
        id: 9,
        institutionId: 11,
        name: "NadimTest3",
        description: "test",
        examType: "UNDEFINED",
        supporter: ["test-main"],
        configurationTemplateId: 20,
        institutionalDefault: false,
        lmsIntegration: true,
        clientConfigurationId: 1001,
        indicatorTemplates: [],
        CLIENT_GROUP_TEMPLATES: [],
        EXAM_ATTRIBUTES: {
            spsCollectingStrategy: "APPLY_SEB_GROUPS",
            spsCollectingGroupName: "Fallback Group",
            enableScreenProctoring: "true",
            spsSEBGroupsSelection: "",
        },
    },
    {
        id: 10,
        institutionId: 11,
        name: "NadimTest4",
        description: "test",
        examType: "BYOD",
        supporter: ["test-main"],
        configurationTemplateId: 22,
        institutionalDefault: false,
        lmsIntegration: true,
        clientConfigurationId: 1001,
        indicatorTemplates: [],
        CLIENT_GROUP_TEMPLATES: [],
        EXAM_ATTRIBUTES: {
            spsCollectingStrategy: "APPLY_SEB_GROUPS",
            spsCollectingGroupName: "Fallback Group",
            enableScreenProctoring: "true",
            spsSEBGroupsSelection: "",
        },
    },
    {
        id: 11,
        institutionId: 11,
        name: "NadimTest5",
        description: "test",
        examType: "BYOD",
        supporter: ["test-main"],
        configurationTemplateId: 25,
        institutionalDefault: true,
        lmsIntegration: true,
        clientConfigurationId: 1001,
        indicatorTemplates: [],
        CLIENT_GROUP_TEMPLATES: [],
        EXAM_ATTRIBUTES: {
            spsCollectingStrategy: "APPLY_SEB_GROUPS",
            spsCollectingGroupName: "Fallback Group",
            enableScreenProctoring: "true",
            spsSEBGroupsSelection: "",
        },
    },
    {
        id: 2,
        institutionId: 11,
        name: "test",
        description: "test",
        examType: "MANAGED",
        supporter: ["create-tests"],
        configurationTemplateId: 2,
        institutionalDefault: false,
        lmsIntegration: false,
        clientConfigurationId: 1005,
        indicatorTemplates: [],
        CLIENT_GROUP_TEMPLATES: [],
        EXAM_ATTRIBUTES: {
            spsCollectingStrategy: "APPLY_SEB_GROUPS",
            enableScreenProctoring: "false",
        },
    },
    {
        id: 1,
        institutionId: 11,
        name: "test template nadim",
        examType: "MANAGED",
        supporter: ["test-main"],
        configurationTemplateId: 1,
        institutionalDefault: false,
        lmsIntegration: false,
        clientConfigurationId: 1001,
        indicatorTemplates: [],
        CLIENT_GROUP_TEMPLATES: [],
        EXAM_ATTRIBUTES: {
            spsCollectingStrategy: "APPLY_SEB_GROUPS",
            enableScreenProctoring: "false",
        },
    },
    {
        id: 3,
        institutionId: 11,
        name: "test12341234",
        description: "test",
        examType: "BYOD",
        supporter: ["test-main"],
        configurationTemplateId: 10,
        institutionalDefault: false,
        lmsIntegration: true,
        clientConfigurationId: 1001,
        indicatorTemplates: [],
        CLIENT_GROUP_TEMPLATES: [],
        EXAM_ATTRIBUTES: {
            spsCollectingStrategy: "APPLY_SEB_GROUPS",
            spsCollectingGroupName: "Fallback Group",
            enableScreenProctoring: "true",
            spsSEBGroupsSelection: "",
        },
    },
    {
        id: 5,
        institutionId: 11,
        name: "testNew123",
        description: "test",
        examType: "BYOD",
        supporter: ["test-main"],
        configurationTemplateId: 12,
        institutionalDefault: false,
        lmsIntegration: true,
        clientConfigurationId: 1001,
        indicatorTemplates: [],
        CLIENT_GROUP_TEMPLATES: [],
        EXAM_ATTRIBUTES: {
            spsCollectingStrategy: "APPLY_SEB_GROUPS",
            spsCollectingGroupName: "Fallback Group",
            enableScreenProctoring: "true",
            spsSEBGroupsSelection: "",
        },
    },
];

// Mirrors the V200 per-browser user rows plus fillers so the paging and
// items-per-page steps of the read template have something to page over.
export function userAccountRows(browser: string) {
    const getAll = (kind: "active" | "inactive") => ({
        uuid: `seb-user-account-getall-${kind}-${browser}`,
        institutionId: 11,
        creationDate: "2019-01-01T00:00:00.000Z",
        name: "Institutional",
        surname: `000-testgetall-${browser}`,
        username: `getall-${kind}-${browser}`,
        email: `getall-${kind}-${browser}@nomail.nomail`,
        active: kind === "active",
        directLogin: true,
        localAccount: true,
        language: "en",
        timezone: "UTC",
        userRoles: ["EXAM_SUPPORTER"],
    });

    const fillers = Array.from({ length: 10 }, (_, i) => {
        const n = String(i + 1).padStart(2, "0");
        return {
            uuid: `seb-user-filler-${n}`,
            institutionId: 11,
            creationDate: "2019-01-01T00:00:00.000Z",
            name: "Filler",
            surname: `zzz-filler-${n}`,
            username: `filler-${n}`,
            email: `filler-${n}@nomail.nomail`,
            active: true,
            directLogin: true,
            localAccount: true,
            language: "en",
            timezone: "UTC",
            userRoles: ["EXAM_SUPPORTER"],
        };
    });

    return [
        MOCK_CURRENT_USER,
        getAll("active"),
        getAll("inactive"),
        ...fillers,
    ];
}

// e2e-authored fixture rows for the 06-exam/07-monitoring/08-analyze/09-archive
// specs (no upstream Flyway seed to mirror here: exam/monitoring/analyze/
// archive have no dedicated *ListConfig.ts and instead hit `/exam` and
// `/monitoring` directly, see examService.ts / monitoringService.ts).
export const EXAMS = [
    {
        id: 9201,
        institutionId: 11,
        quizName: "e2e-getall-exam-01",
        quizStartTime: "2026-01-10T08:00:00.000Z",
        quizEndTime: "2026-01-10T10:00:00.000Z",
        type: "BYOD",
        status: "UP_COMING",
        excludeFromDeletion: false,
    },
    {
        id: 9202,
        institutionId: 11,
        quizName: "e2e-getall-exam-02",
        quizStartTime: "2026-01-11T08:00:00.000Z",
        quizEndTime: "2026-01-11T10:00:00.000Z",
        type: "MANAGED",
        status: "TEST_RUN",
        excludeFromDeletion: false,
    },
    {
        id: 9203,
        institutionId: 11,
        quizName: "e2e-getall-exam-03",
        quizStartTime: "2026-01-12T08:00:00.000Z",
        quizEndTime: "2026-01-12T10:00:00.000Z",
        type: "VDI",
        status: "RUNNING",
        excludeFromDeletion: false,
    },
    {
        id: 9204,
        institutionId: 11,
        quizName: "e2e-getall-exam-04",
        quizStartTime: "2026-01-13T08:00:00.000Z",
        quizEndTime: "2026-01-13T10:00:00.000Z",
        type: "BYOD",
        status: "FINISHED",
        excludeFromDeletion: false,
        additionalAttributes: { enableScreenProctoring: "true" },
    },
    {
        id: 9205,
        institutionId: 11,
        quizName: "e2e-getall-exam-05",
        quizStartTime: "2026-01-14T08:00:00.000Z",
        quizEndTime: "2026-01-14T10:00:00.000Z",
        type: "MANAGED",
        status: "ARCHIVED",
        excludeFromDeletion: true,
    },
    {
        id: 9206,
        institutionId: 11,
        quizName: "e2e-getall-exam-06",
        quizStartTime: "2026-01-15T08:00:00.000Z",
        quizEndTime: "2026-01-15T10:00:00.000Z",
        type: "UNDEFINED",
        status: "FINISHED",
        excludeFromDeletion: false,
    },
];

// getExamsForAnalysis hits a dedicated `/monitoring/finishedexams` resource
// that only ever contains finished/archived exams, regardless of the
// `status` query param (which just narrows further within that set).
export const FINISHED_EXAMS = EXAMS.filter(
    (row) => row.status === "FINISHED" || row.status === "ARCHIVED",
);
