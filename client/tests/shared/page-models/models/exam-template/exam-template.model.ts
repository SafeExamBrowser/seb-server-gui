import { expect, type Locator, type Page } from "@playwright/test";
import {
    type FormFieldSpec,
    FormPageModel,
} from "../../generic-models/form-page.model.ts";
import BasicPage from "@/components/layout/pages/BasicPage.vue";


const ROUTE = "/exam-template/:id";


export class ExamTemplateModel extends BasicPage{
    // constructor(page: Page) {}

    // async expectStepVisible(step: number) {
    //     await expect(
    //         this.page.getByTestId("exam-template-step" + step),
    //     ).toBeVisible();
    // }
}
