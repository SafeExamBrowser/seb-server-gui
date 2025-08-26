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

export async function createCertificate(createCertificatePar: CreateCertificatePar): Promise<any | null>{
    try{
        return await certificateService.createCertificate(createCertificatePar)

    }catch(error){
        return null;
    }
}
