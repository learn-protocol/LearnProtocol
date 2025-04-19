import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function DDMMYYYYHHMM(date: Date | string): string {
    if (typeof date === "string") date = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, "0");

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function calculateHoursBetween(timestamp: string | number | Date): number {
    const now = new Date();
    const inputTime = new Date(timestamp);
    const millisecondsDifference = now.getTime() - inputTime.getTime();
    return millisecondsDifference / (1000 * 60 * 60);
}

export function daysToRelativeHistory(days: number): string {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;

    const parts: string[] = [];

    if (years > 0) {
        parts.push(`${years} year${years > 1 ? "s" : ""}`);
    }

    if (months > 0 && parts.length < 2) {
        parts.push(`${months} month${months > 1 ? "s" : ""}`);
    }

    if (remainingDays > 0 && parts.length < 2) {
        parts.push(`${remainingDays} day${remainingDays > 1 ? "s" : ""}`);
    }

    if (parts.length === 0) {
        return "today";
    }

    return parts.join(" ");
}

export function truncateWalletAddress(address: string, length = 5) {
    return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export function truncateUsername(username: string, length = 6) {
    if (username.length <= length * 2) return username;
    return `${username.slice(0, length)}...${username.slice(-length)}`;
}

export function stringToLinearGradient(input: string): string {
    const hash = Array.from(input).reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    function hashToColor(seed: number): string {
        const r = (seed >> 16) & 255;
        const g = (seed >> 8) & 255;
        const b = seed & 255;
        return `rgb(${r}, ${g}, ${b})`;
    }

    const color1 = hashToColor(hash);
    const color2 = hashToColor(hash * 37);

    return `linear-gradient(135deg, ${color1}, ${color2})`;
}

export function slugToTitle(slug: string) {
    const words = slug.split("-");
    const title = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return title;
}

export function queryToTitle(query: string) {
    const words = query.split("+");
    const title = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return title;
}

export function toCamelCase<T>(obj: Record<string, any>): T {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
            const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
            return [camelKey, value];
        }),
    ) as T;
}

export function toCamelCaseArray<T = any>(arr: Record<string, any>[]): T[] {
    return arr.map(item => toCamelCase<T>(item));
}
