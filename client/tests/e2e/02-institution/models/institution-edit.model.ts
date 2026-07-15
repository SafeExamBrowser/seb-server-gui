import { type Page } from "@playwright/test";
import {
    FormPageModel,
    type FormFieldSpec,
} from "../../shared/page-models/model-pages/form-page.model";
import { INSTITUTION_FIELD } from "./institution-create.model";

export const EDIT_INSTITUTION_ID = 9999;

const PREFIX = "editInstitution";
const FORM = `${PREFIX}-form`;

const fields: FormFieldSpec[] = [
    { name: INSTITUTION_FIELD.name, type: "text", formTestId: FORM },
    { name: INSTITUTION_FIELD.urlSuffix, type: "text", formTestId: FORM },
];

export const institutionByIdRequest = (id: string | number) =>
    new RegExp(`/api/admin-api/v1/institution/${id}(?:$|\\?)`, "i");

export const INSTITUTION_SAVE_REQUEST =
    /\/api\/admin-api\/v1\/institution(?:$|\?)/i;

export class InstitutionEditModel extends FormPageModel {
    constructor(page: Page, id: string | number = EDIT_INSTITUTION_ID) {
        super(page, {
            route: `/institution/${id}`,
            testPrefix: PREFIX,
            fields,
        });
    }
}
