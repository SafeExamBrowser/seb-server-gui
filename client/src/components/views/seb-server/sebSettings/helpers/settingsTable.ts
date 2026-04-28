import {
    PermittedProcessArgument,
    SEBSettingAttribute,
    SEBSettingsValue,
} from "@/models/seb-server/sebSettings";
import { stringToBoolean } from "@/utils/generalUtils";

export function getStringValue(
    rowVals: Map<string, SEBSettingsValue>,
    attributes: Map<string, SEBSettingAttribute>,
    name: string,
): string {
    const prop = rowVals.get(name);
    if (!prop) {
        const def = attributes.get(name);
        if (!def) {
            return "";
        } else {
            return def.defaultValue;
        }
    } else {
        return prop.value;
    }
}

export function getBooleanValue(
    rowVals: Map<string, SEBSettingsValue>,
    attributes: Map<string, SEBSettingAttribute>,
    name: string,
): boolean {
    const prop = rowVals.get(name);
    if (!prop) {
        const def = attributes.get(name);
        if (!def) {
            return false;
        } else {
            return stringToBoolean(def.defaultValue);
        }
    } else {
        return stringToBoolean(prop.value);
    }
}

export function getPermittedProcessArguments(
    args: string | null,
): PermittedProcessArgument[] | [] {
    // NOTE args = active=true|argument=arg1,active=true|argument=arg2,...
    const result: PermittedProcessArgument[] = [];
    if (args == null || args.length === 0) {
        return result;
    }

    const list = args.split(",");
    list.forEach((line) => {
        const vals = line.split("|");
        result.push({
            active: vals[0].split("=")[1] === "true",
            argument: vals[1].split("=")[1],
        });
    });

    return result;
}

export function argumentsToString(args: PermittedProcessArgument[]): string {
    let result: string = "";
    args.forEach((item) => {
        if (result.length === 0) {
            result =
                result + "active=" + item.active + "|argument=" + item.argument;
        } else {
            result =
                result +
                ",active=" +
                item.active +
                "|argument=" +
                item.argument;
        }
    });
    return result;
}

export function getSettingId(
    rowVals: Map<string, SEBSettingsValue>,
    name: string,
): number {
    const prop = rowVals.get(name);
    return prop ? prop.id : 0;
}
