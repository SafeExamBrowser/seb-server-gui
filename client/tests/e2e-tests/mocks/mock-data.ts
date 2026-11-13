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
    {
        id: 38,
        institutionId: 2,
        name: "CH_2026HS_BYOD Exam Template",
        description: "SEB Mac: Version (3.7.1)\nSEB Win: Version (3.10.3)",
        examType: "BYOD",
        supporter: [
            "6a80ea82-e5b5-4813-8516-3f587aba2f07",
            "b12310a0-2dcc-46a9-ada7-004e9f75b3d3",
        ],
        configurationTemplateId: 669,
        institutionalDefault: false,
        lmsIntegration: true,
        clientConfigurationId: 9,
        indicatorTemplates: [
            {
                id: 0,
                examTemplateId: 38,
                name: "Battery Status",
                type: "BATTERY_STATUS",
                tags: "",
                thresholds: [
                    { value: 20.0, color: "ffffff" },
                    { value: 10.0, color: "ffc20e" },
                    { value: 0.0, color: "ed1c24" },
                ],
            },
        ],
        CLIENT_GROUP_TEMPLATES: [],
        EXAM_ATTRIBUTES: {
            spsCollectingStrategy: "APPLY_SEB_GROUPS",
            spsCollectingGroupName: "Screen Proctoring",
            enableScreenProctoring: "true",
        },
    },
];

export const EXAM_TEMPLATE_1 = {
    id: 38,
    institutionId: 2,
    name: "CH_2026HS_BYOD Exam Template",
    description: "SEB Mac: Version (3.7.1)\nSEB Win: Version (3.10.3)",
    examType: "BYOD",
    supporter: [
        "6a80ea82-e5b5-4813-8516-3f587aba2f07",
        "b12310a0-2dcc-46a9-ada7-004e9f75b3d3",
    ],
    configurationTemplateId: 669,
    institutionalDefault: false,
    lmsIntegration: true,
    clientConfigurationId: 9,
    indicatorTemplates: [
        {
            id: 0,
            examTemplateId: 38,
            name: "Battery Status",
            type: "BATTERY_STATUS" as const,
            tags: "",
            thresholds: [
                { value: 20.0, color: "ffffff" },
                { value: 10.0, color: "ffc20e" },
                { value: 0.0, color: "ed1c24" },
            ],
        },
    ],
    CLIENT_GROUP_TEMPLATES: [],
    EXAM_ATTRIBUTES: {
        spsCollectingStrategy: "APPLY_SEB_GROUPS",
        spsCollectingGroupName: "Screen Proctoring",
        enableScreenProctoring: "true",
    },
};

// The configuration template (SEB Settings) referenced by EXAM_TEMPLATE_1.configurationTemplateId.
export const EXAM_TEMPLATE_1_CONFIGURATION_NODE = {
    id: String(EXAM_TEMPLATE_1.configurationTemplateId),
    name: EXAM_TEMPLATE_1.name,
    lastUpdateTime: "2026-11-11T10:25:00.000Z",
    lastUpdateUserName: "jdoe (Doe John)",
};

// The connection configuration referenced by EXAM_TEMPLATE_1.clientConfigurationId.
// Kept out of CLIENT_CONFIGURATIONS so the connection-configuration list specs keep their row counts.
export const EXAM_TEMPLATE_1_CLIENT_CONFIGURATION = {
    ...CLIENT_CONFIGURATIONS[0],
    id: EXAM_TEMPLATE_1.clientConfigurationId,
    institutionId: EXAM_TEMPLATE_1.institutionId,
    name: "BYOD Connection Configuration",
};

// The temporary configuration template (SEB Settings) the exam-template wizard creates in step 2.
export const CREATED_CONFIGURATION_TEMPLATE = {
    id: 9301,
    institutionId: 11,
    name: "e2e-temporary-config-template",
    type: "TEMPLATE",
    status: "CONSTRUCTION",
    lastUpdateTime: "2026-11-12T09:00:00.000Z",
    lastUpdateUserName: "testmain (Main Test)",
};

// SEB settings single values of the temporary configuration template. Every view returns all
// of them; the tabs only read the names they know. Unlisted settings read as false / empty.
export const CREATED_CONFIGURATION_TEMPLATE_SETTINGS = [
    { id: 93011, name: "allowQuit", value: "true" },
    { id: 93012, name: "allowPreferencesWindow", value: "false" },
    { id: 93013, name: "mobileAllowQRCodeConfig", value: "false" },
];

// The id the mocked backend assigns to an exam template created via the wizard.
export const CREATED_EXAM_TEMPLATE_ID = 9401;

