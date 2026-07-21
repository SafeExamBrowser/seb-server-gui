import ipaddr from "ipaddr.js";

import i18n from "@/i18n";

export const ipAddress = (err?: string) => {
    return (value: string) =>
        ipaddr.isValid(value) ||
        err ||
        i18n.global.t("general.validation.ipAddress");
};
