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

export function getCurrentDateString(): string{
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    
    return `${year}-${month}-${day}`;
}

export function formatDate(dateString: string): string{
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}