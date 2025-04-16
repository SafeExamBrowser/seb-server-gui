export enum IndicatorEnum {
    LAST_PING = "LAST_PING",
    ERROR_COUNT = "ERROR_COUNT",
    WARN_COUNT = "WARN_COUNT",
    INFO_COUNT = "INFO_COUNT",
    BATTERY_STATUS = "BATTERY_STATUS",
    WLAN_STATUS = "WLAN_STATUS"
}

export type IndicatorObject = {
    indicatorType: IndicatorEnum | null; 
    indicatorValue: number; 
    indicatorObject: Indicator;
}