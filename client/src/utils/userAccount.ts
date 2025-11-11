import { UserAccountName } from "@/models/userAccount";

export const userAccountNameToUsername = (
    supervisor: UserAccountName,
): string => {
    const match = supervisor.name.match(/^(.+?) \(/);
    return match?.[1] ?? supervisor.name;
};

export const userAccountNameToFullName = (
    supervisor: UserAccountName,
): string => {
    const match = supervisor.name.match(/\((.*?)\)/);
    return match?.[1] ?? "";
};
