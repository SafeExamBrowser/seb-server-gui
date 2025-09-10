enum CertificateTypeEnum {
    UNKNOWN = "UNKNOWN",
    DIGITAL_SIGNATURE = "DIGITAL_SIGNATURE",
    DATA_ENCIPHERMENT = "DATA_ENCIPHERMENT",
    DATA_ENCIPHERMENT_PRIVATE_KEY = "DATA_ENCIPHERMENT_PRIVATE_KEY",
    KEY_CERT_SIGN = "KEY_CERT_SIGN",
}

type Certificate = {
    alias: string;
    validityFrom: string;
    validityTo: string;
    certType: CertificateTypeEnum[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CertificatesResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    complete: boolean;
    content: Certificate[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type OptionalParGetCertificates = {
    page_size?: number;
    page_number?: number;
    sort?: string;
    alias?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CreateCertificatePar = {
    file: Blob;
    fileName: string;
    password?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CreateCertificateJSON = {
    fileBase64: string;
    fileName: string;
    password?: string;
};
