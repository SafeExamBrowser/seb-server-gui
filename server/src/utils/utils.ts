export function stringToBoolean(booleanValue: string): boolean{
    if(booleanValue == "true"){
        return true;
    }

    if(booleanValue == "false"){
        return false;
    }

    return false;
}

export function createEncodedCredentials(username: string, password: string): string{
    return Buffer.from(username + ":" + password).toString("base64");
}