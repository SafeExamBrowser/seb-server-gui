import { useUserAccountStore } from "@/stores/store";
import { toZonedTime } from "date-fns-tz";


export function formatTimestampToFullDate(timestamp: string | any): string{
    if(timestamp == "0" || timestamp == null){
        return "";
    }

    let date = new Date(timestamp);
    date = convertUTCToTimeZone(timestamp);

    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return day + "." + month + "." + year + " " + hours + ":" + minutes + ":" + seconds; 
}

export function formatTimestampToDate(timestamp: number): string{
    if(timestamp == 0){
        return "";
    }

    let date = new Date(timestamp);
    date = convertUTCToTimeZone(timestamp);

    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return day + "." + month + "." + year; 
}

export function formatTimestampToTime(timestamp: number): string{
    if(timestamp == 0){
        return "";
    }

    let date = new Date(timestamp);
    date = convertUTCToTimeZone(timestamp);

    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return hours + ":" + minutes + ":" + seconds; 
}

export function toTimeString(milliseconds: number): string {
    let totalSeconds: number = Math.floor(milliseconds / 1000);

    const hours: number = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes: number = Math.floor(totalSeconds / 60);
    const seconds: number = totalSeconds % 60;

    const hoursString: string = hours.toString().padStart(2, '0');
    const minutesString: string = minutes.toString().padStart(2, '0');
    const secondsString: string = seconds.toString().padStart(2, '0');

    return hoursString + ":" + minutesString + ":" + secondsString;
}

export function toSeconds(milliseconds: number): number {
    return Math.floor(milliseconds / 1000);
}

export function secondsToTimeString(seconds: number): string{
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

export function formatSqlDateToString(sqlDate: string): string{
    if(sqlDate.length == 0){
        return "";
    }

    if(!sqlDate.includes("-")){
        return "";
    }

    const [year, month, day] = sqlDate.split('-');
    return `${day}.${month}.${year}`;
}

export function getStartAndEndTimestampOfDay(sqlDate: string): {start: string, end: string}{
    const startTime = new Date(`${sqlDate}T00:01:00.000Z`).getTime();
    const endTime = new Date(`${sqlDate}T23:59:59.999Z`).getTime();

    return {
        start: startTime.toString(),
        end: endTime.toString()
    }
}

function convertUTCToTimeZone(utcDate: number): Date {
    const userAccountStore = useUserAccountStore();

    const utcDateObject = new Date(utcDate);
    const timezone: string | undefined = userAccountStore.userAccount?.timezone;
    if(timezone == null){
        return utcDateObject;
    }

    const dateInTimezone = toZonedTime(utcDateObject, timezone);

    return dateInTimezone;
}

export function formatIsoDateToFullDate(inputDate: string | null | undefined): string {
    //todo check timezone stuff

    if(inputDate == null){
        return "";
    }

    // Parse the input date string into a Date object
    const date = new Date(inputDate);

    if (isNaN(date.getTime())) {
        return "";
    }

    // Format the date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    // Format the time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Combine the formatted components into the desired format
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

export function setIsoTimeToZero(inputDate: string): string{
    const dateAppendix: string = "T00:00:00Z";
    const inputDateSplitted: string[] = inputDate.split("T");

    return inputDateSplitted[0] + dateAppendix;
}