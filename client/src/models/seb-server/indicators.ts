type Indicators = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: Indicator[];
}

type Indicator = {
    id: number;
    examId: number;
    name: string;
    type: string;
    color?: string;
    icon?: string;
    tags?: string;
    thresholds?: Threshold[];
};


type IndicatorType = {
    BATTERY_STATUS: "BATTERY_STATUS",
    LAST_PING: "LAST_PING",
    ERROR_COUNT: "ERROR_COUNT",
    WARN_COUNT: "WARN_COUNT",
    INFO_COUNT: "INFO_COUNT",
}
