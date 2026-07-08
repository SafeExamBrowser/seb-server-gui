import { type Page } from "@playwright/test";
import {
    FormPageModel,
    type FormFieldSpec,
} from "../../shared/page-models/model-pages/form-page.model";

export const INSTITUTION_FIELD = {
    name: "name",
    urlSuffix: "urlSuffix",
} as const;

const PREFIX = "createInstitution";
const FORM = `${PREFIX}-form`;

const fields: FormFieldSpec[] = [
    { name: INSTITUTION_FIELD.name, type: "text", formTestId: FORM },
    { name: INSTITUTION_FIELD.urlSuffix, type: "text", formTestId: FORM },
];

export type InstitutionCreateInput = {
    name: string;
    urlSuffix: string;
};

export const INSTITUTION_CREATE_REQUEST = /\/institution(?:$|\?)/i;

export class InstitutionCreateModel extends FormPageModel {
    constructor(page: Page) {
        super(page, {
            route: "/institution/create",
            testPrefix: PREFIX,
            fields,
        });
    }

    async fillForm(input: InstitutionCreateInput) {
        await this.fill({
            [INSTITUTION_FIELD.name]: input.name,
            [INSTITUTION_FIELD.urlSuffix]: input.urlSuffix,
        });
    }
}
