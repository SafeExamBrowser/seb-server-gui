import i18n from "@/i18n";

/**
 * Checks if a is alphabetically before b
 */
const isAlphabeticallyBefore = (a: string, b: string) => {
    if (a === "" || b === "") {
        // empty strings don't have an alphabetical order, so they can be on either side of the reference value
        return true;
    }

    return a.localeCompare(b) < 0;
};

export const alphabeticalBefore = (referenceValue: string, err?: string) => {
    return (v: string) =>
        isAlphabeticallyBefore(v, referenceValue) ||
        err ||
        i18n.global.t("general.validation.alphabeticalBefore", {
            referenceValue,
        });
};

export const alphabeticalAfter = (referenceValue: string, err?: string) => {
    return (v: string) =>
        isAlphabeticallyBefore(referenceValue, v) ||
        err ||
        i18n.global.t("general.validation.alphabeticalAfter", {
            referenceValue,
        });
};
