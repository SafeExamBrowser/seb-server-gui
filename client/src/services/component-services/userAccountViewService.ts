import * as userAccountService from "@/services/api-services/userAccountService";
import { useUserAccountStore } from "@/stores/store";

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
        console.error(error);
        return null;
    }

}

export async function getPersonalUserAccount(): Promise<UserAccount | null>{
    try{
        return await userAccountService.getPersonalUserAccount();

    }catch(error){
        console.error(error);
        return null;
    }

}

//=============api==================
export async function getUserAccountById(accountId: string): Promise<UserAccount | null>{
    try{
        return await userAccountService.getUserAccountById(accountId)

    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getUserAccounts(optionalParamters?: OptionalParGeneric): Promise<UserAccountResponse | null>{
    try{
        return await userAccountService.getUserAccounts(optionalParamters)

    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getUserAccountNames(optionalParamters?: OptionalParInstitutionId): Promise<UserAccountName[] | null>{
    try{
        return await userAccountService.getUserAccountNames(optionalParamters)

    }catch(error){
        console.error(error);
        return null;
    }
}

export async function activateUserAccount(accountId: string): Promise<UserAccount | null>{
    try{
        return await userAccountService.activateUserAccount(accountId)

    }catch(error){
        console.error(error);
        return null;
    }
}

export async function deactivateUserAccount(accountId: string): Promise<UserAccount | null>{
    try{
        return await userAccountService.deactivateUserAccount(accountId)

    }catch(error){
        console.error(error);
        return null;
    }
}

export async function changePassword(uuid: string, password: string, newPassword: string, confirmNewPassword: string): Promise<UserAccount[] | null>{
  try{
        return await userAccountService.changePassword(uuid, password, newPassword, confirmNewPassword)

  }catch(error){
      console.error(error);
      return null;
  }
}
//==============================

export function disableEnableActionItem(action: string): boolean{
    const userAccountStore = useUserAccountStore();

    if(!userAccountStore.userAccount?.roles.includes('ADMIN')){
        return false;
    }

    if(action == "add"){
        return false;
    }

    return !userAccountStore.isAccountSelected;
}
