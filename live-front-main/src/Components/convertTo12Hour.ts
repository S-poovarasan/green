export function convertTo12Hour(time: string) {
    if (time) {
        const [hour, minute] = time.split(":");
        let h = parseInt(hour, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12; // convert 0 -> 12
        return `${h}:${minute} ${ampm}`;
    } else {
        return "";
    }
}
