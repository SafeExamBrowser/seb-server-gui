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

type ProhibitedProcesess = {
    index: number,
    active: string, 
    os: string, 
    executable: string, 
    description: string
};