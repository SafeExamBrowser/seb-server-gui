import * as userAccountService from "@/services/api-services/userAccountService";
import { useUserAccountStore } from "@/stores/app";

export async function setPersonalUserAccount(): Promise<UserAccount | null>{
    const userAccountStore = useUserAccountStore();

    try{
        if(userAccountStore.userAccount == null){
            userAccountStore.userAccount = await userAccountService.getPersonalUserAccount();

            if(userAccountStore.userAccount != null){
                return userAccountStore.userAccount;
            }
        }

        return userAccountStore.userAccount!;

    }catch(error){
        console.error(error);
        return null;
    }

}

//=============api==================
export async function getUserAccountById(accountId: string): Promise<UserAccount[] | any>{
    try{
        const userAccount = await userAccountService.getUserAccountById(accountId)

        return userAccount;

    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getUserAccounts(optionalParamters?: OptionalParGeneric): Promise<UserAccountResponse[] | any>{
    try{
        const userAccounts = await userAccountService.getUserAccounts(optionalParamters)

        return userAccounts;

    }catch(error){
        console.error(error);
        return null;
    }
}

export async function activateUserAccount(accountId: string): Promise<UserAccount | any>{
    try{
        const userAccount = await userAccountService.activateUserAccount(accountId)

        return userAccount;

    }catch(error){
        console.error(error);
        return null;
    }
}

export async function deactivateUserAccount(accountId: string): Promise<UserAccount | any>{
    try{
        const userAccount = await userAccountService.deactivateUserAccount(accountId)

        return userAccount;

    }catch(error){
        console.error(error);
        return null;
    }
}

export async function changePassword(uuid: string, password: string, newPassword: string, confirmNewPassword: string): Promise<UserAccount[] | any>{
  try{
      const userAccount = await userAccountService.changePassword(uuid, password, newPassword, confirmNewPassword)
      return userAccount;

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
