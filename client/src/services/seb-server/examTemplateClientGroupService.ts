import * as apiService from "@/services/apiService";
import {
    ClientGroup,
    ClientGroupExisting,
    clientGroupExistingSchema,
} from "@/models/seb-server/examTemplate.ts";

const baseUrl = "/exam-template" as const;

export const createClientGroup = async (
    examTemplateId: number,
    group: ClientGroup,
): Promise<ClientGroupExisting> => {
    const response = await apiService.postRequest({
        url: `${baseUrl}/client-group`,
        data: { ...group, examTemplateId },
        options: { _authType: "seb" },
    });

    return clientGroupExistingSchema.parse(response.data);
};

export const updateClientGroup = async (
    examTemplateId: number,
    group: ClientGroupExisting,
): Promise<ClientGroupExisting> => {
    const response = await apiService.putRequest({
        url: `${baseUrl}/client-group`,
        data: { ...group, examTemplateId },
        options: { _authType: "seb" },
    });

    return clientGroupExistingSchema.parse(response.data);
};

export const deleteClientGroup = async (
    examTemplateId: number,
    clientGroupId: number,
): Promise<void> => {
    await apiService.deleteRequest({
        url: `${baseUrl}/${examTemplateId}/client-group/${clientGroupId}`,
        options: { _authType: "seb" },
    });
};
