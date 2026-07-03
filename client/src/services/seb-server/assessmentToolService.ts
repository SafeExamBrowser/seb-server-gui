import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    activateLmsSetup as activateLmsSetupSdk,
    createLmsSetup as createLmsSetupSdk,
    deactivateLmsSetup as deactivateLmsSetupSdk,
    deleteLmsSetup as deleteLmsSetupSdk,
    editLmsSetup as editLmsSetupSdk,
    getLmsSetupById as getLmsSetupByIdSdk,
    getLmsSetups as getLmsSetupsSdk,
    testLms as testLmsSdk,
} from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import {
    assessmentToolCreateSchema,
    assessmentToolEditSchema,
    assessmentToolPageSchema,
    assessmentToolSchema,
    assessmentToolTestResultSchema,
    type AssessmentTool,
    type AssessmentToolCreateRequest,
    type AssessmentToolEditRequest,
    type AssessmentToolPage,
    type AssessmentToolTestResult,
} from "@/models/assessmentTool.ts";
import { decodeWire, encodeWire } from "@/services/errors/wireCodec.ts";
import { zEntityProcessingReport } from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import type {
    EntityProcessingReport,
    GetLmsSetupsData,
} from "@/api/seb-server/generated/hey-api/types.gen.ts";

export const getAssessmentTools = (
    query?: GetLmsSetupsData["query"],
): Promise<AssessmentToolPage> =>
    getLmsSetupsSdk({ client, query }).then(({ data }) =>
        decodeWire(assessmentToolPageSchema, data),
    );

export const getAssessmentToolById = (
    modelId: string,
): Promise<AssessmentTool> =>
    getLmsSetupByIdSdk({
        client,
        path: { modelId },
    }).then(({ data }) => decodeWire(assessmentToolSchema, data));

export const createAssessmentTool = (
    body: AssessmentToolCreateRequest,
): Promise<AssessmentTool> =>
    createLmsSetupSdk({
        client,
        body: encodeWire(assessmentToolCreateSchema, body),
    }).then(({ data }) => decodeWire(assessmentToolSchema, data));

export const editAssessmentTool = (
    body: AssessmentToolEditRequest,
): Promise<AssessmentTool> =>
    editLmsSetupSdk({
        client,
        body: encodeWire(assessmentToolEditSchema, body),
    }).then(({ data }) => decodeWire(assessmentToolSchema, data));

export const deleteAssessmentTool = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    deleteLmsSetupSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );

export const activateAssessmentTool = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    activateLmsSetupSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );

export const deactivateAssessmentTool = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    deactivateLmsSetupSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );

export const testAssessmentTool = (
    modelId: number,
): Promise<AssessmentToolTestResult> =>
    testLmsSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(assessmentToolTestResultSchema, data),
    );
