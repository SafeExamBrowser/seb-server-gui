export const SEB_SERVER_URL = process.env.SEB_SERVER_URL;
export const SEB_SERVER_PORT = getServerPort();
export const SEB_SERVER_DEFAULT_URL = process.env.SEB_SERVER_DEFAULT_URL;

export const NODE_ENV = process.env.NODE_ENV;
export const SERVER_PORT = process.env.SERVER_PORT || "";

export const DEV_SERVER_URL = process.env.DEV_SERVER_URL;
export const DEV_SERVER_PORT = process.env.DEV_SERVER_PORT;

// TODO rename this into SEB_WEBSERVICE_CLIENT_NAME and SEB_WEBSERVICE_CLIENT_SECRET
export const SEB_SERVER_USERNAME = process.env.SEB_SERVER_USERNAME;
export const SEB_SERVER_PASSWORD = process.env.SEB_SERVER_PASSWORD;

function getServerPort(){
    if(!process.env.SEB_SERVER_PORT){
        return "";
    }
    return ":" + process.env.SEB_SERVER_PORT;
};