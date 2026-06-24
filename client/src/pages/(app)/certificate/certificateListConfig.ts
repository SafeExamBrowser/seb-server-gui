export const CERTIFICATE_COLUMN = {
    alias: "alias",
    validityFrom: "validityFrom",
    validityTo: "validityTo",
    certType: "certType",
} as const;

export const certificateListConfig = {
    testIdBase: "certificates",
    route: "/certificate",
    itemKey: "alias",
} as const;
