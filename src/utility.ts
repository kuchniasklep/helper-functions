export function safeJsonParse<T>(jsonString?: string | null): T | null {
    if (!jsonString) return null;

    try {
        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error(`Error parsing JSON:`, error);
        return null;
    }
}

export function chunk<T>(array: T[], size: number): T[][] {
    if (size <= 0)
        return []

    const result: T[][] = [];

    for (let i = 0; i < array.length; i += size) {
        const chunk = array.slice(i, i + size);
        result.push(chunk);
    }
    return result;
}