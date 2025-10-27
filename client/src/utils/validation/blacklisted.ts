import i18n from "@/i18n";

export const blacklisted = (blacklistedValues: Set<string>, err?: string) => {
    return (v: string) =>
        !blacklistedValues.has(v) ||
        err ||
        i18n.global.t("general.validation.blacklisted", {
            values: Array.from(blacklistedValues).join(", "),
        });
};
