import {
    SEBSettingsValue,
    SEBSettingAttribute,
    SEBSettingsTableRowValues,
    SEBSettingTableValue,
} from "@/models/seb-server/sebSettings";

export type SEBSettingsContext = {
    isExam: boolean;
    containerId: string;
    readonly: boolean;
};

export type SEBValueAttributes = {
    title: string;
    value: string;
};

// Singe SEB Setting values model encapsulates single SEB Setting values with its current ids
// mapped by SEB Setting names and additional attributes also mapped to SEB Setting names.
// Also provides some value accessors and a persistent function to save the value to backend
export type SEBSettingsSingeValueModel = {
    singleValues: Map<string, SEBSettingsValue>;
    attributes: Map<string, SEBSettingAttribute>;

    getStringValue(name: string): string;
    getBooleanValue(name: string): boolean;
    getNumberValue(name: string): number;
    saveSingleValue(name: string, value: string): void;
    getAttributes(name: string, labels: string | null): SEBValueAttributes[];
};

// SEB Settings table model encapsulates table row values mapped by SEB Setting names
// and additional attributes also mapped to SEB Setting names.
// Also provides some row value accessors and a persistent function to save the value to backend
export type SEBSettingsTableModel = {
    tableValues: Map<string, SEBSettingsTableRowValues[]>;
    //attributes: Map<string, SEBSettingAttribute>;

    addTableRow(name: string): Promise<SEBSettingsTableRowValues | null>;
    deleteTableRow(
        name: string,
        index: number,
    ): Promise<SEBSettingsTableRowValues[] | null>;
    saveTableRow(values: SEBSettingTableValue[]): void;
};
