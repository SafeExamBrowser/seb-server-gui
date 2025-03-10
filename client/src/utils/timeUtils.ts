import { useUserAccountStore } from "@/stores/store";
import { toZonedTime } from "date-fns-tz";
import * as userAccountViewService from "@/services/component-services/userAccountViewService";
import {DateTime} from "luxon";



//display dates according to the user's timezone
export function formatIsoDateToFullDate(dateString: string | null | undefined): string {
    const userAccountStore = useUserAccountStore();
    const timeZone: string = userAccountStore.getUserTimeZone();

    if (dateString == null) {
        return "";
    }

    // Parse the input date string
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return "";
    }
    
    // Format the date using Intl.DateTimeFormat with the specified timezone
    const formatter = new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timeZone,
        hour12: false
    });
    
    // Get formatted parts
    const parts = formatter.formatToParts(date);
    
    // Build the formatted string
    const formattedParts: Record<string, string> = {};
    parts.forEach(part => {
        formattedParts[part.type] = part.value;
    });
    
    // Create the formatted string in the required format: DD.MM.YYYY HH:MM:SS
    return `${formattedParts.day}.${formattedParts.month}.${formattedParts.year} ${formattedParts.hour}:${formattedParts.minute}:${formattedParts.second}`;
}

//
export function setIsoTimeToZero_old(inputDate: Date): string{
    const userAccountStore = useUserAccountStore();

    console.log(userAccountStore.getUserTimeZone()) 
    let convertedDate: Date = convertDateWithTimeZone(inputDate);

    // Get the equivalent UTC date components
    const utcYear = convertedDate.getUTCFullYear();
    const utcMonth = convertedDate.getUTCMonth() + 1; // Months are zero-based
    const utcDay = convertedDate.getUTCDate();

    console.log("inputDate: " + inputDate)
    console.log("convertedDate " + convertedDate)
    console.log("outputDate " + `${utcYear}-${String(utcMonth).padStart(2, '0')}-${String(utcDay).padStart(2, '0')}T00:00:00Z`)

    // Format as ISO string with T00:00:00Z (always at UTC midnight)
    return `${utcYear}-${String(utcMonth).padStart(2, '0')}-${String(utcDay).padStart(2, '0')}T00:00:00Z`;
}


//takes a date from the datepicker, puts time to 0 and converts it to UTC
export function setIsoTimeToZero(inputDate: Date): string {
    const userAccountStore = useUserAccountStore();
    const timeZone: string = userAccountStore.getUserTimeZone();

    
    // Create a date formatter that respects the user's timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    
    // Format the date in user's timezone
    const formattedDateParts = formatter.formatToParts(inputDate);
    
    // Extract year, month, and day from the formatted date
    const dateMap: Record<string, string> = {};
    formattedDateParts.forEach(part => {
      if (part.type !== 'literal') {
        dateMap[part.type] = part.value;
      }
    });
    
    // Create a new date at 00:00:00 in the user's timezone
    // Note: months in JavaScript Date are 0-indexed, so we subtract 1 from the month
    const userDateAtStartOfDay = new Date(
      Date.UTC(
        parseInt(dateMap.year, 10),
        parseInt(dateMap.month, 10) - 1,
        parseInt(dateMap.day, 10),
        0, 0, 0, 0
      )
    );

    console.log("input Date in millis: " + inputDate.getMilliseconds());
    console.log("input Date in utc millis: " + inputDate.getUTCSeconds());

    console.log("inputDate " + inputDate)
    console.log("timeZone: " + timeZone)
    console.log("output " + userDateAtStartOfDay.toISOString())
    
    // Convert to ISO string (which will represent the time in UTC)
    return userDateAtStartOfDay.toISOString().replace('.000Z', 'Z');
  }



export function getCurrentDateString(): string{
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    
    return `${year}-${month}-${day}`;
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

function convertDateWithTimeZone(date: Date): Date {
    return toZonedTime(date, useUserAccountStore().getUserTimeZone());
}














// //formatIsoDateToFullDate
// export function formatIsoDateToFullDate(inputDate: string | null | undefined): string {
//     const userAccountStore = useUserAccountStore();
//     const timeZone: string = userAccountStore.getUserTimeZone();

//     if (inputDate == null) {
//         return "";
//     }

//     // Parse the input date string into a Date object
//     // const date = new Date(inputDate);
//     // const date = convertDateWithTimeZone(new Date(inputDate));

//     const date_temp = DateTime.fromISO(inputDate, {zone: timeZone});
//     const date = new Date(date_temp.toString());

//     if (isNaN(date.getTime())) {
//         return "";
//     }

//     // Format the date using Intl.DateTimeFormat with the provided timezone
//     const formatter = new Intl.DateTimeFormat('de-CH', {
//         timeZone,
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         hour12: false
//     });

//     // Format the date and extract components
//     const formattedParts = formatter.formatToParts(date);
    
//     const day = formattedParts.find(part => part.type === 'day')?.value ?? "00";
//     const month = formattedParts.find(part => part.type === 'month')?.value ?? "00";
//     const year = formattedParts.find(part => part.type === 'year')?.value ?? "0000";
//     const hours = formattedParts.find(part => part.type === 'hour')?.value ?? "00";
//     const minutes = formattedParts.find(part => part.type === 'minute')?.value ?? "00";
//     const seconds = formattedParts.find(part => part.type === 'second')?.value ?? "00";

//     console.log("inputDate: " + inputDate)
//     console.log("input: " + date)
//     console.log("used timezone: " + timeZone)
//     console.log("output: " + `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`)

//     return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
// }










//==========not used atm============
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
//========================================================