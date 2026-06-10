import { useEffect, useState } from "react";

export function useLiveDateTime(initialTimestamp: string | null): string {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        if (!initialTimestamp) return;

        const start = new Date(initialTimestamp.replace(" ", "T"));
        setTime(start);

        const interval = setInterval(() => {
            setTime(prev => new Date((prev?.getTime() || start.getTime()) + 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [initialTimestamp]);

    if (!time) return "";

    // Format: Monday, July 22, 2025 | 10:30 AM
    const formatted = time.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    return formatted.replace(",", "");
}

export function formatPrettyDate(timestamp: string): string {
    const date = new Date(timestamp.replace(" ", "T"));

    return date.toLocaleString("en-US", {
        weekday: "long",        // Saturday
        month: "long",          // November
        day: "numeric",         // 29
        year: "numeric",        // 2025
        hour: "numeric",        // 3
        minute: "2-digit",      // 46
        second: "2-digit",      // 16
        hour12: true            // PM
    }).replace(",", "")         // remove extra comma after weekday
        .replace(" ", ", ");      // format like Saturday, November 29, 2025
}

export function formatPrettyDateOnly(timestamp: string): string {
    const date = new Date(timestamp.replace(" ", "T"));

    return date.toLocaleString("en-US", {
        month: "long",          // November
        day: "numeric",         // 29
        year: "numeric",        // 2025
    }).replace(",", "")         // remove extra comma after weekday
        .replace(" ", ", ");      // format like Saturday, November 29, 2025
}