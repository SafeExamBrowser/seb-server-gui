const FILTER_VALUE_SEPARATOR = ",";

export function parseFilterValues(value: string | undefined): string[] {
    if (!value) {
        return [];
    }
    return value
        .split(FILTER_VALUE_SEPARATOR)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
}

export function serializeFilterValues(values: string[]): string | undefined {
    return values.length > 0 ? values.join(FILTER_VALUE_SEPARATOR) : undefined;
}

export function isFilterValueSelected(
    current: string | undefined,
    optionValue: string,
    multiple: boolean,
): boolean {
    if (!multiple) {
        return current === optionValue;
    }
    return parseFilterValues(current).includes(optionValue);
}

export function toggleFilterValue(
    current: string | undefined,
    optionValue: string,
    multiple: boolean,
): string | undefined {
    if (!multiple) {
        return current === optionValue ? undefined : optionValue;
    }
    const values = parseFilterValues(current);
    if (values.includes(optionValue)) {
        return serializeFilterValues(
            values.filter((value) => value !== optionValue),
        );
    }
    return serializeFilterValues([...values, optionValue]);
}

export function removeFilterValue(
    current: string | undefined,
    optionValue: string,
): string | undefined {
    return serializeFilterValues(
        parseFilterValues(current).filter((value) => value !== optionValue),
    );
}
