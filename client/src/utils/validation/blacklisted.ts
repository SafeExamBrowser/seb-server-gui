import i18n from "@/i18n";

export const blacklisted = (blacklistedValues: Set<string>, err?: string) => {
    const blacklistedValuesLowerCase = new Set(
        Array.from(blacklistedValues).map((v) => v.toLowerCase()),
    );

    const isBlacklisted = (v?: string) => {
        if (v === undefined) {
            return true;
        }

        return blacklistedValuesLowerCase.has(v.toLowerCase());
    };
    return (v?: string) =>
        !isBlacklisted(v) ||
        err ||
        i18n.global.t("general.validation.blacklisted", {
            values: Array.from(blacklistedValues).join(", "),
        });
};
