import * as assessmentToolService from "@/services/seb-server/api-services/assessmentToolService";

export async function getAssessmentToolsActive(): Promise<AssessmentToolsResponse | null> {
    try {
        return await assessmentToolService.getAssessmentToolsActive();
    } catch (error) {
        return null;
    }
}

export async function getAssessmentTool(
    id: number,
): Promise<AssessmentTool | null> {
    try {
        return await assessmentToolService.getAssessmentTool(id);
    } catch (error) {
        return null;
    }
}

export async function getAssessmentTools(
    optionalParameters?: OptionalParGetAssessmentTool,
): Promise<AssessmentToolsResponse | null> {
    try {
        return await assessmentToolService.getAssessmentTools(
            optionalParameters,
        );
    } catch (error) {
        return null;
    }
}

export async function activateAssessmentTool(
    assessmentToolId: string,
): Promise<AssessmentTool | null> {
    try {
        return await assessmentToolService.activateAssessmentTool(
            assessmentToolId,
        );
    } catch (error) {
        return null;
    }
}

export async function deactivateAssessmentTool(
    assessmentToolId: string,
): Promise<AssessmentTool | null> {
    try {
        return await assessmentToolService.deactivateAssessmentTool(
            assessmentToolId,
        );
    } catch (error) {
        return null;
    }
}

export async function deleteAssessmentTool(
    assessmentToolId: string,
): Promise<any | null> {
    try {
        return await assessmentToolService.deleteAssessmentTool(
            assessmentToolId,
        );
    } catch (error) {
        return null;
    }
}

export async function createAssessmentTool(
    createAssessmentToolReqPar: CreateAssessmentToolPar,
): Promise<any | null> {
    try {
        return await assessmentToolService.createAssessmentTool(
            createAssessmentToolReqPar,
        );
    } catch (error) {
        return null;
    }
}

export async function editAssessmentTool(
    assessmentToolPar: UpdateAssessmentToolPar,
): Promise<AssessmentTool | null> {
    try {
        return await assessmentToolService.editAssessmentTool(
            assessmentToolPar,
        );
    } catch (error) {
        return null;
    }
}
