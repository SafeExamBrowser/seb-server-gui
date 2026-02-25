export enum CertificateTypeEnum {
    UNKNOWN = "UNKNOWN",
    DIGITAL_SIGNATURE = "DIGITAL_SIGNATURE",
    DATA_ENCIPHERMENT = "DATA_ENCIPHERMENT",
    DATA_ENCIPHERMENT_PRIVATE_KEY = "DATA_ENCIPHERMENT_PRIVATE_KEY",
    KEY_CERT_SIGN = "KEY_CERT_SIGN",
}

export type Certificate = {
    alias: string;
    validityFrom: string;
    validityTo: string;
    certType: CertificateTypeEnum[];
};

export type CertificatesResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    complete: boolean;
    content: Certificate[];
};

export type OptionalParGetCertificates = {
    page_size?: number;
    page_number?: number;
    sort?: string;
    alias?: string;
};

export type CreateCertificatePar = {
    file: Blob;
    fileName: string;
    password?: string;
};
