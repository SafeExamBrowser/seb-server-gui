type SEBSettingsValue = {
    id: number,
    value: string,
};

type SEBSettingsTableRowValues = {
    name: string,
    listIndex: number,
    rowValues: Map<string, SEBSettingsValue>
};

type SEBSettingAttribute = {
    id: number,
    parentId: number,
    name: string,
    type: string,
    resources: string, 
    validator: string,
    dependencies: string,
    defaultValue: string
};

type SEBSettingsView = {
    viewType: string,
    configurationNodeId: number,
    configurationId: number,
    attributes: Map<string, SEBSettingAttribute>,
    singleValues: Map<string, SEBSettingsValue>,
    tableValues: Map<string, SEBSettingsTableRowValues[]>
};

type PermittedProcesessRow = {
    index: number,
    active: string, 
    os: string, 
    executable: string, 
    title: string
};

type PermittedProcesessArgument = {
    active: boolean,
    argument: string,
};

type PermittedProcesess = {
    index: number,
    active: boolean, 
    os: string, 
    executable: string, 
    title: string
    originalName: string,
    signature: string,
    path: string,
    iconInTaskbar: boolean,
    arguments: PermittedProcesessArgument[],
    allowOpenAndSavePanel: boolean,
    autostart: boolean,
    allowShareSheet: boolean,
    runInBackground: boolean,
    allowManualStart: boolean,
    allowUserToChooseApp: boolean,
    allowNetworkAccess: boolean,
    strongKill: boolean,
    teamIdentifier: string
};

type ProhibitedProcesessRow = {
    index: number,
    active: string, 
    os: string, 
    executable: string, 
    description: string
};

type ProhibitedProcesess = {
    index: number,
    active: boolean, 
    os: string, 
    executable: string,
    originalName: string,
    description: string
    identifier: string,
    strongKill: boolean,
    ignoreInAAC: boolean
};