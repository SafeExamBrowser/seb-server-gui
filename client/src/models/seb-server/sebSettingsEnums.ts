export enum ViewType {
    APPLICATION = "APPLICATION",
    NETWORK = "NETWORK",
}

export enum SettingsType {
    /** Single read-only label */
    LABEL = "LABEL",
    /** Single lined text value */
    TEXT_FIELD = "TEXT_FIELD",
    /** Password (Base 16 encoded SHA256)
     * Displayed as two text input fields (confirm) */
    PASSWORD_FIELD = "PASSWORD_FIELD",
    /** Multiple lined text value */
    TEXT_AREA = "TEXT_AREA",
    /** An editable list if TEXT_FIELD inputs stored in a comma separated String value */
    TEXT_FIELD_LIST = "TEXT_FIELD_LIST",
    /** Check Box or boolean type */
    CHECKBOX = "CHECKBOX",
    SLIDER = "SLIDER",
    /** Integer number type */
    INTEGER = "INTEGER",
    /** Decimal number type */
    DECIMAL = "DECIMAL",
    /** Single selection type (Drop-down) */
    SINGLE_SELECTION = "SINGLE_SELECTION",
    COMBO_SELECTION = "COMBO_SELECTION",
    /** Radio selection type (like single selection but with check-boxes) */
    RADIO_SELECTION = "RADIO_SELECTION",
    /** Multiple selection type */
    MULTI_SELECTION = "MULTI_SELECTION",
    /** Multiple selection with checkbox type */
    MULTI_CHECKBOX_SELECTION = "MULTI_CHECKBOX_SELECTION",
    COLOR_SELECTOR = "COLOR_SELECTOR",
    FILE_UPLOAD = "FILE_UPLOAD",
    /** Table type is a list of a composite of single types */
    TABLE = "TABLE",
    INLINE_TABLE = "INLINE_TABLE",
    COMPOSITE_TABLE = "COMPOSITE_TABLE",
}

export enum ExamConfigStatus {
    CONSTRUCTION = "CONSTRUCTION",
    READY_TO_USE = "READY_TO_USE",
    IN_USE = "IN_USE",
    ARCHIVE = "ARCHIVE",
}
