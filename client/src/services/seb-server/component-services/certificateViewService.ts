import * as certificateService from "@/services/seb-server/api-services/certificateService";


export async function getCertificates(optionalParameters?: OptionalParGetCertificates): Promise<CertificatesResponse | null>{
    try{
        return await certificateService.getCertificates(optionalParameters);
    }catch(error){
        return null;
    }
}

export async function deleteCertificate(certificateId: string): Promise<any | null>{
    try{
        return await certificateService.deleteCertificate(certificateId)
    }catch(error){
        return null;
    }
}

export async function createCertificate(params: CreateCertificatePar) {
    try {
        const fileBase64 = await blobToBase64(params.file);
        return await certificateService.createCertificate({
            fileBase64,
            fileName: params.fileName,
            password: params.password,
        });
    } catch (e) {
        (e as any).__where = 'component-services.createCertificate';
        throw e;
    }
}

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.onload = () => {
            const result = String(reader.result ?? '');
            const comma = result.indexOf(',');
            resolve(comma >= 0 ? result.slice(comma + 1) : result);
        };
        reader.readAsDataURL(blob);
    });
}
