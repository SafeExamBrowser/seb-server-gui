import axios from 'axios';
import {Buffer} from 'buffer';
import * as ENV from "../config/envConfig";
import * as apiService from "../services/api.service";
import * as utils from "../utils/utils";
import {LOG} from "../logging/logger";



const tokenUrl: string = ENV.SEB_SERVER_URL + ENV.SEB_SERVER_PORT + "/oauth/token?grant_type=";
const jwtUrl: string = ENV.SEB_SERVER_URL + ENV.SEB_SERVER_PORT + "/oauth/jwttoken/verify";

export async function authorizeViaSebServer(username: string, password: string): Promise<object>{

    LOG.info("trying to log in...")
    LOG.info("url used: " + tokenUrl)
    LOG.info("credentials used: " + username + " " + password)

    const url: string = tokenUrl + "password&username=" + username + "&password=" + password;
    const encodedCredentials: string = utils.createEncodedCredentials(ENV.SEB_SERVER_USERNAME, ENV.SEB_SERVER_PASSWORD);

    const {data, status} = await axios.post(url, {}, {
        headers: apiService.getAuthorizationHeaders(encodedCredentials)
    });

    return data;
}

export async function verifyJwt(logintoken: string): Promise<object>{
    const url: string = jwtUrl;
    const encodedCredentials: string = utils.createEncodedCredentials(ENV.SEB_SERVER_USERNAME, ENV.SEB_SERVER_PASSWORD);

    const {data, status} = await axios.post(url, {logintoken}, {
        headers: apiService.getAuthorizationHeadersBasic(encodedCredentials)
    });

    return data;
}

export async function refreshViaSebServer(refreshToken: string): Promise<object>{
    const url: string = tokenUrl + "refresh_token&client_id=" + ENV.SEB_SERVER_USERNAME + "&refresh_token=" + refreshToken;
    const encodedCredentials: string = utils.createEncodedCredentials(ENV.SEB_SERVER_USERNAME, ENV.SEB_SERVER_PASSWORD);

    const {data, status} = await axios.post(url, {}, {
        headers: apiService.getAuthorizationHeaders(encodedCredentials)
    });

    return data;
}

export async function logLogin(token: string){
    const url: string = "/useraccount/loglogin";

    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});

    return data;
}

export async function logLogout(token: string){
    const url: string = "/useraccount/loglogout";
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});

    return data;
}