import { type Page } from "@playwright/test";
import { certificateListConfig } from "@/pages/(app)/certificate/certificateListConfig.ts";
import { TableListPageModel } from "../../shared/page-models/model-pages/table-list-page.model";
import type { TableListPageConfig } from "../../shared/types/table-list-page.types";

export type CertificateRow = {
    alias: string;
    validityFrom: string;
    validityTo: string;
    certType: string[];
};

const config: TableListPageConfig = {
    route: certificateListConfig.route,
    testIdBase: certificateListConfig.testIdBase,
    listRequest: {
        method: "GET",
        urlRegex: /\/api\/certificate(?:\?|$)/i,
        expectedStatuses: [200, 304],
    },
};

export class CertificatesListModel extends TableListPageModel {
    constructor(page: Page) {
        super(page, config);
    }

    // Certificates are stored as parsed keystore blobs, so the list is mocked:
    // GET /certificate is fulfilled with controlled rows while every other
    // method (e.g. the delete) falls through to the real backend.
    async mockList(content: CertificateRow[], opts: { pages?: number } = {}) {
        await this.page.route(/\/api\/certificate(?:\?|$)/i, async (route) => {
            if (route.request().method() !== "GET") {
                return route.continue();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    number_of_pages: opts.pages ?? 1,
                    page_number: 1,
                    page_size: 10,
                    complete: true,
                    content,
                }),
            });
        });
    }
}

export function certificateRows(count: number): CertificateRow[] {
    return Array.from({ length: count }, (_, i) => {
        const n = String(i + 1).padStart(2, "0");
        return {
            alias: `e2e-getall-cert-${n}`,
            validityFrom: "2024-01-01T00:00:00Z",
            validityTo: "2026-01-01T00:00:00Z",
            certType: ["DIGITAL_SIGNATURE"],
        };
    });
}
