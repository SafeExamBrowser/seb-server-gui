import { toZonedTime } from "date-fns-tz";
import { useUserAccountStore } from "@/stores/authentication/authenticationStore";

// display dates according to the user's timezone
export function formatIsoDateToFullDate(
    dateString: string | null | undefined,
): string {
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
    const formatter = new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone,
        hour12: false,
    });

    // Get formatted parts
    const parts = formatter.formatToParts(date);

    // Build the formatted string
    const formattedParts: Record<string, string> = {};
    parts.forEach((part) => {
        formattedParts[part.type] = part.value;
    });

    // Create the formatted string in the required format: DD.MM.YYYY HH:MM:SS
    return `${formattedParts.day}.${formattedParts.month}.${formattedParts.year} ${formattedParts.hour}:${formattedParts.minute}:${formattedParts.second}`;
}

export function getCurrentDateString(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
}

export function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
}

export function formatIsoToReadableDateTime(dateStr?: string | null): string {
    if (!dateStr) return "";

    const date = new Date(dateStr);

    const datePart = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const timePart = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return `${datePart} • ${timePart}`; // e.g., August 7, 2025 • 11:18
}

export function formatTimestampToFullDate(timestamp: string | any): string {
    if (timestamp == "0" || timestamp == null) {
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

    return (
        day +
        "." +
        month +
        "." +
        year +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
    );
}

export function formatTimestampToDate(timestamp: number): string {
    if (timestamp == 0) {
        return "";
    }

    let date = new Date(timestamp);
    date = convertUTCToTimeZone(timestamp);

    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return day + "." + month + "." + year;
}

export function formatTimestampToTime(timestamp: number): string {
    if (timestamp == 0) {
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

    const hoursString: string = hours.toString().padStart(2, "0");
    const minutesString: string = minutes.toString().padStart(2, "0");
    const secondsString: string = seconds.toString().padStart(2, "0");

    return hoursString + ":" + minutesString + ":" + secondsString;
}

export function toSeconds(milliseconds: number): number {
    return Math.floor(milliseconds / 1000);
}

export function secondsToTimeString(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const hoursStr = String(hours).padStart(2, "0");
    const minutesStr = String(minutes).padStart(2, "0");
    const secondsStr = String(seconds).padStart(2, "0");

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

export function formatSqlDateToString(sqlDate: string): string {
    if (sqlDate.length == 0) {
        return "";
    }

    if (!sqlDate.includes("-")) {
        return "";
    }

    const [year, month, day] = sqlDate.split("-");
    return `${day}.${month}.${year}`;
}

export function getStartAndEndTimestampOfDay(sqlDate: string): {
    start: string;
    end: string;
} {
    const startTime = new Date(`${sqlDate}T00:01:00.000Z`).getTime();
    const endTime = new Date(`${sqlDate}T23:59:59.999Z`).getTime();

    return {
        start: startTime.toString(),
        end: endTime.toString(),
    };
}

function convertUTCToTimeZone(utcDate: number): Date {
    const userAccountStore = useUserAccountStore();

    const utcDateObject = new Date(utcDate);
    const timezone: string | undefined = userAccountStore.userAccount?.timezone;
    if (timezone == null) {
        return utcDateObject;
    }

    const dateInTimezone = toZonedTime(utcDateObject, timezone);

    return dateInTimezone;
}

export function calcTimePeriod(
    timePeriodSelect: number,
    timePeriodField: number,
): [string, string] {
    return [
        getTimestampFromPeriodSelection(timePeriodSelect, timePeriodField),
        Date.now().toString(),
    ];
}

export function calcTimeSelection(timeSelectionPicker: any): [string, string] {
    if (timeSelectionPicker.value == null) {
        return ["", ""];
    }

    return [
        timeSelectionPicker.value[0].getTime(),
        timeSelectionPicker.value[1].getTime(),
    ];
}

export function getTimestampFromPeriodSelection(
    timePeriod: number,
    amount: number,
): string {
    const now = new Date();

    switch (timePeriod) {
        case 1: // days
            now.setDate(now.getDate() - amount);
            break;

        case 2: // weeks
            now.setDate(now.getDate() - 7 * amount);
            break;

        case 3: // months
            now.setMonth(now.getMonth() - amount);
            break;

        case 4: // years
            now.setFullYear(now.getFullYear() - amount);
            break;
    }

    return now.getTime().toString();
}
