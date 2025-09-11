type PermittedProcessArgument = {
    active: boolean;
    argument: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExamConfigMapping = {
    id: number;
    examId: number;
    examName: string;
    examDescription: string;
    configurationNodeId: number;
    configName: string;
    configStatus: string;
};

type PermittedProcess = {
    index: number;
    active: boolean;
    os: string;
    executable: string;
    title: string;
    originalName: string;
    signature: string;
    path: string;
    iconInTaskbar: boolean;
    arguments: PermittedProcessArgument[];
    allowOpenAndSavePanel: boolean;
    autostart: boolean;
    allowShareSheet: boolean;
    runInBackground: boolean;
    allowManualStart: boolean;
    allowUserToChooseApp: boolean;
    allowNetworkAccess: boolean;
    strongKill: boolean;
    teamIdentifier: string;
    ids: {
        active: number;
        os: number;
        executable: number;
        title: number;
        originalName: number;
        signature: number;
        path: number;
        iconInTaskbar: number;
        arguments: number;
        allowOpenAndSavePanel: number;
        autostart: number;
        allowShareSheet: number;
        runInBackground: number;
        allowManualStart: number;
        allowUserToChooseApp: number;
        allowNetworkAccess: number;
        strongKill: number;
        teamIdentifier: number;
    };
};

type ProhibitedProcess = {
    index: number;
    active: boolean;
    os: string;
    executable: string;
    originalName: string;
    description: string;
    identifier: string;
    strongKill: boolean;
    ignoreInAAC: boolean;
    ids: {
        active: number;
        os: number;
        executable: number;
        originalName: number;
        description: number;
        identifier: number;
        strongKill: number;
        ignoreInAAC: number;
    };
};

type SEBSettingsValue = {
    id: number;
    value: string;
};

type SEBSettingsTableRowValues = {
    name: string;
    listIndex: number;
    rowValues: Map<string, SEBSettingsValue>;
};

type SEBSettingAttribute = {
    id: number;
    parentId: number;
    name: string;
    type: string;
    resources: string;
    validator: string;
    dependencies: string;
    defaultValue: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SEBSettingsView = {
    viewType: string;
    configurationNodeId: number;
    configurationId: number;
    attributes: Map<string, SEBSettingAttribute>;
    singleValues: Map<string, SEBSettingsValue>;
    tableValues: Map<string, SEBSettingsTableRowValues[]>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ApplicationView = {
    configurationNodeId: number;
    configurationId: number;
    allowSwitchToApplications: {
        id: number;
        value: string;
    };
    allowFlashFullscreen: {
        id: number;
        value: string;
    };
    prohibitedProcesses: ProhibitedProcess[];
    permittedProcesses: PermittedProcess[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type URLFilterRule = {
    index: number;
    active: boolean;
    regex: boolean;
    expression: string;
    action: string;
    ids: {
        active: number;
        regex: number;
        expression: number;
        action: number;
    };
};
