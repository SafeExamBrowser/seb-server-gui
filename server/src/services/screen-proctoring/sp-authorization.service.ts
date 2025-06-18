import axios from 'axios';
import {Buffer} from 'buffer';
import * as ENV from "../../config/envConfig";
import * as apiService from "../../services/screen-proctoring/sp-api.service";
import * as utils from "../../utils/utils";
import FormData from "form-data";


const tokenUrl: string = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT + "/oauth/token?grant_type=";
const jwtUrl: string = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT + "/oauth/jwttoken/verify";

export async function authorizeViaScreenProctoringServer(username: string, password: string) {
    const url: string = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT + "/oauth/token";
    const encodedCredentials: string = utils.createEncodedCredentials(
        ENV.PROCTOR_SERVER_USERNAME,
        ENV.PROCTOR_SERVER_PASSWORD
    );

    const body = new URLSearchParams();
    body.append("grant_type", "password");
    body.append("username", username);
    body.append("password", password);

    const { data, status } = await axios.post(url, body.toString(), {
        headers: {
            ...apiService.getAuthorizationHeadersBasic(encodedCredentials),
        }
    });

    return [data, status];
}

export async function verifyJwt(logintoken: string): Promise<[object, number]>{
    const url: string = jwtUrl;
    const encodedCredentials: string = utils.createEncodedCredentials(ENV.PROCTOR_SERVER_USERNAME, ENV.PROCTOR_SERVER_PASSWORD);

    const {data, status} = await axios.post(url, {logintoken}, {
        headers: apiService.getAuthorizationHeadersBasic(encodedCredentials)
    });

    return [data, status];
}

export async function refreshToken(refreshToken: string): Promise<[object, number]>{
    const url: string = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT + "/oauth/token";
    const encodedCredentials: string = utils.createEncodedCredentials(ENV.PROCTOR_SERVER_USERNAME, ENV.PROCTOR_SERVER_PASSWORD);

    const formData = new FormData();
    formData.append("refresh_token", refreshToken);
    formData.append("grant_type", "refresh_token");

    const {data, status} = await axios.post(url, formData, {
        headers: apiService.getAuthorizationHeaders(encodedCredentials)
    });

    return [data, status];
}

export async function logLogin(token: string): Promise<[object, number]>{
    const url: string = "/useraccount/loglogin";
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function logLogout(token: string): Promise<[object, number]>{
    const url: string = "/useraccount/loglogout";
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});

    return [data, status];
}