type LmsTemplates = {
    number_of_pages: number,
    page_number: number,
    page_size: number,
    content: LmsTemplate[]
}

type LmsTemplate = {
    id: number,
    institutionId: number,
    name: string,
    lmsType: string,
    lmsClientname: string,
    lmsClientsecret: string,
    lmsUrl: string,
    lmsRestApiToken: string
    lmsProxyHost: string
    lmsProxyPort: string
    lmsProxyAuthUsername: string
    lmsProxyAuthSecret: string
    active: boolean,
    updateTime: string,
    connectionId: string
    integrationActive: string
}
