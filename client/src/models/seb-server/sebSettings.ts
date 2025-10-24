export type PermittedProcessArgument = {
    active: boolean;
    argument: string;
};

export type ExamConfigMapping = {
    id: number;
    examId: number;
    examName: string;
    examDescription: string;
    configurationNodeId: number;
    configName: string;
    configStatus: string;
};

export type PermittedProcess = {
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

export type ProhibitedProcess = {
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

export type SEBSettingsValue = {
    id: number;
    value: string;
};

export type SEBSettingsTableRowValues = {
    name: string;
    listIndex: number;
    rowValues: Map<string, SEBSettingsValue>;
};

export type SEBSettingAttribute = {
    id: number;
    parentId: number;
    name: string;
    type: string;
    resources: string;
    validator: string;
    dependencies: string;
    defaultValue: string;
};

export type SEBSettingsView = {
    viewType: string;
    configurationNodeId: number;
    configurationId: number;
    attributes: Map<string, SEBSettingAttribute>;
    singleValues: Map<string, SEBSettingsValue>;
    tableValues: Map<string, SEBSettingsTableRowValues[]>;
};

export type ApplicationView = {
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

export type URLFilterRule = {
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
