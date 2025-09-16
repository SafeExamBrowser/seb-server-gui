import * as userAccountService from "@/services/seb-server/api-services/userAccountService";
import * as institutionService from "@/services/seb-server/api-services/institutionService";

export async function registerUserAccount(
    institutionId: string,
    name: string,
    surname: string,
    username: string,
    newPassword: string,
    confirmNewPassword: string,
    timezone: string,
    email?: string,
): Promise<UserAccount | null> {
    try {
        const language = navigator.language?.split("-")[0] || "gr";

        const payload: Record<string, string> = {
            institutionId,
            name,
            surname,
            username,
            newPassword,
            confirmNewPassword,
            timezone,
            language,
        };

        if (email) {
            payload.email = email;
        }

        return await userAccountService.registerUserAccount(payload);
    } catch {
        return null;
    }
}

export async function getInstitutions(): Promise<Institution[] | null> {
    try {
        return await institutionService.getInstitutions();
    } catch {
        return null;
    }
}
