// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Token = {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    jti: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type JwtTokenResponse = {
    username: string;
    userUUID: string;
    redirect: string;
    login: {
        expiration: string;
        scope: string[];
        value: string;
        expiresIn: number;
        access_token: string;
        refresh_token: string;
        tokenType: string;
        jti: string;
        additionalInformation: object[];
        expired: boolean;
    };
};
