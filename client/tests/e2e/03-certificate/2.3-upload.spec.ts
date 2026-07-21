import { expect, test } from "../shared/fixtures/table-list-fixtures";
import { waitForRequest } from "../utils/networkAssertions";
import {
    type CertificateRow,
    certificateRows,
} from "./models/certificates-list.model";

// The upload POST hits the bare collection path (no query params), unlike the list GET;
// registered after the list mock, this route wins the LIFO match for the mutations.
const CERTIFICATE_MUTATION_REQUEST = /\/admin-api\/v1\/certificate$/i;

const pemFile = {
    name: "e2e-upload-cert.pem",
    mimeType: "application/x-pem-file",
    buffer: Buffer.from("e2e-pem-file-bytes"),
};

const p12File = {
    name: "e2e-upload-keystore.p12",
    mimeType: "application/x-pkcs12",
    buffer: Buffer.from("e2e-p12-file-bytes"),
};

const uploadedRow = (alias: string): CertificateRow => ({
    alias,
    validityFrom: "2025-01-01T00:00:00Z",
    validityTo: "2027-01-01T00:00:00Z",
    certType: ["DIGITAL_SIGNATURE"],
});

test.describe("03 Certificates - UPLOAD", () => {
    test("A uploads the file bytes and shows the new certificate in the list", async ({
        certificates,
    }) => {
        const page = certificates.page;
        const alias = "e2e-uploaded-cert";
        const state = { rows: certificateRows(1) };

        await certificates.mockListFromState(state);
        await page.route(CERTIFICATE_MUTATION_REQUEST, (route) => {
            if (route.request().method() !== "POST") {
                return route.fallback();
            }
            state.rows = [...state.rows, uploadedRow(alias)];
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(uploadedRow(alias)),
            });
        });

        const uploadRequest = waitForRequest(
            page,
            "POST",
            CERTIFICATE_MUTATION_REQUEST,
        );

        await certificates.goto();
        await certificates.openUploadDialog();
        await certificates.uploadDialog.fill(pemFile);
        await certificates.uploadDialog.submit();

        await test.step("the request carries the raw file bytes and the file name header", async () => {
            const request = await uploadRequest;
            expect(request.postData()).toBe("e2e-pem-file-bytes");
            expect(request.headers()["importfile"]).toBe(pemFile.name);
            expect(request.headers()["importfilepassword"]).toBeUndefined();
        });

        await test.step("the dialog closes and the invalidated list shows the new row", async () => {
            await certificates.uploadDialog.expectHidden();
            await certificates.table.expectRowVisible(alias);
        });
    });

    test("B sends the keystore password as a header for PKCS12 uploads", async ({
        certificates,
    }) => {
        const page = certificates.page;
        const state = { rows: certificateRows(1) };

        await certificates.mockListFromState(state);
        await page.route(CERTIFICATE_MUTATION_REQUEST, (route) => {
            if (route.request().method() !== "POST") {
                return route.fallback();
            }
            return route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(uploadedRow("e2e-uploaded-keystore")),
            });
        });

        const uploadRequest = waitForRequest(
            page,
            "POST",
            CERTIFICATE_MUTATION_REQUEST,
        );

        await certificates.goto();
        await certificates.openUploadDialog();
        await certificates.uploadDialog.fill(p12File, "keystorePw1!");
        await certificates.uploadDialog.submit();

        const request = await uploadRequest;
        expect(request.headers()["importfile"]).toBe(p12File.name);
        expect(request.headers()["importfilepassword"]).toBe("keystorePw1!");
    });

    test("C a failed upload surfaces an error and adds no row", async ({
        certificates,
    }) => {
        const page = certificates.page;
        const alias = "e2e-uploaded-cert";
        const state = { rows: certificateRows(1) };

        await certificates.mockListFromState(state);
        await page.route(CERTIFICATE_MUTATION_REQUEST, (route) => {
            if (route.request().method() !== "POST") {
                return route.fallback();
            }
            return route.fulfill({
                status: 400,
                contentType: "application/json",
                body: JSON.stringify([
                    {
                        messageCode: "1010",
                        systemMessage: "Unsupported certificate type",
                        attributes: [],
                    },
                ]),
            });
        });

        await certificates.goto();
        await certificates.openUploadDialog();
        await certificates.uploadDialog.fill(pemFile);
        await certificates.uploadDialog.submit();

        await expect(
            page.locator(".v-snackbar__content").first(),
        ).toBeVisible();
        await certificates.table.expectRowAbsent(alias);
    });
});
