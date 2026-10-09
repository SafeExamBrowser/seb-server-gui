export type UrlExpectation = string | RegExp;

export type ListRequestConfig = {
    method: "GET";
    urlRegex: RegExp;
    expectedStatuses?: number[];
};

export type TableListPageConfig = {
    route: string;
    testIdBase: string;
    listRequest: ListRequestConfig;
};
