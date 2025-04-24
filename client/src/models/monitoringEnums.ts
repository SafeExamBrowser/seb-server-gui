export enum MonitoringHeaderEnum {
    HIDDEN_CLIENT_GROUPS = "hidden-client-group",
    HIDDEN_STATES = "hidden-states",
    HIDDEN_ISSUES = "hidden-issues",

    SHOW_ALL = "show-all",        
    SHOW_STATES = "show-states",        
    SHOW_CLIENT_GROUPS = "show-client-groups",
    SHOW_INDICATORS = "show-indicators",
    SHOW_NOTIFCATION = "show-notifications"
}   

export enum IndicatorEnum {
    LAST_PING = "LAST_PING",
    ERROR_COUNT = "ERROR_COUNT",
    WARN_COUNT = "WARN_COUNT",
    INFO_COUNT = "INFO_COUNT",
    BATTERY_STATUS = "BATTERY_STATUS",
    WLAN_STATUS = "WLAN_STATUS"
}

export enum NotificationEnum {
    LOCK_SCREEN = "LOCK_SCREEN",
    RAISE_HAND = "RAISE_HAND"
}

export type IndicatorObject = {
    indicatorType: IndicatorEnum | null; 
    indicatorValue: number; 
    indicatorObject: Indicator;
}