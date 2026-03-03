// TODO @alain: Ask Andreas, if we can delete this for now
export function throttle<TArgs extends unknown[]>(
    func: (...args: TArgs) => void,
    limit: number,
): (...args: TArgs) => void {
    let lastFunc: ReturnType<typeof setTimeout> | undefined;
    let lastRan: number | undefined;

    return function (...args: TArgs) {
        const now = Date.now();

        if (lastRan === undefined) {
            func(...args);
            lastRan = now;
        } else {
            if (lastFunc) clearTimeout(lastFunc);

            const remaining = Math.max(limit - (now - lastRan), 0);

            lastFunc = setTimeout(() => {
                const elapsed = Date.now() - (lastRan ?? 0);
                if (elapsed >= limit) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, remaining);
        }
    };
}

// TODO @alain: migrate this
export function createSessionDeleteUrlSuffix(sessionUuids: string[]): string {
    let urlSuffix = "?modelIds=";

    for (let i = 0; i < sessionUuids.length; i++) {
        urlSuffix += sessionUuids[i];

        if (i !== sessionUuids.length - 1) {
            urlSuffix += "&modelIds=";
        }
    }

    return urlSuffix;
}
