import {
    SEBSettingsValue,
    SEBSettingAttribute,
    SEBSettingsTableRowValues,
    SEBSettingTableValue,
} from "@/models/seb-server/sebSettings";
import { Ref } from "vue";

export type SEBValueAttributes = {
    title: string;
    value: string;
};

// Context used for SEB Settings panel component
export type SEBSettingsContext = {
    isExam: boolean; // indicates if the SEB Settings are for an Exam (or an ExamTemplate)
    containerId: string; // entity id (either examID or examTemplateID)
    readonly: boolean; // readonly flag
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

    addTableRow(name: string): Promise<SEBSettingsTableRowValues | null>;
    deleteTableRow(
        name: string,
        index: number,
    ): Promise<SEBSettingsTableRowValues[] | null>;
    saveTableRow(values: SEBSettingTableValue[]): void;
};

// SEB Settings table model to use with SEB Settings tables.
export type SettingsTable<T> = {
    table: Ref<T[]>;
    selectedRow: Ref<T | null>;
    dialog: Ref<boolean>;

    editRow: (index: number) => void;
    newRow: () => void;
    deleteRow: (index: number) => void;
    closeDialog: (apply?: boolean) => void;
};
