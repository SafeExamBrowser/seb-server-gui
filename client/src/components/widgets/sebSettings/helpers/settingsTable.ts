import {
    PermittedProcessArgument,
    SEBSettingAttribute,
    SEBSettingsValue,
} from "@/models/seb-server/sebSettings.ts";
import { notify } from "@/services/notifications/notify";
import { stringToBoolean } from "@/utils/generalUtils.ts";

export const LIST_SEPARATOR: string = ",";
export const EMBEDDED_LIST_SEPARATOR: string = "|";
export const VALUE_SEPARATOR: string = "=";
export const ESCAPE_LIST_SEPARATOR: string = "__COMMA__";
export const ESCAPE_EMBEDDED_LIST_SEPARATOR: string = "__PIPE__";
export const ESCAPE_VALUE_SEPARATOR: string = "__EQ__";

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

    const list = args.split(LIST_SEPARATOR);
    list.forEach((line) => {
        try {
            const vals = line.split(EMBEDDED_LIST_SEPARATOR);
            result.push({
                active: vals[0].split("=")[1] === "true",
                argument: replaceTableValueEscapes(
                    vals[1].split(VALUE_SEPARATOR)[1],
                ),
            });
        } catch (err) {
            notify.warning(
                "Argument Parsing Error",
                "Unable to parse an argument value: " + err,
            );
        }
    });

    return result;
}

export function argumentsToString(args: PermittedProcessArgument[]): string {
    let result: string = "";
    args.forEach((item) => {
        if (result.length === 0) {
            result =
                result +
                "active=" +
                item.active +
                "|argument=" +
                escapeTableValue(item.argument);
        } else {
            result =
                result +
                ",active=" +
                item.active +
                "|argument=" +
                escapeTableValue(item.argument);
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

function escapeTableValue(value: string) {
    const escaped = value
        .replaceAll(LIST_SEPARATOR, ESCAPE_LIST_SEPARATOR)
        .replaceAll(EMBEDDED_LIST_SEPARATOR, ESCAPE_EMBEDDED_LIST_SEPARATOR)
        .replaceAll(VALUE_SEPARATOR, ESCAPE_VALUE_SEPARATOR);
    return escaped;
}

function replaceTableValueEscapes(value: string) {
    return value
        .replaceAll(ESCAPE_LIST_SEPARATOR, LIST_SEPARATOR)
        .replaceAll(ESCAPE_EMBEDDED_LIST_SEPARATOR, EMBEDDED_LIST_SEPARATOR)
        .replaceAll(ESCAPE_VALUE_SEPARATOR, VALUE_SEPARATOR);
}
