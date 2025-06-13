import * as userAccountService from "@/services/seb-server/api-services/userAccountService";
import { useUserAccountStore } from "@/stores/authentication/authenticationStore";
import * as institutionService from "@/services/seb-server/api-services/institutionService";

export async function setPersonalUserAccount(){
    const userAccountStore = useUserAccountStore();

    try{
        if(userAccountStore.userAccount != null){
            return;
        }

        const personalUserAccountResonse: UserAccount | null = await userAccountService.getPersonalUserAccount();
        if(personalUserAccountResonse == null){
            return;
        }

        userAccountStore.userAccount = personalUserAccountResonse;
        userAccountStore.setUserTimeZone(userAccountStore.userAccount.timezone);

    }catch(error){
        return null;
    }

}

export async function getPersonalUserAccount(): Promise<UserAccount | null>{
    try{
        return await userAccountService.getPersonalUserAccount();

    }catch(error){
        return null;
    }

}

//=============api==================
export async function getUserAccountById(accountId: string): Promise<UserAccount | null>{
    try{
        return await userAccountService.getUserAccountById(accountId)

    }catch(error){
        return null;
    }
}

export async function getUserAccounts(optionalParameters?: OptionalParGetUserAccounts): Promise<UserAccountResponse | null>{
    try{
        return await userAccountService.getUserAccounts(optionalParameters)

    }catch(error){
        return null;
    }
}


export async function createUserAccount(createUserAccountReqPar: CreateUserPar): Promise<SingleUserAccountResponse | null>{
    try{
        return await userAccountService.createUserAccount(createUserAccountReqPar)

    }catch(error){
        return null;
    }
}

export async function editUserAccount(userAccountPar: EditUserAccountParameters): Promise<SingleUserAccountResponse | null>{
    try{
        return await userAccountService.editUserAccount(userAccountPar)

    }catch(error){
        return null;
    }
}
export async function getInstitutions(): Promise<Institution[] | null>{
    try{
        return await institutionService.getInstitutions()

    }catch(error){
        return null;
    }
}

export async function getUserAccountNames(optionalParameters?: OptionalParInstitutionId): Promise<UserAccountName[] | null>{
    try{
        return await userAccountService.getUserAccountNames(optionalParameters)

    }catch(error){
        return null;
    }
}

export async function getSupervisorNames(optionalParameters?: OptionalParInstitutionId): Promise<UserAccountName[] | null>{
    try{
        return await userAccountService.getSupervisorNames(optionalParameters)

    }catch(error){
        return null;
    }
}

export async function activateUserAccount(accountId: string): Promise<UserAccount | null>{
    try{
        return await userAccountService.activateUserAccount(accountId)

    }catch(error){
        return null;
    }
}

export async function deactivateUserAccount(accountId: string): Promise<UserAccount | null>{
    try{
        return await userAccountService.deactivateUserAccount(accountId)

    }catch(error){
        return null;
    }
}


export async function deleteUserAccount(accountId: string): Promise<any | null>{
    try{
        return await userAccountService.deleteUserAccount(accountId)
    }catch(error){
        return null;
    }
}

export async function changePassword(uuid: string, password: string, newPassword: string, confirmNewPassword: string): Promise<UserAccount[] | null>{
  try{
        return await userAccountService.changePassword(uuid, password, newPassword, confirmNewPassword)

  }catch(error){
      return null;
  }
}
//==============================

// export function disableEnableActionItem(action: string): boolean{
//     const userAccountStore.ts = useUserAccountStore();

//     if(!userAccountStore.ts.userAccount?.userRoles.includes('ADMIN')){
//         return false;
//     }

//     if(action == "add"){
//         return false;
//     }

//     return !userAccountStore.ts.isAccountSelected;
// }