export const SUPERVISORS = [
    {
        modelId: "b12310a0-2dcc-46a9-ada7-004e9f75b3d3",
        entityType: "USER",
        name: "jdoe (Doe John)",
    },
    {
        modelId: "8e22e73a-1405-4456-a342-83ae0a599a6d",
        entityType: "USER",
        name: "msmith (Smith Maria)",
    },
    {
        modelId: "8ab1d0c7-7fd9-4250-806c-9878afa97769",
        entityType: "USER",
        name: "testuser1 (User Test)",
    },
    {
        modelId: "e2c70480-59c2-4c08-9317-155a6df18544",
        entityType: "USER",
        name: "ljohnson (Johnson Laura)",
    },
    {
        modelId: "3115eae2-22f4-4d8c-a5c6-39bcfabf846d",
        entityType: "USER",
        name: "pbrown (Brown Peter)",
    },
    {
        modelId: "4d7a0e94-db85-4b15-9e93-c36771688315",
        entityType: "USER",
        name: "twilson (Wilson Thomas)",
    },
    {
        modelId: "921206bc-0a15-4d43-9d1b-95b03881210f",
        entityType: "USER",
        name: "emiller (Miller Emma)",
    },
    {
        modelId: "fbf13ce8-c598-4803-90fb-dae187efe36c",
        entityType: "USER",
        name: "sdavis (Davis Sarah)",
    },
    {
        modelId: "af0f2600-7e14-4bd1-97d9-2e140ebbd5bd",
        entityType: "USER",
        name: "examsupporter (Supporter Exam)",
    },
    {
        modelId: "12654176-7f4f-4ace-b56d-bd7f3a619ea6",
        entityType: "USER",
        name: "dmoore (Moore Daniel)",
    },
    {
        modelId: "4c5606ce-a213-4757-83bf-a2314bf7cf80",
        entityType: "USER",
        name: "ktaylor (Taylor Kevin)",
    },
    {
        modelId: "b7853763-17d0-46ba-b765-0490f5a55624",
        entityType: "USER",
        name: "testuser2 (User Test)",
    },
    {
        modelId: "9a8176e6-6070-406c-b326-bb0220db17f9",
        entityType: "USER",
        name: "testuser3 (User Test)",
    },
    {
        modelId: "aded8501-bb5c-4392-837f-4d74cc526e01",
        entityType: "USER",
        name: "manderson (Anderson Mark)",
    },
    {
        modelId: "1983f100-bd4f-439c-a789-68649d5df0a7",
        entityType: "USER",
        name: "testuser4 (User Test)",
    },
    {
        modelId: "1c525e6d-5f02-4868-9d7d-c02d4c34a22b",
        entityType: "USER",
        name: "rthomas (Thomas Robert)",
    },
    {
        modelId: "5ddd41fc-3934-4197-9959-1ba04953ec14",
        entityType: "USER",
        name: "jjackson (Jackson James)",
    },
    {
        modelId: "ffc882dd-cd5d-4b60-ae0b-4a039c6a6d3d",
        entityType: "USER",
        name: "testuser5 (User Test)",
    },
    {
        modelId: "bed4eee3-734f-45b1-9e67-fea2b46c01a6",
        entityType: "USER",
        name: "cwhite (White Claire)",
    },
    {
        modelId: "6a80ea82-e5b5-4813-8516-3f587aba2f07",
        entityType: "USER",
        name: "bharris (Harris Benjamin)",
    },
    {
        modelId: "4988d410-31d4-4d25-be4b-2fabc6e5dc13",
        entityType: "USER",
        name: "admin (Admin Exam)",
    },
    {
        modelId: "3959adc6-2b0d-4c8e-a04c-218d5ea0607c",
        entityType: "USER",
        name: "examadmin (Admin Exam)",
    },
    {
        modelId: "c73ef894-4b55-441f-ace7-f09f1a46f663",
        entityType: "USER",
        name: "examadmin2 (Admin Exam)",
    },
    {
        modelId: "594c30cc-1750-4e5c-9bd8-dc67d003a9fb",
        entityType: "USER",
        name: "jmartin (Martin Julia)",
    },
    {
        modelId: "c81fbe31-32ec-471e-a3ef-bf307c8403a0",
        entityType: "USER",
        name: "bharris-testing (Harris Benjamin)",
    },
    {
        modelId: "f900dde6-90ed-4810-8ba8-00700f0cb2a5",
        entityType: "USER",
        name: "lclark (Clark Lisa)",
    },
    {
        modelId: "90b0031a-bd69-4eaf-8ca2-681ebd1b42d2",
        entityType: "USER",
        name: "testuser6 (User Test)",
    },
    {
        modelId: "9a5d6fce-6a3f-4460-8527-f853703874a9",
        entityType: "USER",
        name: "examsupervisor (Supervisor Exam)",
    },
    {
        modelId: "54934f14-93b1-4052-95bb-8aaafb791184",
        entityType: "USER",
        name: "institutionadmin (Admin Institution)",
    },
    {
        modelId: "83de26d5-192a-443d-8045-583e8e6110cc",
        entityType: "USER",
        name: "alewis (Lewis Anna)",
    },
    {
        modelId: "bf3b7bca-ef51-4fa4-8ca7-e6aebb399771",
        entityType: "USER",
        name: "nwalker (Walker Nathan)",
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
