import i18n from "@/i18n";

export const fileExtension = (allowedExtensions: string[]) => {
    const normalized = allowedExtensions.map((ext) =>
        ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`,
    );

    return (file?: File) => {
        if (allowedExtensions.length === 0 || !file) {
            return true;
        }

        const matches = normalized.some((ext) =>
            file.name.toLowerCase().endsWith(ext),
        );

        return (
            matches ||
            i18n.global.t("general.validation.fileExtensions", {
                extensions: normalized.join(", "),
            })
        );
    };
};
